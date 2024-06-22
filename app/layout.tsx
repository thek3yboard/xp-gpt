import type { Metadata } from "next";
import localFont from 'next/font/local';
import "./globals.css";

const tahoma = localFont({
  src: [
    {
      path: './fonts/tahoma.ttf',
      weight: '400'
    },
    {
      path: './fonts/tahomabd.ttf',
      weight: '700'
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
      <body className={tahoma.className}>{children}</body>
    </html>
  );
}
