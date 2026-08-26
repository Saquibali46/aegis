import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import IncidentDetails from "./pages/IncidentDetails.jsx";
import Services from "./pages/Services.jsx";
import Incidents from "./pages/Incidents.jsx";
import Metrics from "./pages/Metrics.jsx";
import AIInsights from "./pages/AIInsights.jsx";

import App from "./App.jsx";
import Dashboard from "./pages/Dashboard.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/incidents/:id" element={<IncidentDetails />} />
        <Route path="/services" element={<Services />} />
        <Route path="/incidents" element={<Incidents />} />
        <Route path="/metrics" element={<Metrics />} />
        <Route path="/ai" element={<AIInsights />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);