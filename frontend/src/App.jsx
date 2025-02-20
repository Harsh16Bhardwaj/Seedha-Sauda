import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import Landing from "./pages/Landing.jsx"; // Capitalized Landing (React convention)
import Session from "./pages/Session.jsx";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/session/:sessionId" element={<Session />} />
      </Routes>
    </>
  );
}

export default App;
