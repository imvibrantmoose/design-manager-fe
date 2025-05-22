import { Suspense } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/home";
import routes from "tempo-routes";
import TemplateDetail from "./features/templates/pages/TemplateDetail"; 
import Profile from "./components/Profile";
import AdminRoutes from "./components/AdminRoutes";
import { ThemeProvider } from "./components/theme-provider";
import { TemplateListPage } from "./features/templates/pages/TemplateListPage";
import { Layout } from "./components/layout/Layout";

function App() {
  return (
    <ThemeProvider defaultTheme="system" attribute="class">
      <Suspense fallback={<p>Loading...</p>}>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/templates" element={<TemplateListPage userRole="admin" userId="current-user-id" />} />
            <Route
              path="/templates/new"
              element={<TemplateDetail isNew={true} userRole="read-write" />}
            />
            <Route
              path="/templates/:id"
              element={<TemplateDetail userRole="read" />}
            />
            <Route
              path="/templates/:id/edit"
              element={<TemplateDetail userRole="read-write" />}
            />
            <Route path="/admin/*" element={<AdminRoutes />} />
          </Routes>
          {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
        </Layout>
      </Suspense>
    </ThemeProvider>
  );
}

export default App;
