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
import { DEFAULT_QUIZ_DATA, QuizData } from "./mockQuiz";

export interface QuizShortProps {
  quiz?: QuizData;
  showSafeZone?: boolean;
}

export const QuizShort: React.FC<QuizShortProps> = ({
  quiz = DEFAULT_QUIZ_DATA,
  showSafeZone = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isRevealed = frame >= quiz.revealFrame;

  // Countdown seconds before reveal
  const framesRemaining = Math.max(0, quiz.revealFrame - frame);
  const secondsLeft = Math.ceil(framesRemaining / fps);

  // Countdown timer progress (0 to 1)
  const timerProgress = interpolate(
    frame,
    [0, quiz.revealFrame],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Reveal punch animation
  const revealSpring = spring({
    frame: frame - quiz.revealFrame,
    fps,
    config: { damping: 10, mass: 0.6, stiffness: 200 },
  });

  // Entrance spring for question
  const questionSpring = spring({
    frame,
    fps,
    config: { damping: 15, mass: 0.8 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#020617",
        fontFamily:
          '"Montserrat", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <BackgroundGradient
        primaryColor="#1e1b4b"
        secondaryColor="#020617"
        accentColor="#7c3aed"
      />

      <ProgressBar gradient="linear-gradient(90deg, #3B82F6, #10B981)" />

      {/* Header Category & Question */}
      <div
        style={{
          position: "absolute",
          top: 220,
          left: 40,
          right: 40,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          transform: `scale(${interpolate(questionSpring, [0, 1], [0.85, 1])})`,
          opacity: questionSpring,
        }}
      >
        <div
          style={{
            backgroundColor: "#7C3AED",
            color: "#FFF",
            padding: "8px 24px",
            borderRadius: 9999,
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: 2,
            marginBottom: 16,
            boxShadow: "0 0 20px rgba(124, 58, 237, 0.5)",
          }}
        >
          {quiz.category}
        </div>

        <h1
          style={{
            margin: 0,
            fontSize: 42,
            fontWeight: 900,
            color: "#F8FAFC",
            textAlign: "center",
            lineHeight: 1.3,
            textShadow: "0 4px 20px rgba(0,0,0,0.8)",
          }}
        >
          {quiz.question}
        </h1>
      </div>

      {/* Mystery / Clue Center Graphic */}
      <div
        style={{
          position: "absolute",
          top: 560,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Floating Clue Box */}
        <div
          style={{
            width: 220,
            height: 220,
            borderRadius: 36,
            background: "linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.02))",
            border: "2px solid rgba(255,255,255,0.2)",
            boxShadow: "0 20px 50px rgba(0,0,0,0.5), inset 0 0 20px rgba(255,255,255,0.05)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 110,
            filter: isRevealed ? "none" : "drop-shadow(0 0 25px rgba(236,72,153,0.6))",
            transform: `scale(${
              isRevealed ? 1 + revealSpring * 0.15 : 1 + Math.sin(frame * 0.1) * 0.05
            })`,
          }}
        >
          {quiz.mysteryHint}
        </div>

        {/* Dynamic Countdown Display */}
        <div
          style={{
            marginTop: 24,
            display: "flex",
            alignItems: "center",
            gap: 12,
            backgroundColor: isRevealed ? "#059669" : "rgba(239, 68, 68, 0.2)",
            border: isRevealed
              ? "2px solid #10B981"
              : "2px solid rgba(239, 68, 68, 0.6)",
            padding: "8px 28px",
            borderRadius: 9999,
          }}
        >
          <span style={{ fontSize: 28 }}>
            {isRevealed ? "🎉 WAKTU HABIS!" : `⏳ ${secondsLeft} DETIK`}
          </span>
        </div>

        {/* Circular / Line Timer Bar */}
        {!isRevealed && (
          <div
            style={{
              width: 320,
              height: 8,
              backgroundColor: "rgba(255,255,255,0.15)",
              borderRadius: 4,
              marginTop: 14,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${timerProgress * 100}%`,
                height: "100%",
                backgroundColor: timerProgress > 0.3 ? "#EF4444" : "#DC2626",
                boxShadow: "0 0 10px rgba(239,68,68,0.8)",
              }}
            />
          </div>
        )}
      </div>

      {/* 4 Multiple Choice Option Cards */}
      <div
        style={{
          position: "absolute",
          top: 960,
          left: 50,
          right: 50,
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        {quiz.options.map((option, idx) => {
          // Delay each option's entrance
          const optionSpring = spring({
            frame: frame - (idx * 6 + 10),
            fps,
            config: { damping: 14, mass: 0.6 },
          });

          const isWinningOption = isRevealed && option.isCorrect;
          const isLosingOption = isRevealed && !option.isCorrect;

          let cardBg = "rgba(15, 23, 42, 0.85)";
          let cardBorder = "2px solid rgba(255, 255, 255, 0.12)";
          let textColor = "#FFFFFF";
          let badgeBg = "rgba(255, 255, 255, 0.15)";
          let scale = 1;

          if (isWinningOption) {
            cardBg = "linear-gradient(90deg, #059669 0%, #10B981 100%)";
            cardBorder = "3px solid #34D399";
            badgeBg = "#047857";
            scale = 1 + revealSpring * 0.08;
          } else if (isLosingOption) {
            cardBg = "rgba(15, 23, 42, 0.4)";
            cardBorder = "1px solid rgba(255, 255, 255, 0.05)";
            textColor = "rgba(255, 255, 255, 0.35)";
            badgeBg = "rgba(255, 255, 255, 0.05)";
          }

          return (
            <div
              key={option.id}
              style={{
                display: "flex",
                alignItems: "center",
                background: cardBg,
                border: cardBorder,
                borderRadius: 24,
                padding: "20px 28px",
                transform: `scale(${optionSpring * scale}) translateY(${
                  (1 - optionSpring) * 30
                }px)`,
                opacity: optionSpring,
                boxShadow: isWinningOption
                  ? "0 10px 40px rgba(16, 185, 129, 0.5)"
                  : "0 10px 30px rgba(0, 0, 0, 0.4)",
              }}
            >
              {/* Option Letter Badge (A, B, C, D) */}
              <div
                style={{
                  width: 54,
                  height: 54,
                  borderRadius: 16,
                  backgroundColor: badgeBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 26,
                  fontWeight: 900,
                  color: textColor,
                  marginRight: 24,
                }}
              >
                {isWinningOption ? "✓" : option.label}
              </div>

              {/* Option Text */}
              <div
                style={{
                  fontSize: 32,
                  fontWeight: 800,
                  color: textColor,
                  flex: 1,
                }}
              >
                {option.text}
              </div>
            </div>
          );
        })}
      </div>

      {/* Explanation banner at bottom when revealed */}
      {isRevealed && (
        <div
          style={{
            position: "absolute",
            bottom: 220,
            left: 50,
            right: 50,
            backgroundColor: "rgba(16, 185, 129, 0.2)",
            border: "2px solid #10B981",
            borderRadius: 24,
            padding: "18px 24px",
            textAlign: "center",
            color: "#A7F3D0",
            fontSize: 24,
            fontWeight: 700,
            transform: `translateY(${(1 - revealSpring) * 20}px)`,
            opacity: revealSpring,
          }}
        >
          {quiz.correctExplanation}
        </div>
      )}

      <SafeZoneOverlay visible={showSafeZone} />
    </AbsoluteFill>
  );
};
