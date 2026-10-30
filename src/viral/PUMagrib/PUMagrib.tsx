import React from "react";
import {
  AbsoluteFill,
  Audio,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { LYRIC_TIMELINE, TOTAL_DURATION, formatTime } from "./timeline";
import type { LyricSegment } from "./timeline";
import { CharacterStyles, Kid, KidCloseUp } from "./character";
import type { Expression, KidVariant, Pose } from "./character";
import { SafeZoneOverlay } from "../../components/SafeZoneOverlay";

/* ====================================================================
 *  PUMagrib.tsx — "Petak Umpet di Waktu Maghrib" (MV animasi 9:16)
 *
 *  Pemakaian:
 *    <PUMagrib />                         // jalan tanpa audio (jam internal)
 *    <PUMagrib audioSrc="/lagu.mp3" />    // sinkron dengan file lagu
 *
 *  Struktur:
 *   1. Utilitas + blok gambar (langit, lampu, gang, rumah, dll)
 *   2. 10 scene latar (sesuai sceneType di timeline.ts)
 *   3. Rencana shot per segmen (wide / medium / close / detail / scenery)
 *   4. Kamera virtual (zoom + geser) dan overlay lirik
 * ==================================================================== */

const W = 360;
const H = 640;

type Scene = LyricSegment["sceneType"];
type Shot = "wide" | "medium" | "close" | "detail" | "scenery";

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const rnd = (i: number, k = 1) => {
  const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/** Tokoh di timeline.ts bernama "Yosa"; di video ini namanya Oca. */
const rename = (s: string) => s.replace(/YOSA/g, "OCA").replace(/Yosa/g, "Oca").replace(/\bYos\b/g, "Ca");

/* ====================================================================
 * 1. BLOK GAMBAR
 * ==================================================================== */

const Defs = () => (
  <defs>
    <radialGradient id="glow">
      <stop offset="0" stopColor="#ffd98a" stopOpacity=".7" />
      <stop offset="1" stopColor="#ffd98a" stopOpacity="0" />
    </radialGradient>
    <linearGradient id="beam" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor="#fffbe0" stopOpacity=".9" />
      <stop offset="1" stopColor="#fffbe0" stopOpacity="0" />
    </linearGradient>
    <filter id="film-grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" result="noise" />
      <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.08 0" />
    </filter>
  </defs>
);

const Sky = ({ id, stops }: { id: string; stops: [string, string, string] }) => (
  <g>
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={stops[0]} />
        <stop offset=".4" stopColor={stops[1]} />
        <stop offset=".68" stopColor={stops[2]} />
      </linearGradient>
    </defs>
    <rect x={-40} y={-40} width={W + 80} height={H + 80} fill={`url(#${id})`} />
  </g>
);

const Ground = ({ y, color }: { y: number; color: string }) => (
  <rect x={-40} y={y} width={W + 80} height={H - y + 40} fill={color} />
);

const Stars = ({ n, maxY, seed }: { n: number; maxY: number; seed: number }) => (
  <g fill="#fff">
    {Array.from({ length: n }, (_, i) => (
      <circle
        key={i}
        cx={rnd(i, seed) * W}
        cy={rnd(i, seed + 1) * maxY}
        r={0.8 + rnd(i, seed + 2) * 1.4}
        style={{ animation: `fx-twinkle ${2 + rnd(i, seed + 3) * 3}s ease-in-out ${rnd(i, seed + 4) * 3}s infinite` }}
      />
    ))}
  </g>
);

const Cloud = ({ x, y, s = 1, c = "#ffd9a8" }: { x: number; y: number; s?: number; c?: string }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity=".5">
    <g className="fx-drift" fill={c}>
      <ellipse cx={0} cy={0} rx={46} ry={11} />
      <ellipse cx={-18} cy={-8} rx={22} ry={11} />
      <ellipse cx={14} cy={-11} rx={26} ry={13} />
    </g>
  </g>
);

const Birds = () => (
  <g className="fx-drift" stroke="#2b1a42" strokeWidth={2} fill="none" strokeLinecap="round">
    {[
      [220, 120],
      [250, 140],
      [200, 155],
    ].map(([x, y], i) => (
      <path key={i} d={`M${x} ${y} q6 -7 12 0 q6 -7 12 0`} />
    ))}
  </g>
);

/** Deretan rumah siluet, lebar sama rata supaya bisa di-tile mulus. */
const Skyline = ({
  y,
  color,
  seed = 1,
  lit = 0,
  tall = 70,
  n = 8,
}: {
  y: number;
  color: string;
  seed?: number;
  lit?: number;
  tall?: number;
  n?: number;
}) => {
  const w = W / n;
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const h = 28 + rnd(i, seed) * tall;
        const x = i * w;
        const roof = rnd(i, seed + 9) > 0.4;
        return (
          <g key={i}>
            <rect x={x + 1} y={y - h} width={w - 2} height={h} fill={color} />
            {roof && <path d={`M${x - 2} ${y - h} L${x + w / 2} ${y - h - 16} L${x + w + 2} ${y - h} Z`} fill={color} />}
            {lit > 0 && rnd(i, seed + 2) < lit && (
              <rect x={x + w * 0.3} y={y - h * 0.62} width={8} height={10} fill="#ffd27a" opacity=".9" />
            )}
          </g>
        );
      })}
    </g>
  );
};

