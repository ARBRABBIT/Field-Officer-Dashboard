import type { Metadata } from "next";
import "@/styles/globals.css";
import { NavigationSwitcher } from "@/components/navigation-switcher";

export const metadata: Metadata = {
  title: "GLC Field Operations & Design System",
  description: "Reusable foundations and dashboard screens for Green Land Capital.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
        />
      </head>
      <body>
        {children}
        <NavigationSwitcher />
      </body>
    </html>
  );
}
