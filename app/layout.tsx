import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Desa Kampung Yaman",
    template: "%s | Desa Kampung Yaman",
  },
  description: "Website resmi Desa Kampung Yaman — informasi profil, pemerintahan, berita, UMKM, dan galeri desa.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="antialiased">{children}</body>
    </html>
  );
}
