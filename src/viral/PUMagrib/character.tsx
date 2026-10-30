import React from "react";

/* ------------------------------------------------------------------ *
 *  character.tsx
 *  Oca  : 7 tahun, kurus, rambut pendek lurus (poni rata), kacamata bulat
 *  Friend: sahabat yang mencari Oca (peci, tubuh lebih berisi)
 *
 *  Semua digambar dengan SVG murni, tanpa library. Koordinat kerja
 *  tiap karakter: kotak 200 x 340, kaki berpijak di y ≈ 332.
 * ------------------------------------------------------------------ */

export type Expression = "happy" | "worried" | "scared" | "crying" | "relief";
export type Pose =
  | "stand"
  | "walk"
  | "run"
  | "panic"
  | "look"
  | "crouch"
  | "holdR" // tangan kanan terulur (menggandeng ke kanan)
  | "holdL" // tangan kiri terulur (menggandeng ke kiri)
  | "reach" // tangan kiri meraih bahu
  | "cheer"
  | "wave";
export type KidVariant = "oca" | "friend";

/* ------------------------- CSS animasi ----------------------------- */

export const CHARACTER_CSS = `
@keyframes kid-limb{from{transform:rotate(calc((var(--a) - var(--d)) * 1deg))}to{transform:rotate(calc((var(--a) + var(--d)) * 1deg))}}
@keyframes kid-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
@keyframes kid-jump{0%,100%{transform:translateY(0)}50%{transform:translateY(-24px)}}
@keyframes kid-shake{0%{transform:translate(-2px,0) rotate(-1.2deg)}50%{transform:translate(2px,-1px) rotate(1.2deg)}100%{transform:translate(-2px,0) rotate(-1.2deg)}}
@keyframes kid-sob{0%,100%{transform:translateY(0)}50%{transform:translateY(3px)}}
@keyframes kid-sway{0%,100%{transform:rotate(-1deg)}50%{transform:rotate(1deg)}}
@keyframes kid-look{0%,15%{transform:rotate(0)}25%,45%{transform:rotate(-13deg)}55%,75%{transform:rotate(12deg)}90%,100%{transform:rotate(0)}}
@keyframes kid-tear{0%{transform:translateY(0);opacity:0}15%{opacity:.95}100%{transform:translateY(22px);opacity:0}}
@keyframes kid-sweat{0%,100%{transform:translateY(0);opacity:.9}50%{transform:translateY(7px);opacity:.5}}
@keyframes kid-gaze{0%,100%{transform:translateX(-2.5px)}50%{transform:translateX(2.5px)}}
@keyframes kid-breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.012)}}
`;

export const CharacterStyles: React.FC = () => <style>{CHARACTER_CSS}</style>;

/* --------------------------- Palet --------------------------------- */

interface Palette {
  skin: string;
  shirt: string;
  shorts: string;
  hair: string;
  ink: string;
}

const PALETTE: Record<KidVariant, Palette> = {
  oca: { skin: "#f4d0a8", shirt: "#f7f7f2", shorts: "#d02f33", hair: "#1d1822", ink: "#2a2430" },
  friend: { skin: "#d49a62", shirt: "#4fa6a0", shorts: "#2f3a6b", hair: "#17141c", ink: "#2a2430" },
};

/* --------------------------- Pose ---------------------------------- */

type BodyAnim = "bob" | "jump" | "shake" | "sob" | "sway";

interface PoseDef {
  aL: number; // sudut dasar lengan kiri (derajat, + = ke kiri layar)
  aR: number; // sudut dasar lengan kanan (- = ke kanan layar)
  lL: number;
  lR: number;
  dAL?: number; // amplitudo ayunan
  dAR?: number;
  dL?: number;
  dur?: number;
  body?: BodyAnim;
  head?: boolean;
}

const POSES: Record<Exclude<Pose, "crouch">, PoseDef> = {
  stand: { aL: 7, aR: -7, lL: 2, lR: -2, body: "sway" },
  walk: { aL: 0, aR: 0, lL: 0, lR: 0, dAL: 22, dAR: 22, dL: 24, dur: 0.7, body: "bob" },
  run: { aL: 0, aR: 0, lL: 0, lR: 0, dAL: 55, dAR: 55, dL: 48, dur: 0.3, body: "bob" },
  panic: { aL: 155, aR: -155, lL: 6, lR: -6, dAL: 12, dAR: 12, dur: 0.16, body: "shake" },
  look: { aL: 14, aR: -14, lL: 2, lR: -2, body: "sway", head: true },
  holdR: { aL: 0, aR: -34, lL: 0, lR: 0, dAL: 18, dL: 22, dur: 0.7, body: "bob" },
  holdL: { aL: 32, aR: 0, lL: 0, lR: 0, dAR: 18, dL: 22, dur: 0.7, body: "bob" },
  reach: { aL: 78, aR: -8, lL: 3, lR: -3, body: "sway" },
  cheer: { aL: 140, aR: -140, lL: 8, lR: -8, dAL: 14, dAR: 14, dL: 10, dur: 0.32, body: "jump" },
  wave: { aL: 7, aR: -140, lL: 2, lR: -2, dAR: 20, dur: 0.35, body: "sway" },
};

