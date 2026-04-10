import AdminPanel from "../components/Admin/AdminPanel";
import { useUser } from "../hooks/useUser";
import { Navigate } from "react-router-dom";

export default function AdminPage() {
  const { isAdmin, loading } = useUser();
  if (loading) return null;
  if (!isAdmin) return <Navigate to="/" replace />;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-tennis-dark">Admin</h2>
      <AdminPanel />
    </div>
  );
}
