import type { Metadata } from "next";
import "./globals.css";
import FlagsToolbar from "@/components/FlagsToolbar";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Suspense } from "react";
import { StaffToolbar } from "@/components/staff-toolbar";

export const metadata: Metadata = {
  title: "Demo Shop - eCommerce Store",
  description: "A demo eCommerce application with feature flags",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <FlagsToolbar />
        <SpeedInsights />
        <Suspense fallback={null}>
          <StaffToolbar />
        </Suspense>
      </body>
    </html>
  );
}
