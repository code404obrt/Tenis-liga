export default function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-md bg-card border border-border rounded-t-2xl sm:rounded-2xl p-5 shadow-card"
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <h2 className="font-display text-2xl mb-3">{title}</h2>
        )}
        {children}
      </div>
    </div>
  );
}