const Tree = ({ x, y, s = 1, color }: { x: number; y: number; s?: number; color: string }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill={color}>
    <rect x={-4} y={-70} width={8} height={70} />
    <circle cx={0} cy={-88} r={30} />
    <circle cx={-22} cy={-72} r={22} />
    <circle cx={22} cy={-72} r={22} />
  </g>
);

const Lamp = ({
  x,
  y,
  h,
  on = true,
  flicker = false,
  glow = 100,
}: {
  x: number;
  y: number;
  h: number;
  on?: boolean;
  flicker?: boolean;
  glow?: number;
}) => (
  <g>
    <rect x={x - 3} y={y - h} width={6} height={h} fill="#14101f" />
    <path d={`M${x} ${y - h} Q${x} ${y - h - 18} ${x + 16} ${y - h - 18}`} stroke="#14101f" strokeWidth={4} fill="none" />
    <circle cx={x + 16} cy={y - h - 13} r={6} fill={on ? "#fff1b8" : "#3d3856"} />
    {on && (
      <g className={flicker ? "fx-flicker" : undefined}>
        <circle cx={x + 16} cy={y - h - 13} r={glow} fill="url(#glow)" />
        <ellipse cx={x + 16} cy={y} rx={glow * 0.8} ry={glow * 0.16} fill="#ffd98a" opacity=".13" />
      </g>
    )}
  </g>
);

const CatEyes = ({ x, y }: { x: number; y: number }) => (
  <g fill="#ffe14d" style={{ animation: "fx-blink 4s infinite", transformOrigin: `${x}px ${y}px` }}>
    <ellipse cx={x - 5} cy={y} rx={2.4} ry={3.2} />
    <ellipse cx={x + 5} cy={y} rx={2.4} ry={3.2} />
  </g>
);

const Surau = ({ x, y }: { x: number; y: number }) => (
  <g fill="#21122f">
    <rect x={x - 62} y={y - 64} width={124} height={64} />
    <path d={`M${x - 40} ${y - 64} Q${x} ${y - 120} ${x + 40} ${y - 64} Z`} />
    <rect x={x - 2} y={y - 130} width={4} height={14} />
    <circle cx={x} cy={y - 132} r={4} fill="#ffd27a" />
    <rect x={x + 66} y={y - 150} width={14} height={150} />
    <path d={`M${x + 62} ${y - 150} Q${x + 73} ${y - 178} ${x + 84} ${y - 150} Z`} />
    <circle cx={x + 73} cy={y - 182} r={3} fill="#ffd27a" />
    <rect x={x - 46} y={y - 44} width={14} height={22} fill="#ffd27a" />
    <rect x={x + 32} y={y - 44} width={14} height={22} fill="#ffd27a" />
    <path d={`M${x - 9} ${y} V${y - 26} Q${x} ${y - 38} ${x + 9} ${y - 26} V${y} Z`} fill="#ffcf7a" />
  </g>
);

const House = ({
  x,
  y,
  w,
  h,
  wall,
  roof,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  wall: string;
  roof: string;
}) => (
  <g>
    <circle cx={x} cy={y - h * 0.3} r={w * 0.62} fill="url(#glow)" opacity=".5" />
    <rect x={x - w / 2} y={y - h} width={w} height={h} fill={wall} />
    <path d={`M${x - w / 2 - 8} ${y - h} L${x} ${y - h - h * 0.42} L${x + w / 2 + 8} ${y - h} Z`} fill={roof} />
    <rect x={x - w / 2 + w * 0.1} y={y - h * 0.68} width={w * 0.2} height={h * 0.26} fill="#ffd98a" />
    <rect x={x + w / 2 - w * 0.3} y={y - h * 0.68} width={w * 0.2} height={h * 0.26} fill="#ffd98a" />
    <path d={`M${x - w / 2 + w * 0.2} ${y - h * 0.68} v${h * 0.26} M${x + w / 2 - w * 0.2} ${y - h * 0.68} v${h * 0.26}`} stroke={wall} strokeWidth={2} />
    <rect x={x - w * 0.09} y={y - h * 0.55} width={w * 0.18} height={h * 0.55} fill="#ffcf7a" />
  </g>
);

/* ---- gang sempit berperspektif (titik hilang di sekitar (180, 330)) ---- */

const wallY = (x: number, f: number) => {
  const top = -20 + 290 * (x / 145);
  const bot = 700 - 305 * (x / 145);
  return top + (bot - top) * f;
};
const quad = (x1: number, x2: number, f1: number, f2: number, mirror = false) => {
  const X = (x: number) => (mirror ? W - x : x);
  return `${X(x1)},${wallY(x1, f1)} ${X(x2)},${wallY(x2, f1)} ${X(x2)},${wallY(x2, f2)} ${X(x1)},${wallY(x1, f2)}`;
};