const bodyStyle = (b: BodyAnim | undefined, dur = 1): React.CSSProperties => {
  switch (b) {
    case "bob":
      return { animation: `kid-bob ${dur}s ease-in-out infinite` };
    case "jump":
      return { animation: `kid-jump ${dur * 2}s ease-in-out infinite` };
    case "shake":
      return { animation: "kid-shake .12s linear infinite" };
    case "sob":
      return { animation: "kid-sob .55s ease-in-out infinite" };
    case "sway":
      return { animation: "kid-sway 3s ease-in-out infinite", transformOrigin: "100px 332px" };
    default:
      return {};
  }
};

/* Anggota badan yang berputar di sekitar sendi (bahu / pinggul) */
const Limb: React.FC<{
  px: number;
  py: number;
  a: number;
  d: number;
  dur: number;
  rev: boolean;
  children: React.ReactNode;
}> = ({ px, py, a, d, dur, rev, children }) => {
  const style: any = { transformOrigin: `${px}px ${py}px` };
  if (d) {
    style["--a"] = a;
    style["--d"] = d;
    style.animation = `kid-limb ${dur}s ease-in-out infinite ${rev ? "alternate-reverse" : "alternate"}`;
  } else {
    style.transform = `rotate(${a}deg)`;
  }
  return <g style={style}>{children}</g>;
};

/* --------------------------- Kepala -------------------------------- */

const Eyes: React.FC<{ expr: Expression; ink: string }> = ({ expr, ink }) => {
  const cs = [80, 120];
  switch (expr) {
    case "happy":
      return (
        <g stroke={ink} strokeWidth={3.2} fill="none" strokeLinecap="round">
          {cs.map((c) => (
            <path key={c} d={`M${c - 8} 83 Q${c} 72 ${c + 8} 83`} />
          ))}
        </g>
      );
    case "relief":
      return (
        <g stroke={ink} strokeWidth={3} fill="none" strokeLinecap="round">
          {cs.map((c) => (
            <path key={c} d={`M${c - 8} 79 Q${c} 87 ${c + 8} 79`} />
          ))}
        </g>
      );
    case "crying":
      return (
        <g stroke={ink} strokeWidth={3.2} fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M73 73 L88 81 L73 89" />
          <path d="M127 73 L112 81 L127 89" />
        </g>
      );
    case "scared":
      return (
        <g style={{ animation: "kid-gaze 1.6s ease-in-out infinite" }}>
          {cs.map((c) => (
            <g key={c}>
              <circle cx={c} cy={80} r={9.5} fill="#fff" stroke={ink} strokeWidth={1.5} />
              <circle cx={c} cy={80} r={3.2} fill={ink} />
            </g>
          ))}
        </g>
      );
    default:
      return (
        <g style={{ animation: "kid-gaze 2.2s ease-in-out infinite" }}>
          {cs.map((c) => (
            <g key={c}>
              <circle cx={c} cy={81} r={5.2} fill={ink} />
              <circle cx={c + 1.8} cy={79} r={1.6} fill="#fff" />
            </g>
          ))}
        </g>
      );
  }
};

const BROWS: Record<Expression, [string, string]> = {
  happy: ["M69 61 Q79 55 90 60", "M110 60 Q121 55 131 61"],
  relief: ["M69 62 Q79 58 90 61", "M110 61 Q121 58 131 62"],
  worried: ["M69 64 L90 57", "M110 57 L131 64"],
  scared: ["M69 60 L90 54", "M110 54 L131 60"],
  crying: ["M68 66 L90 56", "M110 56 L132 66"],
};

