import "./App.css";
import { ErrorBoundary } from "./ErrorBoundary";
import { Suspense } from "react";
import { AppContextProvider } from "./AppContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { LanguageLevelPage } from "./pages/LanguageLevelPage";
import { TopicsPage } from "./pages/TopicsPage";
import { ChatPage } from "./pages/ChatPage";

function App() {
  return (
    <AppContextProvider>
      <ErrorBoundary>
        <Suspense fallback={<div>Loading...</div>}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/level" element={<LanguageLevelPage />} />
              <Route path="/level/:level/topic" element={<TopicsPage />} />
              <Route path="/level/:level/topic/:topic" element={<ChatPage />} />
            </Routes>
          </BrowserRouter>
        </Suspense>
      </ErrorBoundary>
    </AppContextProvider>
  );
}

export default App;
