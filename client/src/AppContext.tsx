import { createContext, useState, ReactNode, useContext } from "react";

export const languageLevels = [
  {
    id: "BEGINNER",
    name: "Beginner",
  },
  {
    id: "INTERMEDIATE",
    name: "Intermediate",
  },
  {
    id: "ADVANCED",
    name: "Advanced",
  },
] as const;

export type LanguageLevel = (typeof languageLevels)[number]["id"];

interface AppContext {
  level?: LanguageLevel;
  setLevel: (level: LanguageLevel) => void;
}

export const AppContext = createContext<AppContext | undefined>(undefined);

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [level, setLevel] = useState<LanguageLevel>();

  return (
    <AppContext.Provider value={{ level, setLevel }}>
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
