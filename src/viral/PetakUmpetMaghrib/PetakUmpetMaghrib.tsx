import React from "react";
import {
  AbsoluteFill,
  Audio,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SafeZoneOverlay } from "../../components/SafeZoneOverlay";
import {
  formatTime,
  LYRIC_TIMELINE,
  LyricSegment,
  TOTAL_DURATION,
} from "./timeline";
import { BestFriendCharacter, YosaCharacter } from "./Characters";

export interface PetakUmpetMaghribProps {
  audioFileName?: string;
  audioVolume?: number;
  showSafeZone?: boolean;
}

export const PetakUmpetMaghrib: React.FC<PetakUmpetMaghribProps> = ({
  audioFileName = "petak-umpet-maghrib.mp3",
  audioVolume = 1,
  showSafeZone = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Waktu video dalam detik
  const currentTime = frame / fps;

  // Segmen lirik aktif saat ini
  const currentSegment =
    LYRIC_TIMELINE.find(
      (seg) => currentTime >= seg.startTime && currentTime < seg.endTime
    ) || LYRIC_TIMELINE[LYRIC_TIMELINE.length - 1];

  // Progres baris lirik aktif (0.0 s/d 1.0) untuk efek karaoke
  const segmentDuration = currentSegment.endTime - currentSegment.startTime;
  const segmentProgress =
    segmentDuration > 0
      ? Math.min(
          1,
          Math.max(0, (currentTime - currentSegment.startTime) / segmentDuration)
        )
      : 0;

  // Warna Langit Dinamis Berdasarkan Scene
  const getSkyGradient = (scene: LyricSegment["sceneType"]) => {
    switch (scene) {
      case "sunset_surau":
      case "running_sunset":
        return { top: "#7c2d12", mid: "#ea580c", bottom: "#fde047" }; // Senja Jingga Maghrib
      case "panic_homeless":
        return { top: "#450a0a", mid: "#991b1b", bottom: "#f97316" }; // Merah Panik Darurat
      case "lost_alley":
      case "crying_corner":
        return { top: "#020617", mid: "#1e1b4b", bottom: "#312e81" }; // Malam Gelap Gang Sempit
      case "flashlight_search":
      case "hero_friend":
        return { top: "#0f172a", mid: "#1e293b", bottom: "#fbbf24" }; // Sinar Harapan Sahabat
      case "walking_home":
      case "happy_chorus":
      case "safe_home_outro":
      default:
        return { top: "#0f172a", mid: "#3b0764", bottom: "#f59e0b" }; // Malam Hangat Lampu Jalan
    }
  };

  const sky = getSkyGradient(currentSegment.sceneType);

  // Hook scale pulse
  const hookScale = currentSegment.isHook
    ? 1 + Math.sin(currentTime * 12) * 0.025
    : 1;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#020617",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        overflow: "hidden",
      }}
    >
      {/* 🎵 Sinkronisasi Audio Lagu Utama */}
      {audioFileName && (
        <Audio src={staticFile(audioFileName)} volume={audioVolume} />
      )}

      {/* ===================================================================
          CANVAS SVG 2D ANIMASI REAL-TIME (RASIO 9:16 -> 360 x 640)
          =================================================================== */}
      <svg
        viewBox="0 0 360 640"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          transform: `scale(${hookScale})`,
        }}
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Gradien Langit Dinamis */}
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={sky.top} />
            <stop offset="60%" stopColor={sky.mid} />
            <stop offset="100%" stopColor={sky.bottom} />
          </linearGradient>

          {/* Cahaya Senter & Lampu Jalan */}
          <linearGradient id="flashlightGlow" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#fef08a" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#fef08a" stopOpacity="0.85" />
          </linearGradient>

          <radialGradient id="streetLampGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fde047" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* 1. BACKGROUND LANGIT */}
        <rect width="360" height="640" fill="url(#skyGrad)" />

        {/* 2. BINTANG & KUNANG-KUNANG (Muncul saat langit gelap) */}
        {currentTime >= 25 &&
          Array.from({ length: 22 }).map((_, idx) => {
            const sx = (idx * 67 + 23) % 340;
            const sy = (idx * 41 + 30) % 280;
            const twinkle = 0.3 + Math.abs(Math.sin(currentTime * 3 + idx));
            return (
              <circle
                key={idx}
                cx={sx}
                cy={sy}
                r={idx % 3 === 0 ? 2.2 : 1.3}
                fill="#fef08a"
                opacity={twinkle}
              />
            );
          })}

        {/* 3. MATAHARI TERBENAM / BULAN SABIT MAGHRIB */}
        {currentTime < 42 ? (
          // Matahari Senja Tenggelam Perlahan
          <circle
            cx="180"
            cy={240 + (currentTime / 42) * 140}
            r="55"
            fill="#fb923c"
            opacity="0.75"
          />
        ) : (
          // Bulan Sabit Malam
          <g transform="translate(285, 95)">
            <circle cx="0" cy="0" r="24" fill="#fef08a" />
            <circle cx="-9" cy="-6" r="22" fill={sky.top} />
          </g>
        )}

        {/* 4. SILUET SURAU / MASJID DI KEJAUHAN (0:00 - 0:25) */}
        {(currentSegment.sceneType === "sunset_surau" ||
          currentSegment.sceneType === "running_sunset") && (
          <g transform="translate(0, 40)">
            {/* Kubah Surau */}
            <path d="M 220 320 Q 265 250 310 320 Z" fill="#1c1917" />
            {/* Bulan Sabit Kubah */}
            <circle cx="265" cy="272" r="5" fill="#fde047" />
            {/* Bangunan Surau */}
            <rect x="205" y="320" width="120" height="90" fill="#1c1917" />
            {/* Jendela Surau Terang Hangat */}
            <rect
              x="222"
              y="338"
              width="22"
              height="32"
              rx="11"
              fill="#fde047"
            />
            <rect
              x="255"
              y="338"
              width="22"
              height="32"
              rx="11"
              fill="#fde047"
            />
            <rect
              x="288"
              y="338"
              width="22"
              height="32"
              rx="11"
              fill="#fde047"
            />
            {/* Gelombang Suara Adzan / Ngaji */}
            <text
              x="265"
              y={245 - Math.sin(currentTime * 4) * 6}
              textAnchor="middle"
              fill="#fef08a"
              fontSize="11"
              fontWeight="bold"
            >
              🕌 &quot;Ayo Ngaji...&quot;
            </text>
          </g>
        )}

        {/* 5. SILUET GANG SEMPIT & RUMAH ASING (Saat nyasar / panik) */}
        {(currentSegment.sceneType === "lost_alley" ||
          currentSegment.sceneType === "crying_corner" ||
          currentSegment.sceneType === "panic_homeless" ||
          currentSegment.sceneType === "flashlight_search") && (
          <g>
            <polygon
              points="0,230 95,270 95,460 0,460"
              fill="#090d16"
              stroke="#1e293b"
              strokeWidth="1.5"
            />
            <polygon
              points="360,210 255,265 255,460 360,460"
              fill="#090d16"
              stroke="#1e293b"
              strokeWidth="1.5"
            />
            <rect x="95" y="340" width="160" height="110" fill="#111827" />
            {/* Plang Nama Gang Asing */}
            <g transform="translate(58, 290) rotate(-8)">
              <rect
                x="-45"
                y="-12"
                width="90"
                height="22"
                rx="4"
                fill="#15803d"
                stroke="#ffffff"
                strokeWidth="1.5"
              />
              <text
                x="0"
                y="3"
                textAnchor="middle"
                fill="#ffffff"
                fontSize="8.5"
                fontWeight="bold"
              >
                JL. ENTah BERANTAH RT 99
              </text>
            </g>
            {/* Tanda Tanya Berputar di Atas Gang */}
            <text
              x="180"
              y={270 + Math.sin(currentTime * 6) * 8}
              textAnchor="middle"
              fontSize="36"
              fill="#f87171"
              opacity="0.85"
            >
              ❓ ❓ ❓
            </text>
          </g>
        )}

        {/* 6. LAMPU JALAN & GERBANG RUMAH (Saat diselamatkan teman & pulang) */}
        {(currentSegment.sceneType === "hero_friend" ||
          currentSegment.sceneType === "walking_home" ||
          currentSegment.sceneType === "happy_chorus" ||
          currentSegment.sceneType === "safe_home_outro") && (
          <g>
            {/* Tiang Lampu Jalan Hangat */}
            <line
              x1="75"
              y1="200"
              x2="75"
              y2="450"
              stroke="#475569"
              strokeWidth="6"
            />
            <path
              d="M 75 200 Q 110 190 125 210"
              fill="none"
              stroke="#475569"
              strokeWidth="5"
            />
            <circle cx="125" cy="215" r="10" fill="#fef08a" />
            <circle cx="125" cy="260" r="110" fill="url(#streetLampGlow)" />

            {/* Rumah Yosa & Gerbang Hangat */}
            <g transform="translate(215, 290)">
              <polygon points="-10,40 60,-15 130,40" fill="#9a3412" />
              <rect
                x="5"
                y="40"
                width="110"
                height="115"
                fill="#ffedd5"
                stroke="#7c2d12"
                strokeWidth="2"
              />
              <rect x="42" y="80" width="36" height="75" fill="#78350f" />
              {/* Jendela Terang */}
              <rect
                x="14"
                y="55"
                width="22"
                height="22"
                fill="#fde047"
                stroke="#78350f"
                strokeWidth="2"
              />
              <rect
                x="84"
                y="55"
                width="22"
                height="22"
                fill="#fde047"
                stroke="#78350f"
                strokeWidth="2"
              />
              {/* Plang RUMAH YOSA */}
              <rect
                x="20"
                y="22"
                width="80"
                height="18"
                rx="4"
                fill="#fef08a"
                stroke="#78350f"
                strokeWidth="1.5"
              />
              <text
                x="60"
                y="34"
                textAnchor="middle"
                fontSize="8.5"
                fontWeight="900"
                fill="#78350f"
              >
                🏠 RUMAH YOSA
              </text>
            </g>
          </g>
        )}

        {/* 7. JALANAN ASPAL BAWAH */}
        <rect x="0" y="440" width="360" height="200" fill="#0f172a" />
        <path d="M 0 440 L 360 440" stroke="#334155" strokeWidth="4" />
        {/* Garis Jalan Bergerak jika sedang lari/jalan */}
        {Array.from({ length: 5 }).map((_, i) => {
          const offset =
            currentSegment.sceneType === "running_sunset" ||
            currentSegment.sceneType === "walking_home"
              ? (currentTime * 90) % 90
              : 0;
          return (
            <rect
              key={i}
              x={((i * 90 - offset + 360) % 420) - 40}
              y="495"
              width="48"
              height="6"
              rx="3"
              fill="#475569"
            />
          );
        })}

        {/* 8. ADEGAN KARAKTER UTAMA (YOSA & TEMAN) */}
        <g transform="translate(180, 400)">
          {/* SCENE: Lari Petak Umpet */}
          {(currentSegment.sceneType === "sunset_surau" ||
            currentSegment.sceneType === "running_sunset") && (
            <g>
              <g transform="translate(-115, -15) scale(0.75)">
                <rect
                  x="-25"
                  y="-120"
                  width="18"
                  height="190"
                  fill="#451a03"
                />
                <circle cx="-16" cy="-130" r="45" fill="#14532d" />
                <text
                  x="20"
                  y="-45"
                  fill="#fde047"
                  fontSize="13"
                  fontWeight="bold"
                >
                  &quot;...8, 9, 10! Udah belum?!&quot;
                </text>
              </g>
              <g
                transform={`translate(${
                  Math.sin(currentTime * 3) * 45 + 25
                }, 0)`}
              >
                <YosaCharacter mood="running" time={currentTime} />
              </g>
            </g>
          )}

          {/* SCENE: PANIK HAMPIR HOMELESS (CHORUS 1 & 2) */}
          {currentSegment.sceneType === "panic_homeless" && (
            <g>
              {/* Ilustrasi Kardus Calon Rumah Yosa di Pojok */}
              <g transform="translate(-100, 22) rotate(-6)">
                <rect
                  x="-32"
                  y="-25"
                  width="64"
                  height="45"
                  fill="#b45309"
                  stroke="#451a03"
                  strokeWidth="2.5"
                />
                <polygon
                  points="-32,-25 -15,-42 48,-42 32,-25"
                  fill="#d97706"
                  stroke="#451a03"
                  strokeWidth="2"
                />
                <text
                  x="0"
                  y="-2"
                  textAnchor="middle"
                  fontSize="7.5"
                  fontWeight="900"
                  fill="#fef08a"
                >
                  KARDUS KOSONG
                </text>
                <text
                  x="0"
                  y="10"
                  textAnchor="middle"
                  fontSize="6.5"
                  fill="#ffffff"
                >
                  (Calon Kosan Yosa)
                </text>
              </g>

              <YosaCharacter mood="panic" time={currentTime} />

              {/* Stempel Komik Besar "HAMPIR HOMELESS!" */}
              {currentSegment.isHook && (
                <g
                  transform={`translate(0, -135) rotate(${
                    Math.sin(currentTime * 15) * 6
                  })`}
                >
                  <rect
                    x="-135"
                    y="-28"
                    width="270"
                    height="52"
                    rx="12"
                    fill="#dc2626"
                    stroke="#fef08a"
                    strokeWidth="4"
                  />
                  <text
                    x="0"
                    y="5"
                    textAnchor="middle"
                    fill="#fef08a"
                    fontSize="20"
                    fontWeight="900"
                    letterSpacing="1"
                  >
                    ⚠️ HAMPIR HOMELESS! 😂
                  </text>
                </g>
              )}
            </g>
          )}

          {/* SCENE: NYASAR & NANGIS DI SUDUT GANG (VERSE 2) */}
          {(currentSegment.sceneType === "lost_alley" ||
            currentSegment.sceneType === "crying_corner") && (
            <g>
              <YosaCharacter
                mood={
                  currentSegment.sceneType === "crying_corner"
                    ? "crying"
                    : "panic"
                }
                time={currentTime}
              />
              {/* Balon Pikiran Bapak Ngomel */}
              {currentTime >= 66 && currentTime <= 75 && (
                <g transform="translate(80, -125)">
                  <ellipse
                    cx="0"
                    cy="0"
                    rx="68"
                    ry="36"
                    fill="#ffffff"
                    stroke="#111827"
                    strokeWidth="2.5"
                  />
                  <circle cx="-42" cy="38" r="6" fill="#ffffff" />
                  <circle cx="-52" cy="48" r="3.5" fill="#ffffff" />
                  <text
                    x="0"
                    y="-4"
                    textAnchor="middle"
                    fontSize="9.5"
                    fontWeight="bold"
                    fill="#dc2626"
                  >
                    😠 &quot;YOSAAA! BUKannya
                  </text>
                  <text
                    x="0"
                    y="10"
                    textAnchor="middle"
                    fontSize="9.5"
                    fontWeight="bold"
                    fill="#dc2626"
                  >
                    NGAJI MALAH ILANG!&quot;
                  </text>
                </g>
              )}
            </g>
          )}

          {/* SCENE: BRIDGE SENTER & TEMAN DATANG MENYELAMATKAN */}
          {(currentSegment.sceneType === "flashlight_search" ||
            currentSegment.sceneType === "hero_friend") && (
            <g>
              <g transform="translate(-55, 0)">
                <YosaCharacter
                  mood={
                    currentSegment.sceneType === "flashlight_search"
                      ? "crying"
                      : "relieved"
                  }
                  time={currentTime}
                />
              </g>
              <g
                transform={`translate(${
                  currentSegment.sceneType === "flashlight_search"
                    ? 120 - segmentProgress * 55
                    : 55
                }, 0)`}
              >
                <BestFriendCharacter time={currentTime} hasFlashlight={true} />
              </g>
            </g>
          )}

          {/* SCENE: PULANG GANDENGAN TANGAN & OUTRO BAHAGIA */}
          {(currentSegment.sceneType === "walking_home" ||
            currentSegment.sceneType === "happy_chorus" ||
            currentSegment.sceneType === "safe_home_outro") && (
            <g>
              <g transform="translate(-38, 0)">
                <YosaCharacter mood="happy" time={currentTime} />
              </g>
              <g transform="translate(38, 0)">
                <BestFriendCharacter
                  time={currentTime}
                  hasFlashlight={false}
                />
              </g>
              {/* Ikon Hati Persahabatan */}
              <text
                x="0"
                y={-55 + Math.sin(currentTime * 6) * 5}
                textAnchor="middle"
                fontSize="22"
              >
                🤝💛
              </text>

              {/* Stempel Komik "BATAL HOMELESS" saat Outro */}
              {currentSegment.sceneType === "safe_home_outro" && (
                <g transform="translate(0, -135)">
                  <rect
                    x="-135"
                    y="-26"
                    width="270"
                    height="50"
                    rx="12"
                    fill="#059669"
                    stroke="#fef08a"
                    strokeWidth="3.5"
                  />
                  <text
                    x="0"
                    y="5"
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="16"
                    fontWeight="900"
                  >
                    ✅ STATUS: BATAL HOMELESS!
                  </text>
                </g>
              )}
            </g>
          )}
        </g>
      </svg>

      {/* ===================================================================
          HEADER OVERLAY ATAS (JUDUL LAGU & BADGE BAGIAN LAGU)
          =================================================================== */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          paddingTop: 80,
          paddingLeft: 40,
          paddingRight: 40,
          paddingBottom: 40,
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          zIndex: 30,
        }}
      >
        {/* Info Lagu */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 58,
              height: 58,
              borderRadius: 18,
              backgroundColor: "rgba(245, 158, 11, 0.2)",
              border: "2px solid rgba(245, 158, 11, 0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 26,
            }}
          >
            🎵
          </div>
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: 28,
                fontWeight: 900,
                color: "#FFFFFF",
                letterSpacing: 0.5,
              }}
            >
              Petak Umpet Maghrib
            </h1>
            <p
              style={{
                margin: "4px 0 0 0",
                fontSize: 18,
                color: "#FDE047",
                fontWeight: 600,
              }}
            >
              Yosa (7 Thn) • Official 9:16 MV ({formatTime(currentTime)} /{" "}
              {formatTime(TOTAL_DURATION)})
            </p>
          </div>
        </div>

        {/* Badge Bagian Lagu */}
        <div
          style={{
            padding: "8px 20px",
            borderRadius: 9999,
            fontSize: 20,
            fontWeight: 900,
            letterSpacing: 1.5,
            textTransform: "uppercase",
            border: currentSegment.isHook
              ? "2px solid #FDE047"
              : "2px solid rgba(255, 255, 255, 0.2)",
            backgroundColor: currentSegment.isHook
              ? "#DC2626"
              : "rgba(15, 23, 42, 0.8)",
            color: currentSegment.isHook ? "#FEF08A" : "#FDE047",
            boxShadow: currentSegment.isHook
              ? "0 0 25px rgba(220, 38, 38, 0.8)"
              : "none",
          }}
        >
          {currentSegment.section}
        </div>
      </div>

      {/* ===================================================================
          KINETIC TYPOGRAPHY LYRICS OVERLAY (TENGAH - BAWAH)
          =================================================================== */}
      <div
        style={{
          position: "absolute",
          bottom: 220,
          left: 40,
          right: 40,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          zIndex: 30,
        }}
      >
        {/* Sub-narasi visual di atas lirik */}
        {currentSegment.subtext && (
          <div
            style={{
              marginBottom: 14,
              padding: "10px 24px",
              borderRadius: 9999,
              backgroundColor: "rgba(0, 0, 0, 0.75)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              fontSize: 22,
              color: "#FDE047",
              fontWeight: 600,
              maxWidth: "92%",
              boxShadow: "0 8px 30px rgba(0, 0, 0, 0.5)",
            }}
          >
            {currentSegment.subtext}
          </div>
        )}

        {/* Kotak Lirik Utama dengan Efek Karaoke Fill */}
        <div
          style={{
            width: "100%",
            borderRadius: 28,
            padding: "24px 32px",
            backdropFilter: "blur(16px)",
            backgroundColor: currentSegment.isHook
              ? "rgba(69, 10, 10, 0.9)"
              : "rgba(2, 6, 23, 0.85)",
            border: currentSegment.isHook
              ? "3px solid #F59E0B"
              : "2px solid rgba(255, 255, 255, 0.15)",
            boxShadow: currentSegment.isHook
              ? "0 20px 50px rgba(220, 38, 38, 0.4)"
              : "0 20px 50px rgba(0, 0, 0, 0.6)",
          }}
        >
          <p
            style={{
              margin: 0,
              fontWeight: 900,
              lineHeight: 1.3,
              fontSize: currentSegment.isHook ? 38 : 32,
              color: currentSegment.isHook ? "#FDE047" : "#FFFFFF",
              textShadow: currentSegment.isHook
                ? "0 0 25px rgba(250, 204, 21, 0.7)"
                : "0 4px 15px rgba(0, 0, 0, 0.8)",
            }}
          >
            {currentSegment.text}
          </p>

          {/* Karaoke Progress Bar per Baris Lirik */}
          <div
            style={{
              width: "100%",
              height: 10,
              backgroundColor: "rgba(255, 255, 255, 0.18)",
              borderRadius: 9999,
              overflow: "hidden",
              marginTop: 18,
            }}
          >
            <div
              style={{
                width: `${segmentProgress * 100}%`,
                height: "100%",
                background: currentSegment.isHook
                  ? "linear-gradient(90deg, #FDE047, #FB923C, #EF4444)"
                  : "linear-gradient(90deg, #FBBF24, #F97316)",
                boxShadow: "0 0 12px rgba(251, 191, 36, 0.8)",
              }}
            />
          </div>
        </div>
      </div>

      {/* Global Video Progress Bar di Paling Bawah */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 10,
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          zIndex: 40,
        }}
      >
        <div
          style={{
            width: `${(currentTime / TOTAL_DURATION) * 100}%`,
            height: "100%",
            background:
              "linear-gradient(90deg, #F59E0B 0%, #EC4899 50%, #10B981 100%)",
            boxShadow: "0 0 15px rgba(245, 158, 11, 0.7)",
          }}
        />
      </div>

      <SafeZoneOverlay visible={showSafeZone} />
    </AbsoluteFill>
  );
};
