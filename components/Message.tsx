import { type ReactNode } from "react";

type MessageVariant = "error" | "warning" | "info";

type MessageProps = {
  variant?: MessageVariant;
  children?: ReactNode;
  className?: string;
};

const variantStyles: Record<MessageVariant, { container: string }> = {
  error: {
    container: "border-red-300 bg-red-50 text-red-800",
  },
  warning: {
    container: "border-amber-400 bg-amber-50 text-amber-600",
  },
  info: {
    container: "border-blue-300 bg-blue-50 text-blue-800",
  },
};

export function Message({
  variant = "info",
  children,
  className,
}: MessageProps) {
  const mergedClassName = [
    "w-full",
    "rounded-md",
    "border",
    "px-4",
    "py-2",
    "text-sm",
    "leading-relaxed",
    variantStyles[variant].container,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <div className={mergedClassName}>{children}</div>;
}