const AlleyWalls = ({
  left,
  right,
  floor,
  far,
  lit = 0.5,
}: {
  left: string;
  right: string;
  floor: string;
  far: string;
  lit?: number;
}) => (
  <g>
    <polygon points="145,270 215,270 215,395 145,395" fill={far} />
    <polygon points="0,-20 145,270 145,395 0,700" fill={left} />
    <polygon points="360,-20 215,270 215,395 360,700" fill={right} />
    <polygon points="0,700 145,395 215,395 360,700" fill={floor} />
    <g stroke="#000" strokeOpacity=".25" strokeWidth={1.2}>
      {[0.15, 0.3, 0.45, 0.6, 0.75, 0.9].map((f) => (
        <g key={f}>
          <line x1={0} y1={wallY(0, f)} x2={145} y2={wallY(145, f)} />
          <line x1={W} y1={wallY(0, f)} x2={W - 145} y2={wallY(145, f)} />
        </g>
      ))}
    </g>
    {/* pintu gelap + jendela redup di kiri */}
    <polygon points={quad(18, 62, 0.42, 1)} fill="#0c0c18" />
    <polygon points={quad(78, 112, 0.22, 0.38)} fill="#ffd27a" opacity={lit * 0.55} />
    {/* pagar tinggi di kanan */}
    <polygon points={quad(10, 118, 0.38, 1, true)} fill="#10101e" />
    <g stroke="#2a2a44" strokeWidth={2}>
      {Array.from({ length: 11 }, (_, i) => 14 + i * 10).map((x) => (
        <line key={x} x1={W - x} y1={wallY(x, 0.38)} x2={W - x} y2={wallY(x, 1)} />
      ))}
    </g>
    <polygon points={quad(60, 100, 0.16, 0.3, true)} fill="#ffd27a" opacity={lit * 0.35} />
  </g>
);

const Minimarket = ({ x, y }: { x: number; y: number }) => (
  <g>
    <rect x={x} y={y - 88} width={110} height={88} fill="#26213d" />
    <rect x={x} y={y - 88} width={110} height={16} fill="#3a2f55" />
    <text x={x + 55} y={y - 76} fontSize={9} fontWeight={700} textAnchor="middle" fill="#9fd6ff" opacity=".85">
      MINIMARKET
    </text>
    <rect x={x + 10} y={y - 62} width={90} height={48} fill="#8fb7d9" opacity=".22" />
  </g>
);

/* ====================================================================
 * 2. SCENE LATAR
 * ==================================================================== */

interface ActorDef {
  x: number; // posisi kaki
  y: number;
  s: number;
  pose: Pose;
  expr: Expression;
  flip?: boolean;
  sil?: boolean;
}

interface SceneDef {
  Bg: React.FC;
  oca: ActorDef;
  friend?: ActorDef;
  look: [number, number]; // titik fokus shot "scenery"
  detail: [number, number]; // titik fokus shot "detail"
  light: string; // filter untuk close-up wajah
}

const Actor = ({ a, v, expr }: { a: ActorDef; v: KidVariant; expr?: Expression }) => (
  <g transform={`translate(${a.x} ${a.y}) scale(${(a.flip ? -1 : 1) * a.s} ${a.s}) translate(-100 -332)`}>
    <Kid variant={v} pose={a.pose} expr={expr ?? a.expr} silhouette={a.sil} />
  </g>
);

/* 1. sunset_surau — senja hangat, surau, jalan lengang */
const BgSurau = () => (
  <g>
    <Sky id="s1" stops={["#4b2f73", "#ff7e5f", "#ffc36b"]} />
    <circle cx={140} cy={365} r={130} fill="#ffe29a" opacity=".22" />
    <circle cx={140} cy={365} r={68} fill="#fff3b8" />
    <Cloud x={50} y={160} />
    <Cloud x={250} y={235} s={1.3} />
    <Birds />
    <Skyline y={425} color="#2b1a42" seed={2} n={9} />
    <Surau x={265} y={428} />
    <Tree x={40} y={432} s={1.2} color="#241436" />
    <Ground y={425} color="#2f1d3b" />
    <path d="M0 470 H360" stroke="#ffb86b" strokeOpacity=".25" strokeWidth={2} />
    <path d="M0 625 H360" stroke="#ffcf8a" strokeOpacity=".35" strokeWidth={4} strokeDasharray="30 30" />
  </g>
);

/* 2. running_sunset — lapangan, matahari rendah, teman-teman siluet */
const BgRunning = () => (
  <g>
    <Sky id="s2" stops={["#7a3b8c", "#ff6a4d", "#ffb347"]} />
    <circle cx={250} cy={400} r={140} fill="#ffd27a" opacity=".25" />
    <circle cx={250} cy={400} r={78} fill="#fff0b0" />
    <Cloud x={70} y={190} c="#ffc08a" />
    <Skyline y={440} color="#33204a" seed={6} n={10} tall={40} />
    <Tree x={320} y={445} s={1.1} color="#2a1a40" />
    <Tree x={30} y={445} s={0.9} color="#2a1a40" />
    <Ground y={440} color="#3e4a2e" />
    <path d="M0 440 H360" stroke="#ffd27a" strokeOpacity=".4" strokeWidth={3} />
    <Actor a={{ x: 70, y: 480, s: 0.2, pose: "run", expr: "happy", sil: true }} v="friend" />
    <Actor a={{ x: 135, y: 492, s: 0.24, pose: "run", expr: "happy", sil: true }} v="friend" />
    <Actor a={{ x: 300, y: 486, s: 0.22, pose: "run", expr: "happy", sil: true }} v="friend" />
    <g stroke="#fff" strokeOpacity=".55" strokeWidth={2} strokeLinecap="round">
      {[
        [40, 520, 50],
        [250, 560, 60],
        [110, 500, 40],
        [290, 610, 50],
      ].map(([x, y, w], i) => (
        <line key={i} x1={x} y1={y} x2={x + w} y2={y} style={{ animation: `fx-speed ${0.7 + i * 0.15}s linear ${i * 0.2}s infinite` }} />
      ))}
    </g>
  </g>
);

