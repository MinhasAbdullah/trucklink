import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TruckLink — The Road to Better Opportunities",
  description:
    "Connecting verified drivers with trusted recruiters. Faster hiring for a stronger trucking industry.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
