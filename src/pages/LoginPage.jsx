import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Trophy } from "lucide-react";
import { signIn } from "../hooks/useAuth";
import { useAuthStore } from "../store/authStore";
import Button from "../components/Common/Button";

export default function LoginPage() {
  const { user, loading } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  if (!loading && user) return <Navigate to="/" replace />;

  async function onSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const { error } = await signIn(email, password);
    if (error) setError(error.message);
    setSubmitting(false);
  }

  return (
    <div className="min-h-screen bg-background grid place-items-center p-4">
      <div className="w-full max-w-sm space-y-6 animate-slide-up">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shadow-glow">
            <Trophy className="w-7 h-7 text-primary" />
          </div>
          <h1 className="font-display text-4xl text-gradient">Tennis League</h1>
        </div>

        {/* Form card */}
        <form
          onSubmit={onSubmit}
          className="bg-card border border-border rounded-xl p-6 shadow-card space-y-3"
        >
          <h2 className="font-display text-2xl">Sign In</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-secondary text-foreground placeholder:text-muted-foreground"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-secondary text-foreground placeholder:text-muted-foreground"
            required
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" size="lg" disabled={submitting}>
            {submitting ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  );
}
