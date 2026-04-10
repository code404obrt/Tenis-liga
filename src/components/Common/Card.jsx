import clsx from "clsx";

export default function Card({ className, children, dark = false, ...rest }) {
  return (
    <div
      className={clsx(
        "rounded-2xl p-4 shadow-sm",
        dark ? "bg-tennis-dark text-white" : "bg-white text-gray-900",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
