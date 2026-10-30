import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BackgroundGradient } from "../../components/BackgroundGradient";
import { ProgressBar } from "../../components/ProgressBar";
import { SafeZoneOverlay } from "../../components/SafeZoneOverlay";
import { AudioWaveform } from "../../components/AudioWaveform";
import { Word } from "./Word";
import { DEFAULT_VIRAL_CAPTIONS, CaptionPhrase } from "./mockCaptions";

export interface CaptionsShortProps {
  hookTitle?: string;
  hookCategory?: string;
  authorHandle?: string;
  captions?: CaptionPhrase[];
  highlightColor?: string;
  activeWordStyle?: "pill" | "neon";
  showSafeZone?: boolean;
}

export const CaptionsShort: React.FC<CaptionsShortProps> = ({
  hookTitle = "Trik Bikin Video Viral 🚀",
  hookCategory = "REMOTION SECRETS",
  authorHandle = "@developer_id",
  captions = DEFAULT_VIRAL_CAPTIONS,
  highlightColor = "#FFE600",
  activeWordStyle = "pill",
  showSafeZone = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Find the currently active phrase based on frame
  const currentPhrase = captions.find(
    (phrase) => frame >= phrase.startFrame && frame <= phrase.endFrame
  ) || captions[0];

  // Animated entrance for the Top Hook
  const hookSpring = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.5, stiffness: 180 },
  });

  const hookOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#030712",
        fontFamily:
          '"Montserrat", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* 1. Animated background mesh */}
      <BackgroundGradient
        primaryColor="#0f172a"
        secondaryColor="#020617"
        accentColor="#6366f1"
      />

      {/* 2. Top Progress Bar */}
      <ProgressBar gradient="linear-gradient(90deg, #F43F5E, #8B5CF6, #FFE600)" />

      {/* 3. Top Hook Banner (Placed safely inside safe area) */}
      <div
        style={{
          position: "absolute",
          top: 220,
          left: 40,
          right: 40,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          opacity: hookOpacity,
          transform: `translateY(${(1 - hookSpring) * -40}px)`,
        }}
      >
        {/* Category Pill Tag */}
        <div
          style={{
            backgroundColor: "#2563EB",
            color: "#FFFFFF",
            padding: "8px 24px",
            borderRadius: 9999,
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: 2,
            textTransform: "uppercase",
            boxShadow: "0 4px 20px rgba(37, 99, 235, 0.4)",
            marginBottom: 14,
          }}
        >
          {hookCategory}
        </div>

        {/* Big Bold Headline */}
        <h1
          style={{
            margin: 0,
            fontSize: 48,
            fontWeight: 900,
            color: "#F8FAFC",
            textAlign: "center",
            lineHeight: 1.2,
            textShadow: "0 4px 15px rgba(0, 0, 0, 0.8)",
            letterSpacing: -0.5,
          }}
        >
          {hookTitle}
        </h1>
      </div>

      {/* 4. Center Stage: Word-by-Word Viral Captions */}
      <div
        style={{
          position: "absolute",
          top: "42%",
          left: 50,
          right: 50,
          transform: "translateY(-50%)",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          minHeight: 280,
        }}
      >
        {currentPhrase.words.map((word, idx) => (
          <Word
            key={`${word.text}-${idx}`}
            word={word}
            highlightColor={highlightColor}
            activeWordStyle={activeWordStyle}
          />
        ))}
      </div>

      {/* 5. Lower Content: Audio Waveform Visualizer */}
      <div
        style={{
          position: "absolute",
          bottom: 440,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <AudioWaveform barCount={26} color={highlightColor} />
      </div>

      {/* 6. Footer Author / Branding badge */}
      <div
        style={{
          position: "absolute",
          bottom: 240,
          left: 60,
          display: "flex",
          alignItems: "center",
          gap: 16,
          backgroundColor: "rgba(15, 23, 42, 0.75)",
          backdropFilter: "blur(12px)",
          padding: "12px 24px",
          borderRadius: 40,
          border: "1px solid rgba(255, 255, 255, 0.15)",
        }}
      >
        {/* Avatar Placeholder */}
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #EC4899, #8B5CF6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: 22,
            color: "#FFF",
          }}
        >
          ⚡
        </div>
        <div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: "#FFF",
            }}
          >
            {authorHandle}
          </div>
          <div
            style={{
              fontSize: 16,
              color: "rgba(255, 255, 255, 0.6)",
              fontWeight: 500,
            }}
          >
            Follow for daily coding tricks
          </div>
        </div>
      </div>

      {/* 7. Optional Safe Zone Overlay for layout testing */}
      <SafeZoneOverlay visible={showSafeZone} />
    </AbsoluteFill>
  );
};

