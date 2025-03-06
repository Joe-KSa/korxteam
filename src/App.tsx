import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProjectPage from "@/pages/project";
import Layout from "./Layout";
import PrivateRoute from "./routing/PrivateRoute";
import "./App.css";
import ProfilePage from "./pages/profile";
import ModerationMembersPage from "./pages/admin/ModerationMembers";
import ModerationProjectsPage from "./pages/admin/ModerationProjects";
import Dashboard from "@/pages/dashboard";
import ModeratorRoute from "./routing/ModeratorRoute";
import NewProjectPage from "./pages/newProject";
import NotificationPage from "./pages/notification";
import ModerationCommentsPage from "./pages/admin/ModerationComments";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="projects" element={<ProjectPage />} />
          <Route path="project/:id" element={<Dashboard />} />
          <Route path="projects/:username" element={<ProjectPage />} />

          {/* Rutas Protegidas */}
          <Route element={<PrivateRoute />}>
            <Route path="profile" element={<ProfilePage />} />
            <Route path="new-project" element={<NewProjectPage />} />
            <Route path="project/:id/edit" element={<NewProjectPage />} />
            
            <Route path="notification" element={<NotificationPage />} />
          </Route>
          <Route path="/moderation" element={<ModeratorRoute />}>
            <Route path="comments" element={<ModerationCommentsPage />} />
            <Route path="members" element={<ModerationMembersPage />} />
            <Route path="projects" element={<ModerationProjectsPage />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
