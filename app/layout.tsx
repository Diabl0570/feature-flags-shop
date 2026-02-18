import type { Metadata } from "next";
import "./globals.css";
import FlagsToolbar from "@/components/FlagsToolbar";

export const metadata: Metadata = {
  title: "Demo Shop - eCommerce Store",
  description: "A demo eCommerce application with feature flags",
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
        <FlagsToolbar />
      </body>
    </html>
  );
}
