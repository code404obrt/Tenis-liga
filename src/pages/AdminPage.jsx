import { Shield } from "lucide-react";
import AdminPanel from "../components/Admin/AdminPanel";
import { useUser } from "../hooks/useUser";
import { Navigate } from "react-router-dom";

export default function AdminPage() {
  const { isAdmin, loading } = useUser();
  if (loading) return null;
  if (!isAdmin) return <Navigate to="/" replace />;

  return (
    <div className="space-y-4 animate-fade-in">
      <h2 className="font-display text-3xl flex items-center gap-2">
        <Shield className="w-6 h-6 text-primary" />
        Admin
      </h2>
      <AdminPanel />
    </div>
  );
}
