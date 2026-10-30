import React from "react";

export interface CharacterProps {
  mood: "running" | "panic" | "crying" | "relieved" | "happy";
  time: number;
}

/**
 * Karakter OCA:
 * - Postur lebih kurus / ramping
 * - Rambut hitam pendek bertekstur
 * - Kacamata bulat khas
 * - Pakaian kombinasi Merah & Hitam (Red & Black)
 */
export const OCACharacter: React.FC<CharacterProps> = ({ mood, time }) => {
  const bounceY =
    Math.sin(time * 9) * (mood === "running" || mood === "panic" ? 6 : 2);
  const shakeX = mood === "panic" ? Math.sin(time * 35) * 4 : 0;

  return (
    <g transform={`translate(${shakeX}, ${bounceY})`}>
      {/* Bayangan di tanah (lebih ramping) */}
      <ellipse cx="0" cy="78" rx="22" ry="5.5" fill="rgba(0,0,0,0.35)" />

      {/* Kaki Ramping (Celana Hitam Pekat) */}
      {mood === "crying" ? (
        // Posisi jongkok nangis (lebih kurus)
        <g>
          <rect x="-14" y="47" width="10" height="24" rx="5" fill="#18181b" />
          <rect x="4" y="47" width="10" height="24" rx="5" fill="#18181b" />
          {/* Sepatu Merah Hitam */}
          <ellipse cx="-9" cy="72" rx="7.5" ry="4.5" fill="#dc2626" />
          <ellipse cx="9" cy="72" rx="7.5" ry="4.5" fill="#dc2626" />
        </g>
      ) : (
        // Posisi berdiri / lari (kaki lebih ramping)
        <g>
          <g
            transform={`rotate(${
              mood === "running" || mood === "panic"
                ? Math.sin(time * 12) * 26
                : 0
            } -8 42)`}
          >
            <rect x="-12" y="42" width="8" height="30" rx="4" fill="#18181b" />
            {/* Sepatu Merah dengan sol putih */}
            <ellipse cx="-8" cy="72" rx="7.5" ry="4.5" fill="#dc2626" />
            <rect x="-13" y="73" width="11" height="2" rx="1" fill="#f8fafc" />
          </g>
          <g
            transform={`rotate(${
              mood === "running" || mood === "panic"
                ? -Math.sin(time * 12) * 26
                : 0
            } 8 42)`}
          >
            <rect x="4" y="42" width="8" height="30" rx="4" fill="#18181b" />
            {/* Sepatu Merah dengan sol putih */}
            <ellipse cx="8" cy="72" rx="7.5" ry="4.5" fill="#dc2626" />
            <rect x="3" y="73" width="11" height="2" rx="1" fill="#f8fafc" />
          </g>
        </g>
      )}

      {/* Badan Ramping: Baju Merah Hitam (Red & Black) */}
      {/* Dasar Baju: Merah Menyala */}
      <rect
        x="-17"
        y="4"
        width="34"
        height="44"
        rx="10"
        fill="#dc2626"
        stroke="#991b1b"
        strokeWidth="2"
      />
      {/* Aksen Blok Hitam di Bagian Dada & Pinggang */}
      <rect x="-17" y="20" width="34" height="14" fill="#18181b" />
      {/* Garis Aksen Putih tipis sporty */}
      <line x1="-17" y1="20" x2="17" y2="20" stroke="#f8fafc" strokeWidth="1.2" />
      <line x1="-17" y1="34" x2="17" y2="34" stroke="#f8fafc" strokeWidth="1.2" />

      {/* Kerah Baju Hitam */}
      <polygon points="-8,4 0,14 8,4" fill="#18181b" />

      {/* Selempang Tas / Sarung Merah Kotak-Kotak Hitam */}
      <path
        d="M -15 8 L 15 38 L 10 43 L -17 15 Z"
        fill="#b91c1c"
        opacity="0.85"
      />
      <path
        d="M -13 11 L 13 36"
        stroke="#18181b"
        strokeWidth="2"
        strokeDasharray="3 3"
      />

      {/* Tangan Ramping (Lengan Baju Merah + Manset Hitam) */}
      {mood === "panic" ? (
        // Tangan pegang kepala panik
        <g>
          <path
            d="M -15 14 Q -32 -8 -18 -26"
            fill="none"
            stroke="#18181b"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <path
            d="M 15 14 Q 32 -8 18 -26"
            fill="none"
            stroke="#18181b"
            strokeWidth="7"
            strokeLinecap="round"
          />
          {/* Telapak tangan kulit */}
          <circle cx="-17" cy="-26" r="4.5" fill="#fed7aa" />
          <circle cx="17" cy="-26" r="4.5" fill="#fed7aa" />
        </g>
      ) : mood === "crying" ? (
        // Tangan usap mata di belakang kacamata
        <g>
          <path
            d="M -14 16 Q -26 0 -10 -14"
            fill="none"
            stroke="#dc2626"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <path
            d="M 14 16 Q 26 0 10 -14"
            fill="none"
            stroke="#dc2626"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <circle cx="-10" cy="-14" r="4.5" fill="#fed7aa" />
          <circle cx="10" cy="-14" r="4.5" fill="#fed7aa" />
        </g>
      ) : (
        // Tangan berayun santai / lari
        <g>
          {/* Lengan kiri */}
          <line
            x1="-16"
            y1="14"
            x2="-28"
            y2={26 + Math.sin(time * 10) * 8}
            stroke="#dc2626"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <circle
            cx="-28"
            cy={26 + Math.sin(time * 10) * 8}
            r="4.2"
            fill="#fed7aa"
          />

          {/* Lengan kanan */}
          <line
            x1="16"
            y1="14"
            x2="28"
            y2={26 - Math.sin(time * 10) * 8}
            stroke="#dc2626"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <circle
            cx="28"
            cy={26 - Math.sin(time * 10) * 8}
            r="4.2"
            fill="#fed7aa"
          />
        </g>
      )}

      {/* Leher Ramping */}
      <rect x="-4.5" y="-3" width="9" height="8" rx="2" fill="#fed7aa" />

      {/* Kepala OCA (Bentuk Wajah Lebih Ramping & Proporsional) */}
      <ellipse
        cx="0"
        cy="-22"
        rx="22"
        ry="23"
        fill="#fed7aa"
        stroke="#78350f"
        strokeWidth="2"
      />

      {/* RAMBUT PENDEK HITAM (Short Stylish Haircuts) */}
      <g>
        {/* Rambut Belakang & Samping */}
        <path
          d="M -22 -22 C -24 -36, -16 -46, 0 -47 C 16 -46, 24 -36, 22 -22 C 20 -25, 17 -26, 14 -23 C 11 -27, 6 -26, 3 -23 C -1 -28, -7 -27, -10 -22 C -14 -26, -19 -25, -22 -22 Z"
          fill="#18181b"
          stroke="#09090b"
          strokeWidth="1.8"
        />

        {/* Poni Depan Pendek Rapi */}
        <path
          d="M -21 -31 Q -13 -40 0 -38 Q 13 -40 21 -31 Q 16 -35 11 -33 Q 4 -37 -3 -33 Q -11 -36 -21 -31 Z"
          fill="#27272a"
        />

        {/* Helai Rambut Atas Sedikit Acak Khas Anak-anak */}
        <path
          d="M -3 -47 Q 0 -54 5 -48"
          fill="none"
          stroke="#18181b"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M 4 -46 Q 9 -51 12 -45"
          fill="none"
          stroke="#18181b"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>

      {/* Telinga Kiri & Kanan */}
      <ellipse cx="-22" cy="-21" rx="3.5" ry="5.5" fill="#fed7aa" />
      <ellipse cx="22" cy="-21" rx="3.5" ry="5.5" fill="#fed7aa" />

      {/* EKSPRESI MATA & WAJAH */}
      {mood === "panic" && (
        <g>
          {/* Mata melotot panik di balik kacamata */}
          <circle cx="-8.5" cy="-23" r="5" fill="#ffffff" />
          <circle cx="8.5" cy="-23" r="5" fill="#ffffff" />
          <circle cx="-8.5" cy="-23" r="2" fill="#111827" />
          <circle cx="8.5" cy="-23" r="2" fill="#111827" />
          {/* Mulut teriak O besar */}
          <ellipse
            cx="0"
            cy="-10"
            rx="7"
            ry="9"
            fill="#7f1d1d"
            stroke="#111827"
            strokeWidth="1.8"
          />
          {/* Keringat dingin */}
          <path
            d="M 21 -30 Q 25 -22 21 -18 Q 17 -22 21 -30 Z"
            fill="#38bdf8"
          />
        </g>
      )}

      {mood === "crying" && (
        <g>
          {/* Mata terpejam nangis */}
          <path
            d="M -13 -23 Q -8.5 -19 -4 -23"
            fill="none"
            stroke="#111827"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
          <path
            d="M 4 -23 Q 8.5 -19 13 -23"
            fill="none"
            stroke="#111827"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
          {/* Air mata air mancur komik dari sudut kacamata */}
          <path
            d={`M -9 -20 Q -24 ${-10 + ((time * 20) % 15)} -26 22`}
            fill="none"
            stroke="#38bdf8"
            strokeWidth="4.5"
            strokeDasharray="6 3"
            strokeLinecap="round"
          />
          <path
            d={`M 9 -20 Q 24 ${-10 + ((time * 20) % 15)} 26 22`}
            fill="none"
            stroke="#38bdf8"
            strokeWidth="4.5"
            strokeDasharray="6 3"
            strokeLinecap="round"
          />
          {/* Mulut mewek */}
          <path
            d="M -8 -8 Q 0 -15 8 -8"
            fill="none"
            stroke="#111827"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
        </g>
      )}

      {(mood === "running" || mood === "relieved" || mood === "happy") && (
        <g>
          {/* Mata ramah di balik kacamata */}
          <circle cx="-8.5" cy="-23" r="3.2" fill="#111827" />
          <circle cx="8.5" cy="-23" r="3.2" fill="#111827" />
          {/* Titik kilau di mata */}
          <circle cx="-9.5" cy="-24.5" r="1" fill="#ffffff" />
          <circle cx="7.5" cy="-24.5" r="1" fill="#ffffff" />

          {/* Pipi merona */}
          <ellipse
            cx="-14"
            cy="-16"
            rx="3.5"
            ry="2.2"
            fill="#fb7185"
            opacity="0.6"
          />
          <ellipse
            cx="14"
            cy="-16"
            rx="3.5"
            ry="2.2"
            fill="#fb7185"
            opacity="0.6"
          />

          {/* Senyum lebar */}
          <path
            d="M -8 -13 Q 0 -4 8 -13"
            fill="#dc2626"
            stroke="#111827"
            strokeWidth="1.8"
          />
        </g>
      )}

      {/* ============================================================== */}
      {/* 👓 KACAMATA BULAT (ROUND GLASSES) KHAS OCA                    */}
      {/* ============================================================== */}
      <g>
        {/* Bingkai Lensa Kiri Bulat */}
        <circle
          cx="-8.5"
          cy="-23"
          r="7.5"
          fill="rgba(255, 255, 255, 0.15)"
          stroke="#09090b"
          strokeWidth="2.4"
        />
        {/* Bingkai Lensa Kanan Bulat */}
        <circle
          cx="8.5"
          cy="-23"
          r="7.5"
          fill="rgba(255, 255, 255, 0.15)"
          stroke="#09090b"
          strokeWidth="2.4"
        />

        {/* Jembatan Kacamata Antar Lensa (Bridge) */}
        <path
          d="M -1 -23 Q 0 -25.5 1 -23"
          fill="none"
          stroke="#09090b"
          strokeWidth="2.4"
          strokeLinecap="round"
        />

        {/* Gagang Kacamata Samping ke Telinga */}
        <line
          x1="-16"
          y1="-23"
          x2="-22"
          y2="-21"
          stroke="#09090b"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          x1="16"
          y1="-23"
          x2="22"
          y2="-21"
          stroke="#09090b"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Efek Kilau / Pantulan Kaca (Glass Glare) */}
        <path
          d="M -11 -27 L -7 -21"
          stroke="rgba(255, 255, 255, 0.65)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M 6 -27 L 10 -21"
          stroke="rgba(255, 255, 255, 0.65)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </g>

      {/* Name tag OCA di dada (Warna Hitam Teks Putih Minimalis) */}
      <rect
        x="-13"
        y="22"
        width="26"
        height="10"
        rx="3"
        fill="#ffffff"
        stroke="#18181b"
        strokeWidth="1.2"
      />
      <text
        x="0"
        y="29.5"
        textAnchor="middle"
        fontSize="7"
        fontWeight="900"
        fill="#dc2626"
        fontFamily="sans-serif"
      >
        OCA
      </text>
    </g>
  );
};

