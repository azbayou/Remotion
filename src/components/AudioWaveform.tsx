import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

interface AudioWaveformProps {
  barCount?: number;
  color?: string;
}

export const AudioWaveform: React.FC<AudioWaveformProps> = ({
  barCount = 28,
  color = "#38BDF8",
}) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        height: 60,
      }}
    >
      {Array.from({ length: barCount }).map((_, i) => {
        // Create rhythmic bouncing height using sine & frame offset
        const phase = (frame * 0.25 + i * 0.45) % Math.PI;
        const baseHeight = Math.sin(phase);
        const height = interpolate(baseHeight, [-1, 1], [12, 54], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        return (
          <div
            key={i}
            style={{
              width: 6,
              height: `${height}px`,
              backgroundColor: color,
              borderRadius: 4,
              opacity: 0.85,
              boxShadow: `0 0 10px ${color}88`,
            }}
          />
        );
      })}
    </div>
  );
};

