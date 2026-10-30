import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CaptionWord } from "./mockCaptions";

interface WordProps {
  word: CaptionWord;
  highlightColor?: string;
  activeWordStyle?: "pill" | "neon" | "bounce";
}

export const Word: React.FC<WordProps> = ({
  word,
  highlightColor = "#FFE600",
  activeWordStyle = "pill",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isActive = frame >= word.startFrame && frame <= word.endFrame;
  const isPast = frame > word.endFrame;

  // Spring animation when the word becomes active
  const popSpring = spring({
    frame: frame - word.startFrame,
    fps,
    config: {
      damping: 12,
      mass: 0.4,
      stiffness: 220,
    },
  });

  const scale = isActive ? 1 + popSpring * 0.18 : 1;
  const opacity = isPast ? 0.85 : isActive ? 1 : 0.35;

  let textStyle: React.CSSProperties = {
    color: "#FFFFFF",
    textShadow: "0 4px 18px rgba(0, 0, 0, 0.9), 0 2px 4px rgba(0, 0, 0, 0.9)",
  };

  let containerStyle: React.CSSProperties = {
    display: "inline-block",
    margin: "8px 12px",
    transform: `scale(${scale})`,
    opacity,
  };

  if (isActive) {
    if (activeWordStyle === "pill") {
      containerStyle = {
        ...containerStyle,
        backgroundColor: highlightColor,
        color: "#000000",
        padding: "4px 16px",
        borderRadius: 14,
        boxShadow: `0 8px 30px ${highlightColor}66, 0 4px 12px rgba(0,0,0,0.5)`,
      };
      textStyle = {
        color: "#000000",
        fontWeight: 900,
        textShadow: "none",
      };
    } else {
      // Neon style
      textStyle = {
        color: highlightColor,
        fontWeight: 900,
        textShadow: `0 0 25px ${highlightColor}, 0 0 50px ${highlightColor}88, 0 4px 10px rgba(0,0,0,0.9)`,
      };
    }
  }

  return (
    <span style={containerStyle}>
      <span
        style={{
          fontFamily:
            '"Montserrat", "Impact", "Inter", -apple-system, BlinkMacSystemFont, sans-serif',
          fontSize: 68,
          fontWeight: 900,
          textTransform: "uppercase",
          letterSpacing: 1.5,
          ...textStyle,
        }}
      >
        {word.text}
      </span>
    </span>
  );
};
