import {type ReactNode} from "react";

type MessageVariant = "error" | "warning" | "info";

type MessageProps = {
  variant?: MessageVariant;
  title?: ReactNode;
  children?: ReactNode;
  className?: string;
};

const variantStyles: Record<MessageVariant, {container: string; title: string}> = {
  error: {
    container: "border-red-300 bg-red-50 text-red-800",
    title: "text-red-900",
  },
  warning: {
    container: "border-amber-300 bg-amber-50 text-amber-800",
    title: "text-amber-900",
  },
  info: {
    container: "border-blue-300 bg-blue-50 text-blue-800",
    title: "text-blue-900",
  },
};

export function Message({
  variant = "info",
  title,
  children,
  className,
}: MessageProps) {
  const mergedClassName = [
    "w-full",
    "rounded-md",
    "border",
    "p-4",
    "text-sm",
    "leading-relaxed",
    variantStyles[variant].container,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={mergedClassName}>
      {title ? (
        <p className={["font-medium", variantStyles[variant].title].join(" ")}>
          {title}
        </p>
      ) : null}
      {children ?
        <div className={title ? "mt-1" : undefined}>{children}</div> : null
      }
    </div>
  );
}
