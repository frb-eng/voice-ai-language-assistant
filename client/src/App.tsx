import "./App.css";
import { ErrorBoundary } from "./ErrorBoundary";
import { Suspense } from "react";
import { Home } from "./Home";

async function fetchText() {
  const response = await fetch("/api");
  return await response.text();
}

function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div>Loading...</div>}>
        <Home textPromise={fetchText()} />
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
