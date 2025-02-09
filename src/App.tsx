import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProjectPage from "@/pages/project";
import Layout from "./Layout";
import PrivateRoute from "./routing/PrivateRoute";
import "./App.css";
import ProfilePage from "./pages/profile";
import ModerationPage from "./pages/admin";
import Dashboard from "@/pages/home";
import ModeratorRoute from "./routing/ModeratorRoute";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="project" element={<ProjectPage />} />

          {/* Rutas Protegidas */}
          <Route element={<PrivateRoute />}>
            <Route path="profile" element={<ProfilePage />} />
          </Route>
          <Route element={<ModeratorRoute />}>
            <Route path="moderation" element={<ModerationPage />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
