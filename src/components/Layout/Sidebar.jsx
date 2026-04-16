import { NavLink } from "react-router-dom";
import { X, Home, Trophy, User, Shield } from "lucide-react";
import { useUiStore } from "../../store/uiStore";
import { useUser } from "../../hooks/useUser";
import clsx from "clsx";

const links = [
  { to: "/", label: "Home", icon: Home },
  { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { to: "/profile", label: "My Profile", icon: User },
];

export default function Sidebar() {
  const { sidebarOpen, closeSidebar } = useUiStore();
  const { isAdmin } = useUser();

  if (!sidebarOpen) return null;

  return (
    <div
      className="fixed inset-0 z-40 bg-black/60"
      onClick={closeSidebar}
    >
      <aside
        className="absolute left-0 top-0 h-full w-72 bg-card border-r border-border shadow-card p-4 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
              <Trophy className="w-4 h-4 text-primary" />
            </div>
            <span className="font-display text-lg text-gradient">Menu</span>
          </div>
          <button
            aria-label="Close menu"
            className="p-1 text-muted-foreground hover:text-foreground transition-colors"
            onClick={closeSidebar}
          >
            <X size={22} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex flex-col gap-1">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              onClick={closeSidebar}
              className={({ isActive }) =>
                clsx(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
          {isAdmin && (
            <NavLink
              to="/admin"
              onClick={closeSidebar}
              className={({ isActive }) =>
                clsx(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )
              }
            >
              <Shield size={18} />
              Admin
            </NavLink>
          )}
        </nav>
      </aside>
    </div>
  );
}
