# 🚀 Latihan Video Viral Remotion (TikTok, Reels, Shorts)

Project Remotion ini sudah dikonfigurasi khusus untuk membuat format video pendek vertikal (**9:16 - 1080x1920**) yang sedang tren dan viral di TikTok, Instagram Reels, dan YouTube Shorts.

---

## 🛠️ Ringkasan Perbaikan Konfigurasi

1. **Format Resolusi Video Vertikal (9:16)**:
   - Dikonfigurasi di `1080 x 1920` @ 30 FPS (standar video Shorts/Reels/TikTok).
2. **Optimalisasi [remotion.config.ts](file:///home/kiyory/Documents/Remotion/latihan-remotion/latihan-remotion/remotion.config.ts)**:
   - Menggunakan **Rspack** untuk bundling super cepat.
   - Codec `h264` dengan pixel format `yuv420p` (standar wajib agar video lancar diputar di semua HP & aplikasi sosial media tanpa glitch).
   - Auto-detect Google Chrome lokal di Linux agar rendering tidak perlu men-download ulang Chrome Headless Shell.
3. **Safe Zone Overlay Helper**:
   - Komponen `SafeZoneOverlay` untuk memastikan judul/subtitle tidak tertutup tombol Like, Komentar, Username, atau Audio Bar di TikTok/Reels.

---

## 🎬 4 Template Video Viral Siap Pakai

Semua template bisa kamu lihat dan edit langsung di Remotion Studio sidebar:

### 1. `PetakUmpetMaghrib` (Kisah Yosa 7 Tahun - Official 9:16 MV) ⭐ BARU!
- **Path Komponen**: [`src/viral/PetakUmpetMaghrib/PetakUmpetMaghrib.tsx`](file:///home/kiyory/Documents/Remotion/latihan-remotion/latihan-remotion/src/viral/PetakUmpetMaghrib/PetakUmpetMaghrib.tsx)
- **Path Audio**: [`public/petak-umpet-maghrib.mp3`](file:///home/kiyory/Documents/Remotion/latihan-remotion/latihan-remotion/public/petak-umpet-maghrib.mp3) (Durasi: **02:56 / 5307 frame**)
- **Data Timeline & Lirik**: [`src/viral/PetakUmpetMaghrib/timeline.ts`](file:///home/kiyory/Documents/Remotion/latihan-remotion/latihan-remotion/src/viral/PetakUmpetMaghrib/timeline.ts)
- **Karakter & Animasi**: [`src/viral/PetakUmpetMaghrib/Characters.tsx`](file:///home/kiyory/Documents/Remotion/latihan-remotion/latihan-remotion/src/viral/PetakUmpetMaghrib/Characters.tsx) (Yosa & Sahabat Penyelamat)
- **Fitur Lengkap**:
  - Full 2D SVG Movie bergaya kartun komik dengan transisi warna langit dari senja surau -> merah panik homeless -> malam gang gelap -> lampu jalan hangat saat diselamatkan sahabat.
  - Animasi karakter Yosa (lari, nangis peluk lutut, panik teriak O besar, senang tertawa) dan Sahabat berpeci dengan senter pahlawan.
  - Subtitle karaoke dinamis (fill progress bar per baris lirik).
  - Sinkronisasi sempurna dengan lagu `petak-umpet-maghrib.mp3`.

### 2. `ViralCaptions` (Alex Hormozi / CapCut Kinetic Captions)
- **Path**: [`src/viral/CaptionsShort/CaptionsShort.tsx`](file:///home/kiyory/Documents/Remotion/latihan-remotion/latihan-remotion/src/viral/CaptionsShort/CaptionsShort.tsx)
- **Ciri khas**: Subtitle kata-per-kata yang memantul (spring physics), highlight kata aktif dengan warna neon/pill box kuning cerah, audio waveform bar, dan hook banner di bagian atas.
- **Data script**: Edit teks di [`src/viral/CaptionsShort/mockCaptions.ts`](file:///home/kiyory/Documents/Remotion/latihan-remotion/latihan-remotion/src/viral/CaptionsShort/mockCaptions.ts).

### 2. `ViralQuiz` (Interactive Countdown Trivia / Tebak-tebakan)
- **Path**: [`src/viral/QuizShort/QuizShort.tsx`](file:///home/kiyory/Documents/Remotion/latihan-remotion/latihan-remotion/src/viral/QuizShort/QuizShort.tsx)
- **Ciri khas**: Format tebak logo / trivia dengan countdown timer bar 5 detik, 4 opsi pilihan ganda, dan efek reveal jawaban benar (hijau menyala). Sangat disukai algoritma karena menghasilkan watch-time 100%+ dan memancing komentar penonton.
- **Data quiz**: Edit soal di [`src/viral/QuizShort/mockQuiz.ts`](file:///home/kiyory/Documents/Remotion/latihan-remotion/latihan-remotion/src/viral/QuizShort/mockQuiz.ts).

### 3. `ViralFakeChat` (iMessage / WhatsApp Story)
- **Path**: [`src/viral/FakeChatShort/FakeChatShort.tsx`](file:///home/kiyory/Documents/Remotion/latihan-remotion/latihan-remotion/src/viral/FakeChatShort/FakeChatShort.tsx)
- **Ciri khas**: Animasi percakapan chat (klien vs freelancer, cerita lucu, drama) dengan bubble animasi pegas, bouncing typing indicator dots, dan tampilan WhatsApp/iOS dark mode.
- **Data percakapan**: Edit chat di [`src/viral/FakeChatShort/mockChat.ts`](file:///home/kiyory/Documents/Remotion/latihan-remotion/latihan-remotion/src/viral/FakeChatShort/mockChat.ts).

---

## 🚀 Cara Menjalankan

### 1. Buka Remotion Studio (Preview & Editing Realtime)
```bash
npm run dev
```
Buka browser di `http://localhost:3000`. Kamu bisa menggeser timeline, mencoba safe-zone guide, dan mengganti teks langsung dari sidebar props.

### 2. Render Video ke MP4
Untuk merender video berkualitas tinggi:

```bash
# Render video musik Petak Umpet Maghrib (Kisah Yosa - 2:56)
npm run render:mv

# Render video kinetic captions
npm run render:captions

# Render video kuis / tebak-tebakan
npm run render:quiz

# Render video chat story
npm run render:chat

# Atau ambil 1 frame gambar untuk thumbnail / cover
npm run still
```

### 3. Menyalakan Safe Zone Guide
Di [`src/Root.tsx`](file:///home/kiyory/Documents/Remotion/latihan-remotion/latihan-remotion/src/Root.tsx), ubah `showSafeZone: true` pada `defaultProps` composition yang ingin kamu cek, atau centang di panel Remotion Studio.
