import { Suspense } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/home";
import routes from "tempo-routes";
import TemplateDetail from "./components/TemplateDetail";
import Profile from "./components/Profile";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/templates" element={<Navigate to="/" />} />
          <Route path="/templates/new" element={<TemplateDetail isNew={true} userRole="admin" />} />
          <Route path="/templates/:id" element={<TemplateDetail userRole="admin" />} />
          <Route path="/templates/:id/edit" element={<TemplateDetail userRole="admin" />} />
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense>
  );
}

export default App;
