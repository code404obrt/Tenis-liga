import clsx from "clsx";

export default function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}) {
  const base =
    "inline-flex items-center justify-center font-medium rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-primary text-primary-foreground hover:bg-accent shadow-glow",
    secondary: "bg-secondary text-secondary-foreground border border-border hover:bg-muted",
    ghost: "bg-transparent text-foreground hover:bg-secondary",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  };
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2.5 text-base",
    lg: "px-5 py-3 text-lg w-full",
  };
  return (
    <button
      className={clsx(base, variants[variant], sizes[size], className)}
      {...rest}
    >
      {children}
    </button>
  );
}
