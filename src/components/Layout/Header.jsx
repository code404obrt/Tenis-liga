import { useState } from "react";
import { Menu, Trophy, LogOut, User } from "lucide-react";
import { useUiStore } from "../../store/uiStore";
import { useAuthStore } from "../../store/authStore";
import { signOut } from "../../hooks/useAuth";

export default function Header() {
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);
  const player = useAuthStore((s) => s.player);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        {/* Hamburger */}
        <button
          aria-label="Open menu"
          className="p-2 -ml-2 text-foreground hover:text-primary transition-colors"
          onClick={toggleSidebar}
        >
          <Menu size={22} />
        </button>

        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Trophy className="w-4 h-4 text-primary" />
          </div>
          <span className="text-xl font-display text-gradient">Tennis League</span>
        </div>

        {/* User menu */}
        <div className="relative">
          <button
            aria-label="User menu"
            className="p-2 -mr-2 text-foreground hover:text-primary transition-colors"
            onClick={() => setMenuOpen((o) => !o)}
          >
            <User size={22} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-card border border-border rounded-xl shadow-card py-1 z-50">
              {player && (
                <p className="px-3 py-2 text-xs text-muted-foreground truncate border-b border-border">
                  {player.name}
                </p>
              )}
              <button
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                onClick={() => { setMenuOpen(false); signOut(); }}
              >
                <LogOut size={16} /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
