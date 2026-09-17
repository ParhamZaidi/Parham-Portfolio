import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Parham Ailia — Product Designer",
  description:
    "Portfolio of Parham Ailia, a product designer crafting thoughtful digital experiences.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
