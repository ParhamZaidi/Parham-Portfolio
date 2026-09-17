import {
  SiFigma,
  SiFramer,
  SiSketch,
  SiLottiefiles,
  SiMarvelapp,
  SiAirtable,
  SiNotion,
  SiMiro,
} from "react-icons/si";
import type { IconType } from "react-icons";

export const tools: Record<string, { icon: IconType; label: string }> = {
  figma: { icon: SiFigma, label: "Figma" },
  framer: { icon: SiFramer, label: "Framer" },
  sketch: { icon: SiSketch, label: "Sketch" },
  lottiefiles: { icon: SiLottiefiles, label: "LottieFiles" },
  marvelapp: { icon: SiMarvelapp, label: "Marvel" },
  airtable: { icon: SiAirtable, label: "Airtable" },
  notion: { icon: SiNotion, label: "Notion" },
  miro: { icon: SiMiro, label: "Miro" },
};
