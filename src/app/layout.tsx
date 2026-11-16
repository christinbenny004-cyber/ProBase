import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import "./globals.css";

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ProBase Platform – Active Hospitals",
  description: "Enterprise hospital administration and organisation management platform.",
};

const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem("probase-theme");
    var root = document.documentElement;
    if (stored === "light") {
      root.classList.remove("dark");
      root.classList.add("light");
    } else {
      root.classList.add("dark");
      root.classList.remove("light");
    }
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${ibmPlexSans.variable} h-full dark antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-full bg-[var(--bg-app)] text-[var(--text-primary)] selection:bg-[#1686D9]/30 selection:text-[var(--text-primary)]"
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
