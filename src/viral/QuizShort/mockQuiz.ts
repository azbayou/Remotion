export interface QuizOption {
  id: string;
  label: string;
  text: string;
  isCorrect: boolean;
}

export interface QuizData {
  category: string;
  question: string;
  mysteryHint: string;
  revealFrame: number;
  options: QuizOption[];
  correctExplanation: string;
}

export const DEFAULT_QUIZ_DATA: QuizData = {
  category: "TEBAK LOGO IT 🧠",
  question: "Bahasa pemrograman apa yang punya logo kepiting bernama Ferris?",
  mysteryHint: "🦀",
  revealFrame: 180, // reveal at frame 180 (6 seconds into a 30fps clip)
  options: [
    { id: "a", label: "A", text: "Python", isCorrect: false },
    { id: "b", label: "B", text: "Golang", isCorrect: false },
    { id: "c", label: "C", text: "Rust", isCorrect: true },
    { id: "d", label: "D", text: "TypeScript", isCorrect: false },
  ],
  correctExplanation: "Ferris the Crab adalah maskot resmi bahasa Rust! 🦀",
};
