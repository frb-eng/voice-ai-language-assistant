import "./App.css";
import { ErrorBoundary } from "./ErrorBoundary";
import { Suspense } from "react";
import { Home } from "./Home";
import { AppContextProvider } from "./AppContext";

function App() {
  return (
    <AppContextProvider> 
      <ErrorBoundary>
        <Suspense fallback={<div>Loading...</div>}>
          <Home />
        </Suspense>
      </ErrorBoundary>
    </AppContextProvider>
  );
}

export default App;
