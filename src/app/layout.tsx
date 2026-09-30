import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { socials } from "@/lib/socials";
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
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f8f5" },
    { media: "(prefers-color-scheme: dark)", color: "#03090a" },
  ],
};

// Lets search engines tie the official social profiles to ACOB's knowledge panel.
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "ACOB Lighting Technology Limited",
  url: "https://www.acoblighting.com",
  logo: "https://ecosystem.acoblighting.com/images/acob-mark.webp",
  email: "info@acoblighting.com",
  telephone: "+2347049202634",
  sameAs: socials.map((social) => social.href),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${jakarta.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
