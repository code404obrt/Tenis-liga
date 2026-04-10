import Header from "./Header";
import Sidebar from "./Sidebar";

// Shared chrome wrapper — renders the top bar and slide-out drawer
// around the current page outlet.
export default function Navigation({ children }) {
  return (
    <div className="min-h-screen bg-tennis-bg">
      <Header />
      <Sidebar />
      <main className="max-w-xl mx-auto px-4 py-4">{children}</main>
    </div>
  );
}
