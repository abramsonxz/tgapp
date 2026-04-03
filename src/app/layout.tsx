import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QuestBoard — Геймифицированный таск-менеджер",
  description:
    "Продвинутый task-manager с геймификацией. Выполняйте задачи, получайте EXP и повышайте уровень!",
  keywords: [
    "task manager",
    "геймификация",
    "Telegram Mini App",
    "продуктивность",
    "EXP",
  ],
  openGraph: {
    title: "QuestBoard",
    description: "Геймифицированный таск-менеджер для Telegram",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0f0f1a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="dark" suppressHydrationWarning>
      <head>
        <script
          src="https://telegram.org/js/telegram-web-app.js"
          async
          defer
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0f0f1a] text-white`}
      >
        {children}
      </body>
    </html>
  );
}
