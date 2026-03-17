import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DevPulse — GitHub Activity Analytics",
  description:
    "Decode any developer's GitHub story. Explore commit patterns, language trends, PR velocity, and productivity rhythms in a single, elegant dashboard.",
  keywords: ["GitHub analytics", "developer insights", "commit history", "open source"],
  authors: [{ name: "DevPulse" }],
  openGraph: {
    title: "DevPulse — GitHub Activity Analytics",
    description: "Decode the developer. Discover the story.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#121212",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-charcoal text-[#f0f0f0] antialiased">{children}</body>
    </html>
  );
}
