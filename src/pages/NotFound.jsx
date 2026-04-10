import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-full grid place-items-center p-6 text-center">
      <div>
        <h1 className="text-3xl font-semibold text-tennis-dark">404</h1>
        <p className="text-gray-500 mt-2">Page not found.</p>
        <Link to="/" className="text-tennis-light mt-4 inline-block">
          Back to home
        </Link>
      </div>
    </div>
  );
}
