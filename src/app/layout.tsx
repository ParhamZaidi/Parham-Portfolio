import type { Metadata } from "next";
import "./globals.css";
import PlaygroundTools from "@/components/PlaygroundTools";
import IntroLoader from "@/components/IntroLoader";
import SideDock from "@/components/SideDock";
import CustomCursor from "@/components/CustomCursor";
import { ThemeProvider } from "@/context/ThemeContext";
import { LetterModalProvider } from "@/context/LetterModalContext";

export const metadata: Metadata = {
  title: "Parham Ailia — Product Designer",
  description:
    "Portfolio of Parham Ailia, a product designer crafting thoughtful digital experiences.",
};

// Sets data-theme on <html> before hydration so the stored theme
// doesn't flash the opposite theme for a frame on load.
const NO_FLASH_SCRIPT = `
(function () {
  try {
    var t = localStorage.getItem("site-theme");
    if (t === "day" || t === "night") {
      document.documentElement.setAttribute("data-theme", t);
    }
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: NO_FLASH_SCRIPT }} />
      </head>
      <body>
        <ThemeProvider>
          <LetterModalProvider>
            <PlaygroundTools>{children}</PlaygroundTools>
            <IntroLoader />
            <SideDock />
            <CustomCursor />
          </LetterModalProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