/* 3. panic_homeless — langit ungu, lapangan kosong, minimarket, kardus */
const BgPanic = () => (
  <g>
    <Sky id="s3" stops={["#150f33", "#4a2368", "#d4507a"]} />
    <Stars n={14} maxY={240} seed={3} />
    <Skyline y={432} color="#1a1230" seed={11} n={9} tall={50} />
    <Minimarket x={236} y={438} />
    <Ground y={432} color="#1a1428" />
    <Lamp x={60} y={452} h={230} on={false} />
    <g>
      <rect x={262} y={448} width={50} height={30} fill="#b08550" />
      <path d="M287 448 V478" stroke="#8c6638" strokeWidth={3} />
      <rect x={262} y={448} width={50} height={5} fill="#c79a60" />
    </g>
    {[
      [100, 500, 0],
      [215, 520, 0.7],
      [160, 470, 1.4],
    ].map(([x, y, d], i) => (
      <text
        key={i}
        x={x}
        y={y}
        fontSize={34}
        fontWeight={800}
        fill="#ffe9a8"
        opacity=".0"
        style={{ animation: `fx-float 2.2s ease-out ${d}s infinite` }}
      >
        ?
      </text>
    ))}
  </g>
);

/* 4. lost_alley — gang asing, pagar tinggi, lampu remang, mata kucing */
const BgAlley = () => (
  <g>
    <Sky id="s4" stops={["#0b1030", "#1a2552", "#2c3a6b"]} />
    <Stars n={26} maxY={180} seed={4} />
    <AlleyWalls left="#2b2c4a" right="#222340" floor="#171829" far="#3a456f" lit={0.5} />
    <CatEyes x={40} y={505} />
    <Lamp x={318} y={640} h={380} flicker glow={140} />
  </g>
);

/* 5. crying_corner — sudut gang, tiang listrik, genangan */
const BgCorner = () => (
  <g>
    <Sky id="s5" stops={["#080c22", "#141c3e", "#26386a"]} />
    <Stars n={20} maxY={160} seed={5} />
    <AlleyWalls left="#20223c" right="#1a1b33" floor="#12132a" far="#2a3358" lit={0.2} />
    <g stroke="#10101c" strokeWidth={2} fill="none">
      <path d="M292 180 Q180 205 40 160" />
      <path d="M292 195 Q190 225 40 185" />
    </g>
    <rect x={262} y={176} width={62} height={6} fill="#10101c" />
    <Lamp x={292} y={640} h={470} flicker glow={150} />
    <rect x={20} y={540} width={44} height={56} rx={4} fill="#0e0e1c" />
    <ellipse cx={230} cy={572} rx={74} ry={15} fill="#2a3c6e" opacity=".6" />
    <ellipse cx={246} cy={572} rx={22} ry={4} fill="#ffe9a8" opacity=".5" style={{ animation: "fx-twinkle 1.6s ease-in-out infinite" }} />
  </g>
);

/* 6. flashlight_search — gelap, cahaya senter menyisir dari kejauhan */
const BgFlash = () => (
  <g>
    <Sky id="s6" stops={["#04060d", "#0a1126", "#142040"]} />
    <AlleyWalls left="#12162a" right="#0f1226" floor="#0b0d1d" far="#1d2a4f" lit={0.1} />
    <circle cx={180} cy={335} r={46} fill="url(#glow)" opacity=".45" />
    <g transform="translate(192 388) rotate(112)">
      <g style={{ animation: "fx-sweep 3.2s ease-in-out infinite alternate" }}>
        <path d="M0 0 L300 -48 L300 48 Z" fill="url(#beam)" opacity=".8" />
      </g>
    </g>
  </g>
);

/* 7. hero_friend — ujung gang mulai terang, lampu jalan menyala */
const BgHero = () => (
  <g>
    <Sky id="s7" stops={["#1a2150", "#3a3a78", "#c98a6a"]} />
    <Stars n={14} maxY={150} seed={7} />
    <AlleyWalls left="#3d3a5e" right="#34305a" floor="#262440" far="#ffcf8a" lit={0.9} />
    <circle cx={180} cy={330} r={130} fill="url(#glow)" />
    <Lamp x={40} y={640} h={380} glow={150} />
  </g>
);

/* 8. walking_home — jalan terang, lampu & pohon bergeser */
const WalkTile = () => (
  <g>
    <Tree x={160} y={440} s={0.7} color="#161530" />
    <circle cx={40} cy={440} r={14} fill="#141328" />
    <circle cx={320} cy={440} r={16} fill="#141328" />
    <Lamp x={70} y={462} h={150} glow={110} />
    <Lamp x={250} y={462} h={150} glow={110} />
    <path d="M0 640 H360" stroke="#ffd98a" strokeOpacity=".22" strokeWidth={4} strokeDasharray="60 60" />
  </g>
);

const BgWalk = () => (
  <g>
    <Sky id="s8" stops={["#10173a", "#2a2f64", "#6a4f86"]} />
    <Stars n={30} maxY={260} seed={8} />
    <circle cx={290} cy={110} r={22} fill="#fff4d0" opacity=".9" />
    <Ground y={440} color="#25233f" />
    <g style={{ animation: "fx-slide 9s linear infinite" }}>
      <WalkTile />
      <g transform="translate(360 0)">
        <WalkTile />
      </g>
    </g>
  </g>
);

