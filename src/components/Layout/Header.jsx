import { useState } from "react";
import { Menu, User, LogOut } from "lucide-react";
import { useUiStore } from "../../store/uiStore";
import { useAuthStore } from "../../store/authStore";
import { signOut } from "../../hooks/useAuth";

export default function Header() {
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);
  const player = useAuthStore((s) => s.player);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 h-14 bg-white border-b border-gray-200">
      <button
        aria-label="Open menu"
        className="p-2 -ml-2 text-tennis-dark"
        onClick={toggleSidebar}
      >
        <Menu size={22} />
      </button>

      <h1 className="text-base font-semibold text-tennis-dark">Tennis League</h1>

      <div className="relative">
        <button
          aria-label="User menu"
          className="p-2 -mr-2 text-tennis-dark"
          onClick={() => setMenuOpen((o) => !o)}
        >
          <User size={22} />
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-50">
            {player && (
              <p className="px-3 py-2 text-xs text-gray-500 truncate border-b border-gray-100">
                {player.name}
              </p>
            )}
            <button
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
              onClick={() => { setMenuOpen(false); signOut(); }}
            >
              <LogOut size={16} /> Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
