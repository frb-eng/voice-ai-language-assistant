import { createContext, useState, ReactNode, useContext } from "react";

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
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const AppContext = createContext<AppContext | undefined>(undefined);

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(false);

  return (
    <AppContext.Provider value={{ loading, setLoading }}>
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
