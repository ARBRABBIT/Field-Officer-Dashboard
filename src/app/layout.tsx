import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "@/styles/globals.css";
import { NavigationSwitcher } from "@/components/navigation-switcher";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "GLC Field Operations & Design System",
  description: "Reusable foundations and dashboard screens for Green Land Capital.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={plusJakartaSans.variable}>
      <body>
        {children}
        <NavigationSwitcher />
      </body>
    </html>
  );
}
