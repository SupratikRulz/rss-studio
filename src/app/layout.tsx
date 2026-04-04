import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import ThemeProvider from "@/components/layout/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RSS Studio",
  description: "A clean, minimal RSS reader for staying informed",
};

const clerkAppearance = {
  variables: {
    colorPrimary: "#059669",
    colorTextOnPrimaryBackground: "#ffffff",
    colorBackground: "#ffffff",
    colorText: "#111827",
    colorInputBackground: "#ffffff",
    colorInputText: "#111827",
    borderRadius: "0.75rem",
    fontFamily:
      "var(--font-geist-sans), system-ui, -apple-system, sans-serif",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-white dark:bg-neutral-950 text-gray-900 dark:text-neutral-100 transition-colors">
        <ClerkProvider appearance={clerkAppearance}>
          <ThemeProvider>{children}</ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
