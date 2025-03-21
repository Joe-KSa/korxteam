import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProjectPage from "@/pages/project";
import Layout from "./Layout";
import PrivateRoute from "./routing/PrivateRoute";
import "./App.css";
import "./styles/general.scss";
import ProfilePage from "./pages/profile";
import ModerationMembersPage from "./pages/admin/ModerationMembers";
import ModerationProjectsPage from "./pages/admin/ModerationProjects";
import Dashboard from "@/pages/dashboard";
import ModeratorRoute from "./routing/ModeratorRoute";
import NewProjectPage from "./pages/newProject";
import NotificationPage from "./pages/notification";
import ModerationCommentsPage from "./pages/admin/ModerationComments";
import ChallengesItemsPage from "./pages/challenge/ChallengesItems";
import NewChallengePage from "./pages/newChallenge";
import ChallengeSolvePage from "./pages/challenge/ChallengeSolve";
import ChallengeSolutions from "./pages/challenge/ChallengeSolutions";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="projects" element={<ProjectPage />} />
          <Route path="project/:id" element={<Dashboard />} />
          <Route path="projects/:username" element={<ProjectPage />} />
          <Route path="challenges" element={<ChallengesItemsPage />} />

          {/* Rutas Protegidas */}
          <Route element={<PrivateRoute />}>
            <Route path="profile" element={<ProfilePage />} />
            <Route path="new-project" element={<NewProjectPage />} />
            <Route
              path="challenge/new/:language"
              element={<NewChallengePage />}
            />
            <Route
              path="challenge/:id/edit/:language/"
              element={<NewChallengePage />}
            />
            "
            <Route
              path="challenge/:id/solution/:language"
              element={<ChallengeSolutions />}
            />
            <Route path="project/:id/edit" element={<NewProjectPage />} />
            <Route
              path="challenge/:id/:language"
              element={<ChallengeSolvePage />}
            />
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
