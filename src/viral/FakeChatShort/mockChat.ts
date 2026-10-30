export interface ChatMessage {
  id: string;
  sender: "me" | "them";
  text: string;
  startFrame: number;
}

export interface ChatStory {
  contactName: string;
  contactSubtitle: string;
  contactAvatar: string;
  messages: ChatMessage[];
}

export const DEFAULT_CHAT_STORY: ChatStory = {
  contactName: "Klien Sultan 💼",
  contactSubtitle: "Online",
  contactAvatar: "👨‍💼",
  messages: [
    {
      id: "1",
      sender: "them",
      text: "Halo mas, mau bikin web e-commerce kayak Tokopedia + AI chatbot ya.",
      startFrame: 20,
    },
    {
      id: "2",
      sender: "me",
      text: "Halo mas! Bisa banget. Budgetnya berapa ya mas?",
      startFrame: 70,
    },
    {
      id: "3",
      sender: "them",
      text: "Budgetnya 500 ribu mas, deadline besok sore bisa kan? 😅",
      startFrame: 130,
    },
    {
      id: "4",
      sender: "me",
      text: "Bisa mas! Nanti dapet landing page bertuliskan 'Sedang Dalam Perbaikan' 🙏",
      startFrame: 195,
    },
    {
      id: "5",
      sender: "them",
      text: "LOH KOK GITU?! 😭🤣",
      startFrame: 260,
    },
  ],
};

