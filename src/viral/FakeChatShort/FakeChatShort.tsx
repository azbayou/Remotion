import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ProgressBar } from "../../components/ProgressBar";
import { SafeZoneOverlay } from "../../components/SafeZoneOverlay";
import { ChatStory, DEFAULT_CHAT_STORY } from "./mockChat";

export interface FakeChatShortProps {
  story?: ChatStory;
  showSafeZone?: boolean;
  musicSrc?: string;
  musicVolume?: number;
}

export const FakeChatShort: React.FC<FakeChatShortProps> = ({
  story = DEFAULT_CHAT_STORY,
  showSafeZone = false,
  musicSrc,
  musicVolume = 0.3,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Find if typing indicator should show right before a message
  const nextThemMessage = story.messages.find(
    (m) => m.sender === "them" && frame >= m.startFrame - 20 && frame < m.startFrame
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0B141A", // WhatsApp / iOS dark theme
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      <ProgressBar gradient="linear-gradient(90deg, #25D366, #128C7E)" />

      {musicSrc && (
        <Audio
          src={staticFile(musicSrc)}
          volume={(f) =>
            interpolate(
              f,
              [0, 15, durationInFrames - 15, durationInFrames],
              [0, musicVolume, musicVolume, 0],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }
            )
          }
          loop
        />
      )}

      {/* WhatsApp / iOS Style Top Navigation Bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 180,
          paddingTop: 50,
          paddingLeft: 30,
          paddingRight: 30,
          backgroundColor: "#1F2C34",
          display: "flex",
          alignItems: "center",
          gap: 18,
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
          zIndex: 40,
        }}
      >
        {/* Back Arrow */}
        <div style={{ color: "#00A884", fontSize: 32, fontWeight: 700 }}>‹</div>

        {/* Contact Avatar */}
        <div
          style={{
            width: 58,
            height: 58,
            borderRadius: "50%",
            backgroundColor: "#374151",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 32,
          }}
        >
          {story.contactAvatar}
        </div>

        {/* Contact Info */}
        <div style={{ flex: 1 }}>
          <div style={{ color: "#E9EDEF", fontSize: 26, fontWeight: 700 }}>
            {story.contactName}
          </div>
          <div style={{ color: "#00A884", fontSize: 18, fontWeight: 500 }}>
            {story.contactSubtitle}
          </div>
        </div>

        {/* Call & Menu Icons */}
        <div style={{ display: "flex", gap: 20, color: "#8696A0", fontSize: 26 }}>
          <span>📹</span>
          <span>📞</span>
          <span>⋮</span>
        </div>
      </div>

      {/* Chat Messages Container */}
      <div
        style={{
          position: "absolute",
          top: 200,
          bottom: 360,
          left: 30,
          right: 30,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          gap: 22,
          overflow: "hidden",
        }}
      >
        {story.messages.map((msg) => {
          if (frame < msg.startFrame) return null;

          const msgSpring = spring({
            frame: frame - msg.startFrame,
            fps,
            config: { damping: 13, mass: 0.5, stiffness: 180 },
          });

          const isMe = msg.sender === "me";

          return (
            <div
              key={msg.id}
              style={{
                display: "flex",
                justifyContent: isMe ? "flex-end" : "flex-start",
                transform: `scale(${msgSpring}) translateY(${(1 - msgSpring) * 20}px)`,
                opacity: interpolate(msgSpring, [0, 0.4, 1], [0, 0.8, 1]),
              }}
            >
              <div
                style={{
                  maxWidth: "78%",
                  backgroundColor: isMe ? "#005C4B" : "#202C33",
                  color: "#E9EDEF",
                  padding: "18px 24px",
                  borderRadius: isMe ? "24px 24px 4px 24px" : "24px 24px 24px 4px",
                  boxShadow: "0 6px 18px rgba(0, 0, 0, 0.35)",
                  fontSize: 28,
                  lineHeight: 1.35,
                  fontWeight: 500,
                  position: "relative",
                }}
              >
                <div>{msg.text}</div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 16,
                    color: isMe ? "#53BDEB" : "#8696A0",
                    marginTop: 8,
                  }}
                >
                  <span>14:02</span>
                  {isMe && <span>✓✓</span>}
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing indicator bubble */}
        {nextThemMessage && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div
              style={{
                backgroundColor: "#202C33",
                padding: "16px 24px",
                borderRadius: "24px 24px 24px 4px",
                display: "flex",
                gap: 8,
                alignItems: "center",
              }}
            >
              {[0, 1, 2].map((dotIdx) => {
                const bounce = Math.sin((frame + dotIdx * 4) * 0.4);
                return (
                  <div
                    key={dotIdx}
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      backgroundColor: "#8696A0",
                      transform: `translateY(${bounce * 4}px)`,
                    }}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Message Input Bar */}
      <div
        style={{
          position: "absolute",
          bottom: 200,
          left: 20,
          right: 20,
          height: 80,
          backgroundColor: "#1F2C34",
          borderRadius: 40,
          display: "flex",
          alignItems: "center",
          padding: "0 24px",
          gap: 16,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
        }}
      >
        <span style={{ fontSize: 28, opacity: 0.7 }}>😊</span>
        <div style={{ flex: 1, color: "#8696A0", fontSize: 24 }}>Ketik pesan...</div>
        <span style={{ fontSize: 28, opacity: 0.7 }}>📎</span>
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: "50%",
            backgroundColor: "#00A884",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
            color: "#FFF",
          }}
        >
          🎙️
        </div>
      </div>

      <SafeZoneOverlay visible={showSafeZone} />
    </AbsoluteFill>
  );
};

