import { Composition, Folder } from "remotion";
import { HelloWorld } from "./HelloWorld";
import { Logo } from "./HelloWorld/Logo";
import { Title } from "./HelloWorld/Title";
import { CaptionsShort } from "./viral/CaptionsShort/CaptionsShort";
import { DEFAULT_VIRAL_CAPTIONS } from "./viral/CaptionsShort/mockCaptions";
import { QuizShort } from "./viral/QuizShort/QuizShort";
import { DEFAULT_QUIZ_DATA } from "./viral/QuizShort/mockQuiz";
import { FakeChatShort } from "./viral/FakeChatShort/FakeChatShort";
import { DEFAULT_CHAT_STORY } from "./viral/FakeChatShort/mockChat";
import { PetakUmpetMaghrib } from "./viral/PetakUmpetMaghrib/PetakUmpetMaghrib";

// Each <Composition> is an entry in the Remotion Studio sidebar!

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* 🚀 VIRAL SHORTS (9:16 VERTICAL - 1080x1920) */}
      <Folder name="ViralShorts">
        {/* 1. Kinetic Subtitles / Alex Hormozi Style */}
        <Composition
          id="ViralCaptions"
          component={CaptionsShort}
          durationInFrames={300} // 10 seconds at 30 fps
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{
            hookTitle: "Trik Bikin Video Viral 🚀",
            hookCategory: "REMOTION SECRETS",
            authorHandle: "@developer_id",
            captions: DEFAULT_VIRAL_CAPTIONS,
            highlightColor: "#FFE600",
            activeWordStyle: "pill" as const,
            showSafeZone: false,
            musicSrc: "", // isi misal: "bgm.mp3" kalau sudah taruh file di folder public/
            musicVolume: 0.3,
          }}
        />

        {/* 2. Interactive Countdown Quiz / Trivia */}
        <Composition
          id="ViralQuiz"
          component={QuizShort}
          durationInFrames={240} // 8 seconds at 30 fps
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{
            quiz: DEFAULT_QUIZ_DATA,
            showSafeZone: false,
            musicSrc: "",
            musicVolume: 0.3,
          }}
        />

        {/* 3. iMessage / WhatsApp Viral Chat Story */}
        <Composition
          id="ViralFakeChat"
          component={FakeChatShort}
          durationInFrames={320} // ~10.6 seconds at 30 fps
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{
            story: DEFAULT_CHAT_STORY,
            showSafeZone: false,
            musicSrc: "",
            musicVolume: 0.3,
          }}
        />
        {/* 🎬 4. Petak Umpet di Waktu Maghrib (Kisah Nyata Yosa - Official MV 2:56) */}
        <Composition
          id="PetakUmpetMaghrib"
          component={PetakUmpetMaghrib}
          durationInFrames={5307} // 176.88 detik @ 30 fps (2 menit 56 detik)
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{
            audioFileName: "petak-umpet-maghrib.mp3",
            audioVolume: 1,
            showSafeZone: false,
          }}
        />
      </Folder>

      {/* 💻 ORIGINAL TEMPLATES (16:9 LANDSCAPE - 1920x1080) */}
      <Folder name="OriginalTemplates">
        <Composition
          id="HelloWorld"
          component={HelloWorld}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            titleText: "Welcome to Remotion",
            titleColor: "#000000",
          }}
        />
        <Composition
          id="Logo"
          component={Logo}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            logoColor1: "#91EAE4",
            logoColor2: "#86A8E7",
          }}
        />
        <Composition
          id="Title"
          component={Title}
          durationInFrames={115}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            titleText: "Welcome to Remotion",
            titleColor: "#000000",
          }}
        />
      </Folder>
    </>
  );
};
