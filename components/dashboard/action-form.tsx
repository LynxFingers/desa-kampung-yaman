"use client";

import { useActionState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { ActionResult } from "@/types/database";

const initialState: ActionResult = { success: false, message: undefined };

export function ActionForm({
  action,
  children,
  redirectTo,
  className,
}: {
  action: (prevState: ActionResult, formData: FormData) => Promise<ActionResult>;
  children: React.ReactNode;
  redirectTo?: string;
  className?: string;
}) {
  const [state, formAction] = useActionState(action, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state.success && redirectTo) {
      router.push(redirectTo);
    }
  }, [state.success, redirectTo, router]);

  return (
    <form action={formAction} className={className}>
      {state.message && (
        <div
          className={`mb-4 rounded-lg px-4 py-3 text-sm ${
            state.success
              ? "bg-green-50 text-[var(--color-success)]"
              : "bg-red-50 text-[var(--color-error)]"
          }`}
        >
          {state.message}
        </div>
      )}
      {children}
    </form>
  );
}
