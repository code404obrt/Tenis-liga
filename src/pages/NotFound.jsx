import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-full grid place-items-center p-6 text-center">
      <div>
        <h1 className="font-display text-5xl text-primary">404</h1>
        <p className="text-muted-foreground mt-2">Page not found.</p>
        <Link to="/" className="text-primary hover:text-accent mt-4 inline-block transition-colors">
          Back to home
        </Link>
      </div>
    </div>
  );
}
