import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navigation from "./components/Layout/Navigation";
import Home from "./pages/Home";
import NewMatch from "./pages/NewMatch";
import PlayerProfilePage from "./pages/PlayerProfile";
import LeaderboardPage from "./pages/LeaderboardPage";
import AdminPage from "./pages/AdminPage";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";
import { useAuth } from "./hooks/useAuth";
import { useAuthStore } from "./store/authStore";

// Bootstraps session once for the whole app.
function AuthProvider({ children }) {
  useAuth();
  return children;
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuthStore();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return <Navigation>{children}</Navigation>;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/match/new"
            element={
              <ProtectedRoute>
                <NewMatch />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <PlayerProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/leaderboard"
            element={
              <ProtectedRoute>
                <LeaderboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
