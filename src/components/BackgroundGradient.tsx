import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

interface BackgroundGradientProps {
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  showGrid?: boolean;
}

export const BackgroundGradient: React.FC<BackgroundGradientProps> = ({
  primaryColor = "#0f172a", // deep slate
  secondaryColor = "#020617", // near black
  accentColor = "#6366f1", // vibrant indigo/purple
  showGrid = true,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Gentle floating orb 1
  const orb1X = interpolate(
    frame,
    [0, durationInFrames / 2, durationInFrames],
    [200, 600, 200]
  );
  const orb1Y = interpolate(
    frame,
    [0, durationInFrames / 2, durationInFrames],
    [400, 700, 400]
  );

  // Gentle floating orb 2
  const orb2X = interpolate(
    frame,
    [0, durationInFrames / 2, durationInFrames],
    [800, 300, 800]
  );
  const orb2Y = interpolate(
    frame,
    [0, durationInFrames / 2, durationInFrames],
    [1200, 1500, 1200]
  );

  // Subtle pulsing scale
  const scale = interpolate(
    frame % 90,
    [0, 45, 90],
    [1, 1.15, 1],
    { extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: secondaryColor,
        overflow: "hidden",
      }}
    >
      {/* Base radial gradient */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 50% 30%, ${primaryColor} 0%, ${secondaryColor} 100%)`,
        }}
      />

      {/* Floating Glowing Orb 1 */}
      <div
        style={{
          position: "absolute",
          left: orb1X - 300,
          top: orb1Y - 300,
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${accentColor} 0%, rgba(99, 102, 241, 0) 70%)`,
          filter: "blur(90px)",
          opacity: 0.45,
          transform: `scale(${scale})`,
        }}
      />

      {/* Floating Glowing Orb 2 (Cyan/Teal accent) */}
      <div
        style={{
          position: "absolute",
          left: orb2X - 350,
          top: orb2Y - 350,
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: "radial-gradient(circle, #06b6d4 0%, rgba(6, 182, 212, 0) 70%)",
          filter: "blur(110px)",
          opacity: 0.35,
          transform: `scale(${1.2 - scale * 0.15})`,
        }}
      />

      {/* Subtle tech grid overlay */}
      {showGrid && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `
              linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
            opacity: 0.7,
          }}
        />
      )}

      {/* Vignette border */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle at center, transparent 40%, rgba(0, 0, 0, 0.6) 100%)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};