const Mouth: React.FC<{ expr: Expression }> = ({ expr }) => {
  switch (expr) {
    case "happy":
      return (
        <g>
          <path d="M83 101 Q100 126 117 101 Z" fill="#7a2230" />
          <ellipse cx={100} cy={109} rx={7} ry={3.5} fill="#e8737f" />
        </g>
      );
    case "scared":
      return <ellipse cx={100} cy={110} rx={7} ry={9} fill="#5a1a28" />;
    case "crying":
      return (
        <g>
          <path d="M84 104 Q100 98 116 104 Q112 124 100 124 Q88 124 84 104 Z" fill="#6b1c2a" />
          <ellipse cx={100} cy={118} rx={7} ry={4} fill="#e8737f" />
        </g>
      );
    case "relief":
      return <path d="M90 106 Q100 116 110 106" stroke="#5a1a28" strokeWidth={3} fill="none" strokeLinecap="round" />;
    default:
      return (
        <path d="M89 111 Q94 106 100 111 T111 111" stroke="#5a1a28" strokeWidth={3} fill="none" strokeLinecap="round" />
      );
  }
};

const Head: React.FC<{ v: KidVariant; expr: Expression; p: Palette; lookAround?: boolean }> = ({
  v,
  expr,
  p,
  lookAround,
}) => {
  const blush = expr === "happy" || expr === "crying" || expr === "relief";
  const [bl, br] = BROWS[expr];
  return (
    <g style={lookAround ? { animation: "kid-look 3.2s ease-in-out infinite", transformOrigin: "100px 112px" } : undefined}>
      {/* leher + telinga + wajah */}
      <rect x={94} y={108} width={12} height={18} fill={p.skin} />
      <circle cx={57} cy={78} r={8} fill={p.skin} />
      <circle cx={143} cy={78} r={8} fill={p.skin} />
      <ellipse cx={100} cy={72} rx={43} ry={45} fill={p.skin} />

      {/* rambut */}
      {v === "oca" ? (
        <g>
          {/* pendek, lurus, poni rata */}
          <path
            d="M54 84 C46 30 76 17 100 17 C124 17 154 30 146 84 L137 84 L137 52 L63 52 L63 84 Z"
            fill={p.hair}
          />
          <path d="M70 29 Q90 21 112 25" stroke="#fff" strokeOpacity=".14" strokeWidth={3} fill="none" strokeLinecap="round" />
        </g>
      ) : (
        <g>
          <path d="M57 70 C55 40 78 32 100 32 C122 32 145 40 143 70 L136 58 L64 58 Z" fill={p.hair} />
          <path d="M60 46 C64 16 136 16 140 46 L140 54 L60 54 Z" fill="#17141c" />
          <rect x={60} y={46} width={80} height={4} fill="#c9a24a" />
        </g>
      )}

      {blush && (
        <g fill="#ff8a80" opacity=".35">
          <circle cx={66} cy={100} r={7} />
          <circle cx={134} cy={100} r={7} />
        </g>
      )}

      <Eyes expr={expr} ink={p.ink} />

      {/* kacamata bulat (khusus Oca) */}
      {v === "oca" && (
        <g fill="none" stroke="#232323" strokeWidth={3} strokeLinecap="round">
          <circle cx={80} cy={80} r={16} fill="#cfe8ff" fillOpacity=".22" />
          <circle cx={120} cy={80} r={16} fill="#cfe8ff" fillOpacity=".22" />
          <path d="M96 78 Q100 74 104 78" />
          <path d="M64 77 L57 73" />
          <path d="M136 77 L143 73" />
          <path d="M69 72 A12 12 0 0 1 77 66" stroke="#fff" strokeOpacity=".75" strokeWidth={2.5} />
          <path d="M109 72 A12 12 0 0 1 117 66" stroke="#fff" strokeOpacity=".75" strokeWidth={2.5} />
        </g>
      )}

      {/* alis */}
      <g stroke={p.hair} strokeWidth={3} fill="none" strokeLinecap="round">
        <path d={bl} />
        <path d={br} />
      </g>

      {/* hidung + mulut */}
      <circle cx={100} cy={95} r={expr === "crying" ? 3.6 : 2} fill={expr === "crying" ? "#e8665a" : "#d9a07a"} />
      <Mouth expr={expr} />

      {/* air mata & keringat dingin */}
      {expr === "crying" &&
        [78, 122].map((c, i) =>
          [0, 0.55].map((dl) => (
            <path
              key={`${c}-${dl}`}
              d={`M${c + (i ? 3 : -3)} 92 q-4 8 0 13 q4 -5 0 -13z`}
              fill="#8fd3ff"
              style={{ animation: `kid-tear 1.1s ease-in ${dl}s infinite` }}
            />
          ))
        )}
      {(expr === "scared" || expr === "worried") && (
        <path
          d="M142 38 q-6 10 0 14 q6 -4 0 -14z"
          fill="#8fd3ff"
          style={{ animation: "kid-sweat 1.2s ease-in-out infinite" }}
        />
      )}
    </g>
  );
};

