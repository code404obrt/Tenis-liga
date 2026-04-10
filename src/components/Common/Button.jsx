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
    primary: "bg-tennis-dark text-white hover:bg-tennis-light",
    secondary: "bg-white text-tennis-dark border border-tennis-dark hover:bg-tennis-bg",
    ghost: "bg-transparent text-tennis-dark hover:bg-tennis-bg",
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