/* 9. happy_chorus — malam meriah: lampion, bokeh, konfeti, nada */
const BgHappy = () => (
  <g>
    <Sky id="s9" stops={["#161f55", "#3a3382", "#b05a95"]} />
    <Stars n={34} maxY={280} seed={9} />
    {Array.from({ length: 12 }, (_, i) => (
      <circle
        key={i}
        cx={rnd(i, 21) * W}
        cy={300 + rnd(i, 22) * 300}
        r={8 + rnd(i, 23) * 16}
        fill={["#ffd98a", "#ff9ac7", "#9ad7ff"][i % 3]}
        opacity=".0"
        style={{ animation: `fx-float ${3 + rnd(i, 24) * 3}s ease-out ${rnd(i, 25) * 3}s infinite` }}
      />
    ))}
    <path d="M0 60 Q180 120 360 60" stroke="#e9d9ff" strokeWidth={2} fill="none" />
    {Array.from({ length: 11 }, (_, i) => {
      const t = i / 10;
      const x = 360 * t;
      const y = 60 + 120 * t * (1 - t);
      return <path key={i} d={`M${x - 8} ${y} L${x + 8} ${y} L${x} ${y + 18} Z`} fill={["#ff6b6b", "#ffd93d", "#6bcB77", "#4d96ff"][i % 4]} />;
    })}
    <Skyline y={440} color="#1d1b4a" seed={12} n={8} lit={0.8} tall={60} />
    <Ground y={440} color="#2b2a58" />
    <Lamp x={50} y={470} h={160} glow={120} />
    <Lamp x={290} y={470} h={160} glow={120} />
    {Array.from({ length: 18 }, (_, i) => (
      <rect
        key={i}
        x={rnd(i, 31) * W}
        y={-20}
        width={6}
        height={10}
        fill={["#ff6b6b", "#ffd93d", "#6bcB77", "#4d96ff", "#ff9ac7"][i % 5]}
        style={{ animation: `fx-fall ${4 + rnd(i, 32) * 4}s linear ${rnd(i, 33) * 4}s infinite` }}
      />
    ))}
    {["♪", "♫", "♪", "♫"].map((n, i) => (
      <text
        key={i}
        x={40 + i * 85}
        y={420}
        fontSize={28}
        fill="#fff"
        opacity=".0"
        style={{ animation: `fx-float 3s ease-out ${i * 0.7}s infinite` }}
      >
        {n}
      </text>
    ))}
  </g>
);

/* 10. safe_home_outro — rumah hangat, pintu terbuka, ibu menanti, bulan sabit */
const BgOutro = () => (
  <g>
    <Sky id="s10" stops={["#0b1538", "#1f2d6b", "#7a5aa0"]} />
    <Stars n={50} maxY={300} seed={10} />
    <defs>
      <mask id="cres">
        <rect width={W} height={H} fill="#fff" />
        <circle cx={96} cy={104} r={26} fill="#000" />
      </mask>
    </defs>
    <circle cx={84} cy={110} r={30} fill="#fff4cf" mask="url(#cres)" />
    <Tree x={40} y={520} s={1.5} color="#14243a" />
    <House x={190} y={525} w={210} h={130} wall="#e2c392" roof="#8a3b3b" />
    {/* ibu menunggu di pintu */}
    <g fill="#3a2418">
      <circle cx={190} cy={478} r={8} />
      <path d="M180 488 L200 488 L206 524 L174 524 Z" />
      <path d="M180 490 L166 478 M200 490 L214 478" stroke="#3a2418" strokeWidth={5} strokeLinecap="round" />
    </g>
    <Ground y={525} color="#2c2748" />
    <g stroke="#14101f" strokeWidth={3}>
      {Array.from({ length: 22 }, (_, i) => i * 17).map((x) => (
        <line key={x} x1={x} y1={522} x2={x} y2={548} />
      ))}
      <line x1={0} y1={532} x2={360} y2={532} />
    </g>
    <Lamp x={310} y={560} h={150} glow={110} />
    {Array.from({ length: 14 }, (_, i) => (
      <circle
        key={i}
        cx={rnd(i, 41) * W}
        cy={430 + rnd(i, 42) * 150}
        r={2.2}
        fill="#fff7a0"
        style={{ animation: `fx-twinkle ${1.5 + rnd(i, 43) * 2}s ease-in-out ${rnd(i, 44) * 2}s infinite` }}
      />
    ))}
    <text x={130} y={470} fontSize={20} opacity=".0" style={{ animation: "fx-float 3s ease-out infinite" }}>
      🍗
    </text>
  </g>
);

const NIGHT = "brightness(.72) saturate(.85) drop-shadow(0 0 24px rgba(90,120,255,.35))";
const WARM = "brightness(1.05) saturate(1.05) drop-shadow(0 0 24px rgba(255,190,110,.35))";

