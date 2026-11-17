import path from "path";
import type { NextConfig } from "next";

// Pamiot's real-chat mode needs a server-side API route (to call Gemini
// without exposing the key), which a static export can't host — so this
// now deploys as a normal Vercel app instead of static HTML.
const nextConfig: NextConfig = {
  // A stray package-lock.json in the home directory was making Next.js
  // guess the workspace root one level too high, so its build-trace step
  // scanned the whole home folder (including a OneDrive-synced mount) and
  // timed out there. Pinning the root to this project folder avoids that.
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
