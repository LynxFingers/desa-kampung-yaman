import { Header } from "@/components/public/header";
import { Footer } from "@/components/public/footer";
import { getSiteSettings } from "@/lib/data/settings";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();

  return (
    <div className="min-h-screen bg-[var(--color-shell)] p-2 sm:p-4 lg:p-6">
      <div className="relative mx-auto flex min-h-[calc(100vh-1rem)] max-w-[1440px] flex-col rounded-[1.75rem] bg-[var(--color-container)] shadow-float sm:rounded-[2.5rem]">
        <Header villageName={settings.village_name} logoUrl={settings.logo_url} />
        <main className="flex-1">{children}</main>
        <Footer settings={settings} />
      </div>
    </div>
  );
}
