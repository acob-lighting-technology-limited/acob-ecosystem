import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ecosystem.acoblighting.com"),
  title: "ACOB Ecosystem — Every ACOB platform, one place",
  description:
    "The central gateway to the ACOB Lighting Technology Limited digital ecosystem — corporate site, ERP, Beverly, and company webmail.",
  openGraph: {
    title: "ACOB Ecosystem",
    description: "Every ACOB platform, one place.",
    url: "https://ecosystem.acoblighting.com",
    siteName: "ACOB Ecosystem",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#03090a",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${jakarta.variable} antialiased`}>{children}</body>
    </html>
  );
}
