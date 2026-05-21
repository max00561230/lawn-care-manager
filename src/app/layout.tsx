import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LawnCare Manager Pro",
  description: "Manage your lawn care business — scheduling, customers, payments, and more.",
  manifest: "/manifest.json",
  icons: {
    icon: "/jrt-logo.png",
    apple: "/jrt-logo.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#14532d",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}