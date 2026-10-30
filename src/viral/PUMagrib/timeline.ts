export interface LyricSegment {
  id: string;
  startTime: number; // dalam detik
  endTime: number; // dalam detik
  section:
    | "INTRO"
    | "VERSE 1"
    | "CHORUS 1"
    | "VERSE 2"
    | "CHORUS 2"
    | "BRIDGE"
    | "VERSE 3"
    | "CHORUS 3"
    | "OUTRO";
  text: string;
  subtext?: string;
  sceneType:
    | "sunset_surau"
    | "running_sunset"
    | "panic_homeless"
    | "lost_alley"
    | "crying_corner"
    | "flashlight_search"
    | "hero_friend"
    | "walking_home"
    | "happy_chorus"
    | "safe_home_outro";
  isHook?: boolean;
}

export const TOTAL_DURATION = 176.88; // 2 menit 56.88 detik

export const LYRIC_TIMELINE: LyricSegment[] = [
  // INTRO (0:00 - 0:08)
  {
    id: "intro-1",
    startTime: 0,
    endTime: 8,
    section: "INTRO",
    text: "Petak Umpet di Waktu Maghrib",
    subtext: "Kisah Nyata OCA (7 Tahun) • Hampir Homeless",
    sceneType: "sunset_surau",
  },

  // VERSE 1 (0:08 - 0:25)
  {
    id: "v1-1",
    startTime: 8,
    endTime: 12,
    section: "VERSE 1",
    text: "Tujuh tahun umurku lagi di tempat ngaji",
    subtext: "Bawa tas gambar robot, kacamata bulat di muka",
    sceneType: "sunset_surau",
  },
  {
    id: "v1-2",
    startTime: 12,
    endTime: 16,
    section: "VERSE 1",
    text: "Harusnya ngaji tapi malah pilih asyik",
    subtext: "Iqro di tangan kiri, pikiran udah di lapangan",
    sceneType: "running_sunset",
  },
  {
    id: "v1-3",
    startTime: 16,
    endTime: 21,
    section: "VERSE 1",
    text: "Sama temen-temen di bawah langit jingga",
    subtext: "Senja makin pekat, hitungan satu sampai sepuluh!",
    sceneType: "running_sunset",
  },
  {
    id: "v1-4",
    startTime: 21,
    endTime: 25,
    section: "VERSE 1",
    text: "Kabur dari surau demi petak umpet",
    subtext: "Cari tempat sembunyi paling jauh biar gak ketahuan!",
    sceneType: "running_sunset",
  },

  // CHORUS 1 (0:25 - 0:42)
  {
    id: "c1-1",
    startTime: 25,
    endTime: 29,
    section: "CHORUS 1",
    text: "Maghrib tiba bumi mulai gelap",
    subtext: "Suara adzan berkumandang... lampu jalan belum nyala!",
    sceneType: "panic_homeless",
  },
  {
    id: "c1-2",
    startTime: 29,
    endTime: 33,
    section: "CHORUS 1",
    text: "OCA PANIK HAMPIR JADI HOMELESS",
    subtext: "DARURAT ANAK 7 TAHUN KEHILANGAN ARAH PULANG",
    sceneType: "panic_homeless",
    isHook: true,
  },
  {
    id: "c1-3",
    startTime: 33,
    endTime: 37,
    section: "CHORUS 1",
    text: "Maghrib tiba bumi mulai gelap",
    subtext: "Temen-temen udah pada bubar atau gimana?!",
    sceneType: "panic_homeless",
  },
  {
    id: "c1-4",
    startTime: 37,
    endTime: 42,
    section: "CHORUS 1",
    text: "OCA PANIK HAMPIR JADI HOMELESS",
    subtext: "Bayangin tidur di kardus minimarket umur 7 tahun",
    sceneType: "panic_homeless",
    isHook: true,
  },

  // VERSE 2 (0:42 - 1:15)
  {
    id: "v2-1",
    startTime: 42,
    endTime: 46,
    section: "VERSE 2",
    text: "Lari terlalu jauh sampai gang sebelah",
    subtext: "Tadi perasaan belok kiri dua kali... apa tiga kali?",
    sceneType: "lost_alley",
  },
  {
    id: "v2-2",
    startTime: 46,
    endTime: 50,
    section: "VERSE 2",
    text: "Noleh ke belakang jalannya hilang sudah",
    subtext: "Kok pohon mangga dekat rumah gak kelihatan?!",
    sceneType: "lost_alley",
  },
  {
    id: "v2-3",
    startTime: 50,
    endTime: 54,
    section: "VERSE 2",
    text: "Semua rumah tampak asing banget sekarang",
    subtext: "Pagar tinggi, lampu remang-remang, suara jangkrik...",
    sceneType: "lost_alley",
  },
  {
    id: "v2-4",
    startTime: 54,
    endTime: 58,
    section: "VERSE 2",
    text: "Mulai takut dan air mata tumpah",
    subtext: 'Bibir gemetar... "Ibuuuu... OCA di manaaa..."',
    sceneType: "crying_corner",
  },
  {
    id: "v2-5",
    startTime: 58,
    endTime: 62,
    section: "VERSE 2",
    text: "Di sudut gang sempit nangis sendirian",
    subtext: "Jongkok peluk lutut dekat tiang listrik",
    sceneType: "crying_corner",
  },
  {
    id: "v2-6",
    startTime: 62,
    endTime: 67,
    section: "VERSE 2",
    text: "Mikirin gimana caranya biar pulang",
    subtext: "Mau tanya orang lewat tapi malu sambil sesenggukan",
    sceneType: "crying_corner",
  },
  {
    id: "v2-7",
    startTime: 67,
    endTime: 71,
    section: "VERSE 2",
    text: "Kalau bapak tahu pasti kena omel",
    subtext: "Udah bolos ngaji + pulang malam = Kombo Maut!",
    sceneType: "crying_corner",
  },
  {
    id: "v2-8",
    startTime: 71,
    endTime: 75,
    section: "VERSE 2",
    text: "Di mana rumahku kok nggak ketemu",
    subtext: "Fix malam ini resmi jadi gembel cilik...",
    sceneType: "crying_corner",
  },

  // CHORUS 2 (1:15 - 1:32)
  {
    id: "c2-1",
    startTime: 75,
    endTime: 79,
    section: "CHORUS 2",
    text: "Maghrib tiba bumi mulai gelap",
    subtext: "Langit udah ungu gelap menuju hitam pekat!",
    sceneType: "panic_homeless",
  },
  {
    id: "c2-2",
    startTime: 79,
    endTime: 83,
    section: "CHORUS 2",
    text: "OCA PANIK HAMPIR JADI HOMELESS",
    subtext: "STATUS DOMISILI: GANG SEBELAH ENTah BERANTAH",
    sceneType: "panic_homeless",
    isHook: true,
  },
  {
    id: "c2-3",
    startTime: 83,
    endTime: 87,
    section: "CHORUS 2",
    text: "Maghrib tiba bumi mulai gelap",
    subtext: "Angin malam mulai dingin menusuk tulang...",
    sceneType: "panic_homeless",
  },
  {
    id: "c2-4",
    startTime: 87,
    endTime: 92,
    section: "CHORUS 2",
    text: "OCA PANIK HAMPIR JADI HOMELESS",
    subtext: "Tinggal selangkah lagi bikin tenda dari daun pisang!",
    sceneType: "panic_homeless",
    isHook: true,
  },

  // INSTRUMENTAL BRIDGE (1:32 - 1:48)
  {
    id: "bridge-1",
    startTime: 92,
    endTime: 100,
    section: "BRIDGE",
    text: "[Instrumental Guitar & Synth Solo]",
    subtext: "Di kejauhan... ada cahaya senter menyisir gang sempit...",
    sceneType: "flashlight_search",
  },
  {
    id: "bridge-2",
    startTime: 100,
    endTime: 108,
    section: "BRIDGE",
    text: '"OCAaa! OCA kamu di manaaa?!"',
    subtext: "Langkah kaki kecil berlari mendekat mencari OCA...",
    sceneType: "flashlight_search",
  },

  // VERSE 3 (1:48 - 2:22)
  {
    id: "v3-1",
    startTime: 108,
    endTime: 112,
    section: "VERSE 3",
    text: "Tiba-tiba tangan mungil pegang bahuku",
    subtext: "Bukan hantu maghrib... tapi tangan hangat sahabat!",
    sceneType: "hero_friend",
  },
  {
    id: "v3-2",
    startTime: 112,
    endTime: 117,
    section: "VERSE 3",
    text: "Suara akrab panggil nama dengan lembut",
    subtext: '"Woy OCA! Ngapain umpetan sampai ujung dunia?!"',
    sceneType: "hero_friend",
  },
  {
    id: "v3-3",
    startTime: 117,
    endTime: 121,
    section: "VERSE 3",
    text: "Ternyata temen baikku yang cari-cari",
    subtext: "Dia gak pulang duluan, malah keliling komplek nyariin!",
    sceneType: "hero_friend",
  },
  {
    id: "v3-4",
    startTime: 121,
    endTime: 125,
    section: "VERSE 3",
    text: "Senyumnya lebar kayak pahlawan sejati",
    subtext: "Aura positif 1000%! Bestie dunia akhirat!",
    sceneType: "hero_friend",
  },
  {
    id: "v3-5",
    startTime: 125,
    endTime: 129,
    section: "VERSE 3",
    text: 'Dia bilang "tenang aja ayo pulang"',
    subtext: '"Rumahmu cuma belok kanan situ doang, Yos!"',
    sceneType: "walking_home",
  },
  {
    id: "v3-6",
    startTime: 129,
    endTime: 134,
    section: "VERSE 3",
    text: "Gandeng tanganku lewat jalan yang terang",
    subtext: "Lampu jalan menyala hangat, air mata langsung kering",
    sceneType: "walking_home",
  },
  {
    id: "v3-7",
    startTime: 134,
    endTime: 138,
    section: "VERSE 3",
    text: "Hati lega banget pas lihat gerbang",
    subtext: "Itu dia pagar rumah! Ada aroma ayam goreng Ibu!",
    sceneType: "walking_home",
  },
  {
    id: "v3-8",
    startTime: 138,
    endTime: 142,
    section: "VERSE 3",
    text: "Akhirnya selamat dari dingin malam",
    subtext: "Batal tidur di emperan! Alhamdulillah!",
    sceneType: "walking_home",
  },

  // CHORUS 3 (2:22 - 2:39)
  {
    id: "c3-1",
    startTime: 142,
    endTime: 146,
    section: "CHORUS 3",
    text: "Maghrib tiba bumi mulai gelap",
    subtext: "Tapi sekarang udah tahu jalan pulang!",
    sceneType: "happy_chorus",
  },
  {
    id: "c3-2",
    startTime: 146,
    endTime: 150,
    section: "CHORUS 3",
    text: "OCA PANIK HAMPIR JADI HOMELESS",
    subtext: "Sejarah paling kocak waktu umur 7 tahun!",
    sceneType: "happy_chorus",
    isHook: true,
  },
  {
    id: "c3-3",
    startTime: 150,
    endTime: 154,
    section: "CHORUS 3",
    text: "Maghrib tiba bumi mulai gelap",
    subtext: "Besok-besok langsung ngaji ke surau aja deh!",
    sceneType: "happy_chorus",
  },
  {
    id: "c3-4",
    startTime: 154,
    endTime: 159,
    section: "CHORUS 3",
    text: "OCA PANIK HAMPIR JADI HOMELESS",
    subtext: "Shoutout buat temen baik yang jadi penyelamat!",
    sceneType: "happy_chorus",
    isHook: true,
  },

  // OUTRO (2:39 - 2:56)
  {
    id: "outro-1",
    startTime: 159,
    endTime: 163,
    section: "OUTRO",
    text: "OCA hampir homeless...",
    subtext: "Status Akhir: BATAL HOMELESS",
    sceneType: "safe_home_outro",
    isHook: true,
  },
  {
    id: "outro-2",
    startTime: 163,
    endTime: 167,
    section: "OUTRO",
    text: "Gara-gara petak umpet!",
    subtext: "Pelajaran moral: Jangan ngumpet lintas RT pas Maghrib",
    sceneType: "safe_home_outro",
  },
  {
    id: "outro-3",
    startTime: 167,
    endTime: 171,
    section: "OUTRO",
    text: "OCA hampir homeless...",
    subtext: "Terima kasih sahabat sejati!",
    sceneType: "safe_home_outro",
    isHook: true,
  },
  {
    id: "outro-4",
    startTime: 171,
    endTime: 176.88,
    section: "OUTRO",
    text: "Untung pulang selamat!",
    subtext: "Directed & Animated in 9:16 • Durasi 2:56",
    sceneType: "safe_home_outro",
  },
];

export function formatTime(seconds: number): string {
  const clamped = Math.max(0, Math.min(TOTAL_DURATION, Math.floor(seconds)));
  const mins = Math.floor(clamped / 60);
  const secs = clamped % 60;
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