/* --------------------- Pose jongkok (peluk lutut) ------------------- */

const Crouch: React.FC<{ v: KidVariant; expr: Expression; p: Palette }> = ({ v, expr, p }) => {
  const f = v === "friend";
  const hw = f ? 21 : 15;
  const th = f ? 11 : 8.5;
  return (
    <g>
      {/* badan atas */}
      <path d={`M${100 - hw - 2} 196 L${100 + hw + 2} 196 L${100 + hw} 270 H${100 - hw} Z`} fill={p.shirt} />
      {/* paha (celana longgar) */}
      <ellipse cx={100} cy={276} rx={f ? 42 : 36} ry={f ? 17 : 15} fill={p.shorts} />
      {/* betis + kaus kaki + sepatu */}
      {[78, 122].map((x) => (
        <g key={x}>
          <path d={`M${x} 270 V316`} stroke={p.skin} strokeWidth={th} strokeLinecap="round" />
          <path d={`M${x} 292 V312`} stroke="#fff" strokeWidth={th + 1.5} strokeLinecap="round" />
          <ellipse cx={x + (x < 100 ? -2 : 2)} cy={324} rx={f ? 14 : 12} ry={7} fill="#2a2a38" />
        </g>
      ))}
      {/* tangan memeluk lutut */}
      <g fill="none" strokeLinecap="round">
        <path d={`M${100 - hw} 204 Q${100 - hw - 22} 248 98 280`} stroke={p.skin} strokeWidth={th} />
        <path d={`M${100 + hw} 204 Q${100 + hw + 22} 248 102 280`} stroke={p.skin} strokeWidth={th} />
        <path d={`M${100 - hw} 204 l-3 16`} stroke={p.shirt} strokeWidth={th + 4} />
        <path d={`M${100 + hw} 204 l3 16`} stroke={p.shirt} strokeWidth={th + 4} />
      </g>
      <circle cx={100} cy={281} r={6} fill={p.skin} />
      {/* tas bergambar robot tergeletak */}
      {v === "oca" && (
        <g>
          <rect x={140} y={296} width={32} height={28} rx={6} fill="#3b6fd1" />
          <rect x={146} y={303} width={20} height={11} rx={2} fill="#e8f1ff" />
          <circle cx={152} cy={308} r={2} fill="#274b9b" />
          <circle cx={160} cy={308} r={2} fill="#274b9b" />
          <path d="M152 312 h8" stroke="#274b9b" strokeWidth={1.5} />
        </g>
      )}
      <g transform="translate(0 84)">
        <Head v={v} expr={expr} p={p} />
      </g>
    </g>
  );
};

/* ----------------------- Karakter utuh (<g>) ------------------------ */

export interface KidProps {
  variant?: KidVariant;
  pose?: Pose;
  expr?: Expression;
  /** siluet hitam, dipakai untuk karakter di kejauhan */
  silhouette?: boolean;
}

