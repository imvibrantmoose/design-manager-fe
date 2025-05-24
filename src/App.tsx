import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import { Layout } from "./components/layout/Layout";
import routes from "tempo-routes";

import { HomePage } from "./features/home/pages/HomePage";
import { TemplateListPage } from "./features/templates/pages/TemplateListPage";
import TemplateDetail from "./features/templates/pages/TemplateDetail";
import { UserManagementPage } from "./features/users/pages/UserManagementPage";
import { ProfilePage } from "./features/profile/pages/ProfilePage";

function App() {
  return (
    <ThemeProvider defaultTheme="system" attribute="class">
      <Suspense fallback={<p>Loading...</p>}>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/templates" element={<TemplateListPage />} />
            <Route path="/templates/new" element={<TemplateDetail isNew />} />
            <Route path="/templates/:id" element={<TemplateDetail />} />
            <Route path="/templates/:id/edit" element={<TemplateDetail isEdit />} />
            <Route path="/admin/users" element={<UserManagementPage />} />
          </Routes>
          {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
        </Layout>
      </Suspense>
    </ThemeProvider>
  );
}

export default App;
