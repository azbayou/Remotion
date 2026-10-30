// See all configuration options: https://remotion.dev/docs/config
// Each option also is available as a CLI flag: https://remotion.dev/docs/cli

import fs from "node:fs";
import { Config } from "@remotion/cli/config";

// Fast bundling with Rspack
Config.setRspack(true);

// Video format and quality settings optimized for mobile (TikTok/Reels/Shorts)
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setPixelFormat("yuv420p"); // Standard color profile for maximum smartphone compatibility
Config.setCodec("h264");

// Detect local Google Chrome/Chromium installation if available
const candidateChromePaths = [
  "/usr/bin/google-chrome-stable",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium-browser",
  "/usr/bin/chromium",
  "/snap/bin/chromium",
];

for (const candidate of candidateChromePaths) {
  try {
    if (fs.existsSync(candidate)) {
      const real = fs.realpathSync(candidate);
      if (fs.existsSync(real)) {
        Config.setChromiumExecutablePath(real);
        break;
      }
    }
  } catch {
    // Fall back to default Remotion headless browser
  }
}
