import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";

interface ProgressBarProps {
  color?: string;
  gradient?: string;
  height?: number;
  position?: "top" | "bottom";
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  color = "#FFE600",
  gradient = "linear-gradient(90deg, #FF007A 0%, #7928CA 50%, #FFE600 100%)",
  height = 8,
  position = "top",
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const progress = interpolate(frame, [0, durationInFrames - 1], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        [position]: 0,
        height,
        backgroundColor: "rgba(255, 255, 255, 0.15)",
        zIndex: 50,
      }}
    >
      <div
        style={{
          width: `${progress}%`,
          height: "100%",
          background: gradient || color,
          boxShadow: "0 0 12px rgba(255, 230, 0, 0.6)",
          borderRadius: "0 4px 4px 0",
        }}
      />
    </div>
  );
};

