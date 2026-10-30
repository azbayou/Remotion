export interface CaptionWord {
  text: string;
  startFrame: number;
  endFrame: number;
}

export interface CaptionPhrase {
  words: CaptionWord[];
  startFrame: number;
  endFrame: number;
}

export const DEFAULT_VIRAL_CAPTIONS: CaptionPhrase[] = [
  {
    startFrame: 0,
    endFrame: 45,
    words: [
      { text: "STOP", startFrame: 0, endFrame: 12 },
      { text: "SCROLLING!", startFrame: 13, endFrame: 45 },
    ],
  },
  {
    startFrame: 46,
    endFrame: 110,
    words: [
      { text: "Ini", startFrame: 46, endFrame: 58 },
      { text: "cara", startFrame: 59, endFrame: 70 },
      { text: "bikin", startFrame: 71, endFrame: 84 },
      { text: "video", startFrame: 85, endFrame: 97 },
      { text: "viral", startFrame: 98, endFrame: 110 },
    ],
  },
  {
    startFrame: 111,
    endFrame: 175,
    words: [
      { text: "hanya", startFrame: 111, endFrame: 122 },
      { text: "pakai", startFrame: 123, endFrame: 135 },
      { text: "REMOTION", startFrame: 136, endFrame: 155 },
      { text: "&", startFrame: 156, endFrame: 164 },
      { text: "REACT!", startFrame: 165, endFrame: 175 },
    ],
  },
  {
    startFrame: 176,
    endFrame: 235,
    words: [
      { text: "Semua", startFrame: 176, endFrame: 188 },
      { text: "animasi", startFrame: 189, endFrame: 202 },
      { text: "dibuat", startFrame: 203, endFrame: 218 },
      { text: "otomatis.", startFrame: 219, endFrame: 235 },
    ],
  },
  {
    startFrame: 236,
    endFrame: 300,
    words: [
      { text: "Simpan", startFrame: 236, endFrame: 250 },
      { text: "video", startFrame: 251, endFrame: 265 },
      { text: "ini", startFrame: 266, endFrame: 280 },
      { text: "sekarang! 🚀", startFrame: 281, endFrame: 300 },
    ],
  },
];

