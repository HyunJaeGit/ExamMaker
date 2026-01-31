import { useState } from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import type { AppData } from "./types/appData";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import BankPage from "./pages/BankPage";
import ExamSetupPage from "./pages/ExamSetupPage";
import ExamTakePage from "./pages/ExamTakePage";
import ResultPage from "./pages/ResultPage";
import WrongNotePage from "./pages/WrongNotePage";
import GuidePage from "./pages/GuidePage";
import SamplesPage from "./pages/SamplesPage";

function emptyApp(): AppData {
  return {
    schemaVersion: 2,
    questions: [],
    blueprints: [],
    attempts: [],
    results: [],
  };
}

export default function App() {
  const [app, setApp] = useState<AppData>(() => emptyApp());

  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage app={app} setApp={setApp} />} />

          <Route path="/bank" element={<BankPage app={app} setApp={setApp} />} />

          <Route path="/exam/setup" element={<ExamSetupPage app={app} setApp={setApp} />} />
          <Route path="/exam/take/:attemptId" element={<ExamTakePage app={app} setApp={setApp} />} />

          <Route path="/result/:attemptId" element={<ResultPage app={app} />} />

          <Route path="/wrong-note" element={<WrongNotePage app={app} setApp={setApp} />} />

          <Route path="/guide" element={<GuidePage />} />

          <Route path="/samples" element={<SamplesPage setApp={setApp} />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
