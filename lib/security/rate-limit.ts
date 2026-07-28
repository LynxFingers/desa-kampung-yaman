import { headers } from "next/headers";
import { createServiceClient } from "@/lib/supabase/server";

const MAX_ATTEMPTS_PER_EMAIL = 5;
const MAX_ATTEMPTS_PER_IP = 20;
const WINDOW_MINUTES = 15;

export interface RateLimitCheck {
  blocked: boolean;
  retryAfterMinutes?: number;
}

/** Best-effort extraction of the caller's IP from forwarding headers. */
export async function getClientIp(): Promise<string | null> {
  try {
    const headerList = await headers();
    const forwardedFor = headerList.get("x-forwarded-for");
    if (forwardedFor) return forwardedFor.split(",")[0]!.trim();
    return headerList.get("x-real-ip");
  } catch {
    return null;
  }
}

/**
 * Checks whether a login email and/or IP has exceeded the allowed number of
 * failed attempts within the sliding window. Fails open (never blocks) if
 * the rate-limit table can't be reached, so a Supabase hiccup never locks
 * admins out of the dashboard.
 */
export async function checkLoginRateLimit(email: string, ip: string | null): Promise<RateLimitCheck> {
  try {
    const supabase = createServiceClient();
    const since = new Date(Date.now() - WINDOW_MINUTES * 60 * 1000).toISOString();

    const { data: emailAttempts } = await supabase
      .from("login_attempts")
      .select("created_at")
      .eq("email", email.toLowerCase())
      .eq("success", false)
      .gte("created_at", since)
      .order("created_at", { ascending: true });

    if (emailAttempts && emailAttempts.length >= MAX_ATTEMPTS_PER_EMAIL) {
      return { blocked: true, retryAfterMinutes: minutesUntilExpiry(emailAttempts[0].created_at) };
    }

    if (ip) {
      const { data: ipAttempts } = await supabase
        .from("login_attempts")
        .select("created_at")
        .eq("ip", ip)
        .eq("success", false)
        .gte("created_at", since)
        .order("created_at", { ascending: true });

      if (ipAttempts && ipAttempts.length >= MAX_ATTEMPTS_PER_IP) {
        return { blocked: true, retryAfterMinutes: minutesUntilExpiry(ipAttempts[0].created_at) };
      }
    }

    return { blocked: false };
  } catch {
    return { blocked: false };
  }
}

/** Records a login attempt (success or failure) for future rate-limit checks. */
export async function recordLoginAttempt(email: string, ip: string | null, success: boolean): Promise<void> {
  try {
    const supabase = createServiceClient();
    await supabase.from("login_attempts").insert({ email: email.toLowerCase(), ip, success });

    // Best-effort housekeeping so the table doesn't grow forever.
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    await supabase.from("login_attempts").delete().lt("created_at", cutoff);
  } catch {
    // Non-fatal: if logging the attempt fails, login itself should still proceed.
  }
}

function minutesUntilExpiry(oldestAttemptIso: string): number {
  const oldest = new Date(oldestAttemptIso).getTime();
  const expiresAt = oldest + WINDOW_MINUTES * 60 * 1000;
  return Math.max(1, Math.ceil((expiresAt - Date.now()) / 60000));
}