const SCENES: Record<Scene, SceneDef> = {
  sunset_surau: {
    Bg: BgSurau,
    oca: { x: 115, y: 590, s: 0.55, pose: "walk", expr: "happy" },
    look: [200, 380],
    detail: [115, 585],
    light: "sepia(.35) saturate(1.4) brightness(1.05)",
  },
  running_sunset: {
    Bg: BgRunning,
    oca: { x: 200, y: 595, s: 0.6, pose: "run", expr: "happy" },
    look: [250, 400],
    detail: [200, 590],
    light: "sepia(.35) saturate(1.4) brightness(1.05)",
  },
  panic_homeless: {
    Bg: BgPanic,
    oca: { x: 150, y: 595, s: 0.6, pose: "panic", expr: "scared" },
    look: [100, 320],
    detail: [150, 590],
    light: "brightness(.8) saturate(1.1) drop-shadow(0 0 24px rgba(212,80,122,.4))",
  },
  lost_alley: {
    Bg: BgAlley,
    oca: { x: 180, y: 605, s: 0.52, pose: "look", expr: "worried" },
    look: [110, 390],
    detail: [180, 600],
    light: NIGHT,
  },
  crying_corner: {
    Bg: BgCorner,
    oca: { x: 130, y: 600, s: 0.62, pose: "crouch", expr: "crying" },
    look: [292, 230],
    detail: [230, 570],
    light: NIGHT,
  },
  flashlight_search: {
    Bg: BgFlash,
    oca: { x: 105, y: 612, s: 0.56, pose: "crouch", expr: "worried" },
    friend: { x: 196, y: 410, s: 0.2, pose: "run", expr: "worried", sil: true },
    look: [190, 400],
    detail: [110, 600],
    light: NIGHT,
  },
  hero_friend: {
    Bg: BgHero,
    oca: { x: 120, y: 595, s: 0.62, pose: "stand", expr: "scared" },
    friend: { x: 200, y: 595, s: 0.66, pose: "reach", expr: "happy" },
    look: [180, 330],
    detail: [150, 475],
    light: WARM,
  },
  walking_home: {
    Bg: BgWalk,
    oca: { x: 140, y: 605, s: 0.6, pose: "holdR", expr: "relief" },
    friend: { x: 216, y: 605, s: 0.64, pose: "holdL", expr: "happy" },
    look: [300, 400],
    detail: [176, 520],
    light: WARM,
  },
  happy_chorus: {
    Bg: BgHappy,
    oca: { x: 120, y: 598, s: 0.62, pose: "cheer", expr: "happy" },
    friend: { x: 225, y: 598, s: 0.66, pose: "cheer", expr: "happy" },
    look: [180, 200],
    detail: [170, 590],
    light: WARM,
  },
  safe_home_outro: {
    Bg: BgOutro,
    oca: { x: 115, y: 610, s: 0.6, pose: "wave", expr: "happy" },
    friend: { x: 240, y: 610, s: 0.64, pose: "wave", expr: "happy" },
    look: [180, 330],
    detail: [180, 600],
    light: WARM,
  },
};

/* ====================================================================
 * 3. RENCANA SHOT  [jenis shot, ekspresi Oca?, tokoh close-up?]
 * ==================================================================== */

type ShotPlan = [Shot, Expression?, KidVariant?];

const SHOTS: Record<string, ShotPlan> = {
  "intro-1": ["scenery"],
  "v1-1": ["wide"],
  "v1-2": ["medium", "happy"],
  "v1-3": ["wide"],
  "v1-4": ["medium"],

  "c1-1": ["scenery"],
  "c1-2": ["close", "scared"],
  "c1-3": ["wide", "worried"],
  "c1-4": ["medium", "scared"],

  "v2-1": ["wide"],
  "v2-2": ["medium", "worried"],
  "v2-3": ["scenery"],
  "v2-4": ["close", "crying"],
  "v2-5": ["medium"],
  "v2-6": ["medium", "worried"],
  "v2-7": ["detail"],
  "v2-8": ["wide"],

  "c2-1": ["scenery"],
  "c2-2": ["close", "crying"],
  "c2-3": ["wide"],
  "c2-4": ["medium"],

  "bridge-1": ["scenery"],
  "bridge-2": ["wide"],

  "v3-1": ["medium", "scared"],
  "v3-2": ["medium", "relief"],
  "v3-3": ["medium", "relief"],
  "v3-4": ["close", "happy", "friend"],
  "v3-5": ["medium"],
  "v3-6": ["wide"],
  "v3-7": ["scenery"],
  "v3-8": ["medium", "relief"],

  "c3-1": ["wide"],
  "c3-2": ["medium"],
  "c3-3": ["scenery"],
  "c3-4": ["close", "happy"],

  "outro-1": ["medium"],
  "outro-2": ["scenery"],
  "outro-3": ["close", "happy", "friend"],
  "outro-4": ["wide"],
};

/* ====================================================================
 * 4. KAMERA, DUNIA, OVERLAY
 * ==================================================================== */

function cameraFor(shot: Shot, d: SceneDef, p: number, t: number, shake: boolean) {
  const e = ease(clamp(p, 0, 1));
  const o = d.oca;
  const f = d.friend && !d.friend.sil ? d.friend : undefined;
  let z0 = 1;
  let z1 = 1.1;
  let cx = 180;
  let cy = 340;

  if (shot === "medium") {
    z0 = f ? 1.5 : 1.9;
    z1 = f ? 1.7 : 2.2;
    cx = f ? (o.x + f.x) / 2 : o.x;
    cy = o.y - 330 * o.s * 0.55;
  } else if (shot === "scenery") {
    z0 = 1.25;
    z1 = 1.5;
    cx = d.look[0] + lerp(-10, 10, e);
    cy = d.look[1];
  } else if (shot === "detail") {
    z0 = 2.6;
    z1 = 3.1;
    [cx, cy] = d.detail;
  } else if (shot === "close") {
    z0 = 1.4;
    z1 = 1.55;
    cy = 330;
  }

  const z = lerp(z0, z1, e);
  cx = clamp(cx, W / 2 / z, W - W / 2 / z);
  cy = clamp(cy, H / 2 / z, H - H / 2 / z);
  const jx = shake ? Math.sin(t * 61) * 2.2 : 0;
  const jy = shake ? Math.cos(t * 53) * 2.2 : 0;
  return `translate(${W / 2 + jx} ${H / 2 + jy}) scale(${z}) translate(${-cx} ${-cy})`;
}

