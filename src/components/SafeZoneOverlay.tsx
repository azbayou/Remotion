import React from "react";
import { AbsoluteFill } from "remotion";

interface SafeZoneOverlayProps {
  visible?: boolean;
}

/**
 * TikTok / Instagram Reels / YouTube Shorts Safe Zone Guide.
 * Displays UI boundaries to ensure hooks, text, and captions are never
 * obscured by platform UI (profile, like button, comments, sound bar).
 */
export const SafeZoneOverlay: React.FC<SafeZoneOverlayProps> = ({
  visible = true,
}) => {
  if (!visible) return null;

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        zIndex: 9999,
        border: "3px dashed rgba(255, 0, 100, 0.4)",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      {/* Top Danger Zone (Search & Following/For You tabs) */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 180,
          backgroundColor: "rgba(255, 0, 0, 0.15)",
          borderBottom: "2px solid rgba(255, 50, 50, 0.6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "rgba(255, 255, 255, 0.8)",
          fontSize: 22,
          fontWeight: 600,
          letterSpacing: 1,
        }}
      >
        ⚠️ TOP SAFE ZONE (Header / Tabs / Search)
      </div>

      {/* Right Danger Zone (Like, Comment, Share, Bookmark) */}
      <div
        style={{
          position: "absolute",
          top: 180,
          right: 0,
          bottom: 380,
          width: 140,
          backgroundColor: "rgba(255, 100, 0, 0.15)",
          borderLeft: "2px solid rgba(255, 100, 0, 0.6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          writingMode: "vertical-rl",
          color: "rgba(255, 255, 255, 0.8)",
          fontSize: 20,
          fontWeight: 600,
          letterSpacing: 2,
        }}
      >
        ⚠️ RIGHT ICONS (Likes / Comments)
      </div>

      {/* Bottom Danger Zone (Username, Captions, Audio ticker) */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 380,
          backgroundColor: "rgba(255, 0, 0, 0.2)",
          borderTop: "2px solid rgba(255, 50, 50, 0.6)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "rgba(255, 255, 255, 0.8)",
          fontSize: 22,
          fontWeight: 600,
          letterSpacing: 1,
        }}
      >
        <div>⚠️ BOTTOM SAFE ZONE</div>
        <div style={{ fontSize: 16, marginTop: 6, opacity: 0.8 }}>
          (Username, Description, Sound Marquee, Navigation)
        </div>
      </div>

      {/* Center Safe Content Area Indicator */}
      <div
        style={{
          position: "absolute",
          top: 200,
          left: 60,
          right: 160,
          bottom: 400,
          border: "2px dashed rgba(0, 255, 150, 0.5)",
          borderRadius: 24,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          paddingTop: 16,
          color: "rgba(0, 255, 150, 0.7)",
          fontSize: 18,
          fontWeight: 600,
        }}
      >
        ✅ SAFE CONTENT AREA (Keep Captions & Action Here)
      </div>
    </AbsoluteFill>
  );
};