/** Dipasang di dalam <svg> apa pun. Kaki berpijak di (100, 332). */
export const Kid: React.FC<KidProps> = ({ variant = "oca", pose = "stand", expr = "happy", silhouette }) => {
  const p = PALETTE[variant];
  const f = variant === "friend";
  const wrap: React.CSSProperties | undefined = silhouette ? { filter: "brightness(0) opacity(.82)" } : undefined;
  const shadow = <ellipse cx={100} cy={334} rx={f ? 46 : 40} ry={7} fill="#000" opacity=".28" />;

  if (pose === "crouch") {
    return (
      <g style={wrap}>
        {shadow}
        <g style={bodyStyle("sob")}>
          <Crouch v={variant} expr={expr} p={p} />
        </g>
      </g>
    );
  }

  const d = POSES[pose];
  const dur = d.dur ?? 1;
  const hw = f ? 21 : 15; // setengah lebar bahu (Oca kurus)
  const hip = f ? 11 : 8;
  const th = f ? 11 : 8; // tebal lengan
  const lt = f ? 12 : 8.5; // tebal kaki
  const sxL = 100 - hw;
  const sxR = 100 + hw;
  const hxL = 100 - hip;
  const hxR = 100 + hip;

  const arm = (sx: number, a: number, dd: number, rev: boolean) => (
    <Limb px={sx} py={128} a={a} d={dd} dur={dur} rev={rev}>
      <path d={`M${sx} 128 V204`} stroke={p.skin} strokeWidth={th} strokeLinecap="round" />
      <path d={`M${sx} 128 V158`} stroke={p.shirt} strokeWidth={th + 5} strokeLinecap="round" />
      <circle cx={sx} cy={206} r={th / 2 + 1.5} fill={p.skin} />
    </Limb>
  );

  const leg = (hx: number, a: number, dd: number, rev: boolean) => (
    <Limb px={hx} py={214} a={a} d={dd} dur={dur} rev={rev}>
      <path d={`M${hx} 214 V318`} stroke={p.skin} strokeWidth={lt} strokeLinecap="round" />
      <path d={`M${hx} 214 V252`} stroke={p.shorts} strokeWidth={lt + 6} strokeLinecap="round" />
      <path d={`M${hx} 292 V314`} stroke="#fff" strokeWidth={lt + 1.5} strokeLinecap="round" />
      <ellipse cx={hx + 2} cy={324} rx={f ? 14 : 12} ry={7} fill="#2a2a38" />
    </Limb>
  );

  return (
    <g style={wrap}>
      {shadow}
      <g style={bodyStyle(d.body, dur)}>
        {/* tas sekolah (hanya sisi kiri-kanan yang terlihat) */}
        {!f && <rect x={100 - hw - 12} y={118} width={2 * hw + 24} height={72} rx={9} fill="#3b6fd1" />}

        {leg(hxL, d.lL, d.dL ?? 0, true)}
        {leg(hxR, d.lR, d.dL ?? 0, false)}

        {/* badan */}
        <path d={`M${100 - hw - 2} 116 L${100 + hw + 2} 116 L${100 + hip + 4} 212 L${100 - hip - 4} 212 Z`} fill={p.shirt} />
        <path d={`M${100 - hw} 198 H${100 + hw} L${100 + hip + 7} 226 H${100 - hip - 7} Z`} fill={p.shorts} />
        {f ? (
          <g stroke="#2f827c" strokeWidth={1.5}>
            <path d="M100 124 V198" />
            <circle cx={100} cy={146} r={1.6} fill="#2f827c" />
            <circle cx={100} cy={166} r={1.6} fill="#2f827c" />
            <circle cx={100} cy={186} r={1.6} fill="#2f827c" />
          </g>
        ) : (
          <g fill="none" strokeLinecap="round">
            <path d="M91 116 L100 132 L109 116" stroke="#d6d6d0" strokeWidth={2} />
            <path d={`M${100 - hw + 4} 118 L${100 - hw + 7} 178`} stroke="#274b9b" strokeWidth={4} />
            <path d={`M${100 + hw - 4} 118 L${100 + hw - 7} 178`} stroke="#274b9b" strokeWidth={4} />
          </g>
        )}

        {arm(sxL, d.aL, d.dAL ?? 0, false)}
        {arm(sxR, d.aR, d.dAR ?? 0, true)}

        <Head v={variant} expr={expr} p={p} lookAround={d.head} />
      </g>
    </g>
  );
};

/* ------------------------- Close-up wajah --------------------------- */

/** Close-up bahu ke atas. Lebar penuh container, tinggi mengikuti rasio. */
export const KidCloseUp: React.FC<{
  variant?: KidVariant;
  expr?: Expression;
  className?: string;
  style?: React.CSSProperties;
}> = ({ variant = "oca", expr = "worried", className, style }) => {
  const p = PALETTE[variant];
  const anim =
    expr === "crying"
      ? "kid-sob .55s ease-in-out infinite"
      : expr === "scared"
      ? "kid-shake .14s linear infinite"
      : "kid-breathe 3s ease-in-out infinite";
  return (
    <svg viewBox="0 6 140 164" className={className} style={{ display: "block", width: "100%", height: "auto", ...style }}>
      <g transform="translate(-30 0)">
        <g style={{ animation: anim, transformOrigin: "100px 150px" }}>
          <path d="M36 176 Q40 134 80 124 L120 124 Q160 134 164 176 Z" fill={p.shirt} />
          {variant === "oca" ? (
            <path d="M88 124 L100 140 L112 124" fill="none" stroke="#d6d6d0" strokeWidth={2.4} strokeLinecap="round" />
          ) : (
            <path d="M100 130 V176" stroke="#2f827c" strokeWidth={2} />
          )}
          <Head v={variant} expr={expr} p={p} />
        </g>
      </g>
    </svg>
  );
};

/** Karakter Oca berdiri sendiri (mis. untuk poster / thumbnail). */
export const OcaCharacter: React.FC<{
  pose?: Pose;
  expr?: Expression;
  size?: number;
}> = ({ pose = "stand", expr = "happy", size = 220 }) => (
  <svg viewBox="0 0 200 340" width={size} height={(size * 340) / 200}>
    <Kid variant="oca" pose={pose} expr={expr} />
  </svg>
);

export default Kid;