/** Dunia scene. */
const World: React.FC<{ scene: Scene; chars: boolean; expr?: Expression }> = ({ scene, chars, expr }) => {
  const d = SCENES[scene];
  return (
    <g>
      <d.Bg />
      {chars && <Actor a={d.oca} v="oca" expr={expr} />}
      {chars && d.friend && <Actor a={d.friend} v="friend" />}
    </g>
  );
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Poppins:wght@500;600;700&display=swap');
.mv-root{position:absolute;inset:0;width:100%;height:100%;background:#000;overflow:hidden;color:#fff;font-family:"Baloo 2","Poppins","Trebuchet MS",system-ui,sans-serif}
.mv-stage{position:absolute;inset:0;width:100%;height:100%;container-type:inline-size;overflow:hidden;background:#000}
.mv-svg{position:absolute;inset:0;width:100%;height:100%;z-index:1}
.mv-close{position:absolute;inset:0 0 14% 0;display:flex;align-items:center;justify-content:center;pointer-events:none;z-index:2}
.mv-close>div{width:88%;animation:mv-push .35s ease-out}
.mv-vignette{position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at center,transparent 55%,rgba(0,0,0,.55) 100%);z-index:3}
.mv-shade{position:absolute;left:0;right:0;bottom:0;height:44%;pointer-events:none;background:linear-gradient(to top,rgba(0,0,0,.78),transparent);z-index:4}
.mv-cut{position:absolute;inset:0;background:#fff;pointer-events:none;animation:mv-cut .3s ease-out both;z-index:5}
.mv-bar{position:absolute;left:0;right:0;height:4.5%;background:#000;z-index:6}
.mv-progress{position:absolute;left:0;right:0;top:calc(4.5% - 3px);height:3px;background:rgba(255,255,255,.2);z-index:7}
.mv-progress>i{display:block;height:100%;background:#ffd84d}
.mv-hud{position:absolute;left:0;right:0;top:4.5%;padding:2.4cqw 4cqw;display:flex;justify-content:space-between;font-size:3.2cqw;font-weight:600;opacity:.85;text-shadow:0 1px 4px #000;z-index:7}
.mv-lyrics{position:absolute;left:0;right:0;bottom:7.5%;padding:0 6cqw;text-align:center;display:flex;flex-direction:column;align-items:center;gap:1.6cqw;z-index:7}
.mv-chip{font-size:2.8cqw;font-weight:700;letter-spacing:.08em;padding:.5cqw 2.6cqw;border-radius:99px;background:rgba(255,255,255,.16);backdrop-filter:blur(4px)}
.mv-text{font-size:6.4cqw;font-weight:800;line-height:1.15;text-shadow:0 2px 0 rgba(0,0,0,.6),0 0 14px rgba(0,0,0,.7);animation:mv-text .35s ease-out both}
.mv-hook{font-size:8.4cqw;color:#ffe14d;-webkit-text-stroke:.6cqw #b3122a;paint-order:stroke fill;animation:mv-pop .5s ease-out both}
.mv-sub{font-size:3.6cqw;font-weight:500;line-height:1.3;opacity:.92;text-shadow:0 1px 6px #000;animation:mv-text .5s ease-out .1s both}
@keyframes fx-flicker{0%,100%{opacity:1}8%{opacity:.35}12%{opacity:.9}30%{opacity:.5}34%{opacity:1}70%{opacity:.7}}
@keyframes fx-drift{from{transform:translateX(-30px)}to{transform:translateX(30px)}}
@keyframes fx-sweep{from{transform:rotate(-14deg)}to{transform:rotate(14deg)}}
@keyframes fx-slide{from{transform:translateX(0)}to{transform:translateX(-360px)}}
@keyframes fx-twinkle{0%,100%{opacity:.25}50%{opacity:1}}
@keyframes fx-float{from{transform:translateY(0);opacity:0}15%{opacity:.9}to{transform:translateY(-120px);opacity:0}}
@keyframes fx-fall{from{transform:translateY(0) rotate(0)}to{transform:translateY(680px) rotate(360deg)}}
@keyframes fx-blink{0%,92%,100%{transform:scaleY(1)}96%{transform:scaleY(.1)}}
@keyframes fx-speed{from{transform:translateX(40px);opacity:0}30%{opacity:.7}to{transform:translateX(-80px);opacity:0}}
@keyframes mv-cut{from{opacity:.6}to{opacity:0}}
@keyframes mv-text{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
@keyframes mv-pop{0%{opacity:0;transform:scale(.8) rotate(-2deg)}40%{opacity:1;transform:scale(1.08) rotate(1deg)}100%{opacity:1;transform:scale(1) rotate(0)}}
@keyframes mv-push{from{opacity:0;transform:scale(.9)}to{opacity:1;transform:scale(1)}}
.fx-flicker{animation:fx-flicker 3.4s infinite}
.fx-drift{animation:fx-drift 14s ease-in-out infinite alternate}
`;

/* ====================================================================
 * KOMPONEN UTAMA
 * ==================================================================== */

export interface PUMagribProps {
  /** File lagu di folder public/, default: "petak-umpet-maghrib.mp3" */
  audioFileName?: string;
  /** File lagu (opsional). Jika ada, audio menjadi jam utama video. */
  audioSrc?: string;
  /** Volume audio (0 s/d 1), default: 1 */
  audioVolume?: number;
  /** Tampilkan border bar sinematik di atas & bawah */
  showCinematicBars?: boolean;
  /** Tampilkan efek tekstur film grain */
  showFilmGrain?: boolean;
  /** Tampilkan HUD (judul lagu & durasi real-time) */
  showHUD?: boolean;
  /** Tampilkan teks lirik / subtitle karaoke */
  showSubtitles?: boolean;
  /** Tampilkan chip bagian lagu (INTRO, VERSE 1, dll), default: false */
  showSection?: boolean;
  /** Tampilkan teks narasi tambahan / subtext, default: false */
  showSubtext?: boolean;
  /** Tampilkan overlay safe zone platform shorts/reels */
  showSafeZone?: boolean;
  autoPlay?: boolean;
}

export const PUMagrib: React.FC<PUMagribProps> = ({
  audioFileName = "petak-umpet-maghrib.mp3",
  audioSrc,
  audioVolume = 1,
  showCinematicBars = true,
  showFilmGrain = false,
  showHUD = true,
  showSubtitles = true,
  showSection = false,
  showSubtext = false,
  showSafeZone = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = frame / fps;

  /* segmen & shot aktif */
  const seg =
    LYRIC_TIMELINE.find((s) => time >= s.startTime && time < s.endTime) ??
    (time >= TOTAL_DURATION
      ? LYRIC_TIMELINE[LYRIC_TIMELINE.length - 1]
      : LYRIC_TIMELINE[0]);
  const plan: ShotPlan = SHOTS[seg.id] ?? ["wide"];
  const shot = plan[0];
  const who: KidVariant = plan[2] ?? "oca";
  const d = SCENES[seg.sceneType];
  const p = (time - seg.startTime) / Math.max(0.01, seg.endTime - seg.startTime);
  const shake = !!seg.isHook && seg.sceneType === "panic_homeless";
  const cam = cameraFor(shot, d, p, time, shake);
  const showChars = shot === "wide" || shot === "medium" || shot === "detail";
  const closeExpr: Expression = plan[1] ?? (who === "friend" ? "happy" : d.oca.expr);

  const resolvedAudioSrc = audioSrc
    ? audioSrc.startsWith("http") || audioSrc.startsWith("/")
      ? audioSrc
      : staticFile(audioSrc)
    : staticFile(audioFileName || "petak-umpet-maghrib.mp3");

  return (
    <AbsoluteFill className="mv-root">
      <style>{CSS}</style>
      <CharacterStyles />
      {resolvedAudioSrc && <Audio src={resolvedAudioSrc} volume={audioVolume} />}

      <div className="mv-stage">
        <svg
          className="mv-svg"
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="xMidYMid slice"
          style={{ filter: shot === "close" ? "blur(3px) brightness(.8)" : "none" }}
        >
          <Defs />
          <g transform={cam}>
            <World scene={seg.sceneType} chars={showChars} expr={plan[1]} />
          </g>
        </svg>

        {shot === "close" && (
          <div className="mv-close" key={`close-${seg.id}`} style={{ filter: d.light }}>
            <div>
              <KidCloseUp variant={who} expr={closeExpr} />
            </div>
          </div>
        )}

        <div className="mv-vignette" />
        <div className="mv-shade" />
        <div className="mv-cut" key={`cut-${seg.id}`} />

        {showCinematicBars && (
          <>
            <div className="mv-bar" style={{ top: 0 }} />
            <div className="mv-bar" style={{ bottom: 0 }} />
          </>
        )}

        {showHUD && (
          <>
            <div className="mv-progress">
              <i style={{ width: `${Math.min(100, (time / TOTAL_DURATION) * 100)}%` }} />
            </div>
            <div className="mv-hud">
              <span>🎵 Petak Umpet di Waktu Maghrib</span>
              <span>
                {formatTime(time)} / {formatTime(TOTAL_DURATION)}
              </span>
            </div>
          </>
        )}

        {showSubtitles && (
          <div className="mv-lyrics" key={`lyrics-${seg.id}`}>
            {showSection && <span className="mv-chip">{seg.section}</span>}
            <div className={`mv-text${seg.isHook ? " mv-hook" : ""}`}>{rename(seg.text)}</div>
            {showSubtext && seg.subtext && <div className="mv-sub">{rename(seg.subtext)}</div>}
          </div>
        )}

        {showFilmGrain && (
          <svg
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
              zIndex: 5,
            }}
          >
            <rect width="100%" height="100%" filter="url(#film-grain)" />
          </svg>
        )}

        {showSafeZone && <SafeZoneOverlay visible={showSafeZone} />}
      </div>
    </AbsoluteFill>
  );
};

export { PUMagrib as PetakUmpetMagribMV };
export default PUMagrib;
