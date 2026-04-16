import clsx from "clsx";

export default function Card({ className, children, dark = false, ...rest }) {
  return (
    <div
      className={clsx(
        "rounded-xl border border-border shadow-card p-4",
        dark ? "bg-gradient-card text-foreground" : "bg-card text-card-foreground",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
