import { create } from "zustand";

export type OnePagerData = {
  about: string;
  mission: string;
  values: string;
  financial: string;
  achievements: string;
  callToAction: string;
};

type Message = string;

type State = {
  conversation: Message[];
  questionCount: number;
  isFinished: boolean;
  onePager: OnePagerData | null;
  isThinking: boolean;
  isGenerating: boolean;
  isDownloading: boolean;
  showFinishEarly: boolean;
  setConversation: (messages: Message[]) => void;
  addMessage: (msg: Message) => void;
  setOnePager: (data: OnePagerData) => void;
  setFinished: (finished: boolean) => void;
  setIsThinking: (val: boolean) => void;
  setIsGenerating: (val: boolean) => void;
  setIsDownloading: (val: boolean) => void;
  setShowFinishEarly: (val: boolean) => void;
};

export const useConversationStore = create<State>((set) => ({
  conversation: [],
  questionCount: 0,
  isFinished: false,
  onePager: null,
  isThinking: false,
  isGenerating: false,
  isDownloading: false,
  showFinishEarly: false,

  setConversation: (messages) =>
    set({
      conversation: messages,
      questionCount: messages.filter((m) => m.startsWith("סוכן:")).length,
    }),

  addMessage: (msg) =>
    set((state) => ({
      conversation: [...state.conversation, msg],
      questionCount: msg.startsWith("סוכן:")
        ? state.questionCount + 1
        : state.questionCount,
    })),

  setOnePager: (data) => set({ onePager: data }),
  setFinished: (finished) => set({ isFinished: finished }),
  setIsThinking: (val) => set({ isThinking: val }),
  setIsGenerating: (val) => set({ isGenerating: val }),
  setIsDownloading: (val) => set({ isDownloading: val }),
  setShowFinishEarly: (val) => set({ showFinishEarly: val }),
}));
