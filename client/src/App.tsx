import "./App.css";
import { ErrorBoundary } from "./ErrorBoundary";
import { Suspense } from "react";
import { Home } from "./Home";
import { AppContextProvider } from "./AppContext";

async function fetchText() {
  const response = await fetch("/api");
  return await response.text();
}

function App() {
  return (
    <AppContextProvider> 
      <ErrorBoundary>
        <Suspense fallback={<div>Loading...</div>}>
          <Home textPromise={fetchText()} />
        </Suspense>
      </ErrorBoundary>
    </AppContextProvider>
  );
}

export default App;
