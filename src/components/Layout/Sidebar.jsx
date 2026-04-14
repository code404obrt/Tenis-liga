import { NavLink } from "react-router-dom";
import { X } from "lucide-react";
import { useUiStore } from "../../store/uiStore";
import { useUser } from "../../hooks/useUser";
import clsx from "clsx";

const links = [
  { to: "/", label: "Home" },
  { to: "/leaderboard", label: "Leaderboard" },
  { to: "/profile", label: "My Profile" },
];

export default function Sidebar() {
  const { sidebarOpen, closeSidebar } = useUiStore();
  const { isAdmin } = useUser();

  if (!sidebarOpen) return null;

  return (
    <div
      className="fixed inset-0 z-40 bg-black/50"
      onClick={closeSidebar}
    >
      <aside
        className="absolute left-0 top-0 h-full w-72 bg-white shadow-xl p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <span className="font-semibold text-tennis-dark">Menu</span>
          <button aria-label="Close menu" onClick={closeSidebar}>
            <X size={22} />
          </button>
        </div>
        <nav className="flex flex-col gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              onClick={closeSidebar}
              className={({ isActive }) =>
                clsx(
                  "px-3 py-2 rounded-lg text-sm",
                  isActive
                    ? "bg-tennis-dark text-white"
                    : "text-gray-700 hover:bg-tennis-bg"
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
          {isAdmin && (
            <NavLink
              to="/admin"
              onClick={closeSidebar}
              className={({ isActive }) =>
                clsx(
                  "px-3 py-2 rounded-lg text-sm",
                  isActive
                    ? "bg-tennis-dark text-white"
                    : "text-gray-700 hover:bg-tennis-bg"
                )
              }
            >
              Admin
            </NavLink>
          )}
        </nav>
      </aside>
    </div>
  );
}
