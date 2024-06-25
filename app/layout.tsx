import type { Metadata } from "next";
import localFont from 'next/font/local';
import "./globals.css";
import "xp.css/dist/XP.css";

const msSansSerif = localFont({
  src: [
    {
      path: './fonts/ms-sans-serif-1.ttf',
      weight: '400'
    }
  ]
})

export const metadata: Metadata = {
  title: "XP GPT",
  description: "Windows XP themed, Chat GPT interface",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${msSansSerif.className} antialiased`}>{children}</body>
    </html>
  );
}
