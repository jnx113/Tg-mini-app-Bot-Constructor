import "./App.css";
import Dashboard from "./components/Dashboard";
import NavPanel from "./components/NavPanel";
import Bots from "./components/Bots";
import { Routes, Route, Navigate } from "react-router-dom";
import BotSettings from "./components/BotSettings";
import ScriptEdit from "./components/ScriptEdit";
import '@xyflow/react/dist/style.css'
import { ReactFlowProvider } from "@xyflow/react";

function App() {
  return (
    <div className="App">
      <NavPanel />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/bots" element={<Bots />} />
        <Route path="/bot-settings/:id" element={<BotSettings />}/>
        <Route path="script-edit" element={<ReactFlowProvider><ScriptEdit /></ReactFlowProvider>}/>
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </div>
  );
}

export default App;
