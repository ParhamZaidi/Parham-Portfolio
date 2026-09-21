import type { Metadata } from "next";
import "./globals.css";
import PlaygroundTools from "@/components/PlaygroundTools";

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
      <body>
        <PlaygroundTools>{children}</PlaygroundTools>
      </body>
    </html>
  );
}