export const BestFriendCharacter: React.FC<{
  time: number;
  hasFlashlight?: boolean;
}> = ({ time, hasFlashlight }) => {
  const bounceY = Math.cos(time * 8) * 3;

  return (
    <g transform={`translate(0, ${bounceY})`}>
      {/* Halo Pahlawan Sejati */}
      <ellipse
        cx="0"
        cy="-60"
        rx="18"
        ry="5"
        fill="none"
        stroke="#fde047"
        strokeWidth="3"
        opacity="0.85"
      />

      <ellipse cx="0" cy="78" rx="26" ry="7" fill="rgba(0,0,0,0.35)" />
      {/* Kaki */}
      <rect x="-12" y="42" width="9" height="30" rx="4" fill="#1e3a8a" />
      <rect x="3" y="42" width="9" height="30" rx="4" fill="#1e3a8a" />
      {/* Badan Baju Koko Hijau */}
      <rect
        x="-20"
        y="4"
        width="40"
        height="44"
        rx="12"
        fill="#10b981"
        stroke="#064e3b"
        strokeWidth="2.5"
      />
      {/* Kepala */}
      <circle
        cx="0"
        cy="-22"
        r="24"
        fill="#fed7aa"
        stroke="#064e3b"
        strokeWidth="2.5"
      />
      {/* Peci Putih Rapi */}
      <path
        d="M -20 -36 L 20 -36 L 17 -50 L -17 -50 Z"
        fill="#f8fafc"
        stroke="#cbd5e1"
        strokeWidth="2"
      />
      {/* Wajah Senyum Pahlawan */}
      <circle cx="-8" cy="-23" r="3" fill="#111827" />
      <circle cx="8" cy="-23" r="3" fill="#111827" />
      <path
        d="M -10 -13 Q 0 -3 10 -13 Z"
        fill="#ffffff"
        stroke="#111827"
        strokeWidth="2"
      />

      {/* Senter di tangan */}
      {hasFlashlight && (
        <g transform="translate(-26, 18)">
          <rect
            x="-12"
            y="-5"
            width="16"
            height="10"
            rx="3"
            fill="#fbbf24"
            stroke="#111827"
            strokeWidth="2"
          />
          {/* Sorot Cahaya Senter */}
          <polygon
            points="-12,0 -130,-45 -130,45"
            fill="url(#flashlightGlow)"
            opacity={0.7 + Math.sin(time * 10) * 0.15}
          />
        </g>
      )}
    </g>
  );
};
