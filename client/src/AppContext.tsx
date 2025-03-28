import { createContext, useState, ReactNode, useContext, useEffect } from "react";

export const languageLevels = [
  {
    id: "A1",
    name: "A1",
  },
  {
    id: "A2",
    name: "A2",
  },
  {
    id: "B1",
    name: "B1",
  },
  {
    id: "B2",
    name: "B2",
  },
  {
    id: "C1",
    name: "C1",
  },
  {
    id: "C2",
    name: "C2",
  },
] as const;

export type LanguageLevel = (typeof languageLevels)[number]["id"];

interface AppContext {
  level?: LanguageLevel;
  setLevel: (level: LanguageLevel) => void;
  topics: string[];
  selectedTopic?: string;
  setSelectedTopic: (topic: string) => void;
}

export const AppContext = createContext<AppContext | undefined>(undefined);

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [level, setLevel] = useState<LanguageLevel>();
  const [topics, setTopics] = useState<string[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string>();

  useEffect(() => {
    if (level) {
      // Fetch topics based on the selected level
      fetch(`/api/topics?level=${level}`)
        .then(response => response.json())
        .then(data => setTopics(data.topics))
        .catch(error => console.error("Error fetching topics:", error));
    }
  }, [level]);

  return (
    <AppContext.Provider value={{ level, setLevel, topics, selectedTopic, setSelectedTopic }}>
      {children}
    </AppContext.Provider>
  );
};

export function useAppContext() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }

  return context;
}
