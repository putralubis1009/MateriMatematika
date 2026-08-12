import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "Kelas MTK Dewi — Platform Guru Matematika",
    template: "%s | Kelas MTK Dewi",
  },
  description:
    "Platform modern untuk guru matematika: catat materi, atur jadwal, kelola tugas siswa, dan dapatkan rekomendasi AI berdasarkan jenjang kelas.",
  keywords: ["matematika", "guru", "materi ajar", "jadwal", "AI", "pendidikan", "SD", "SMP", "SMA"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${inter.variable} ${jakarta.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full bg-slate-50 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
