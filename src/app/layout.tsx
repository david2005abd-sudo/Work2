import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nados AI — منصة ذكاء اصطناعي عربية أولًا",
  description:
    "منصة ذكاء اصطناعي عربية أولًا، مجانية في نسختها الأساسية: محادثة مع نماذج LLM متعددة، بث الردود، إدارة كاملة للمحادثات، ومكتبة شخصية.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className="antialiased">{children}</body>
    </html>
  );
}
