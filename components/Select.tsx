import {type SelectHTMLAttributes} from "react";

type CustomSelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  isError?: boolean;
  errorMessage?: string;
};

export function CustomSelect({
  className,
  isError = false,
  errorMessage,
  children,
  ...rest
}: CustomSelectProps) {
  const baseClasses = [
    "w-full",
    "bg-white",
    "border",
    "rounded",
    "px-2",
    "py-2",
    "text-sm",
    "outline-none",
    "transition-colors",
  ];

  const stateClasses = isError
    ? ["border-red-500", "focus:border-red-500", "focus:ring-1", "focus:ring-red-500"]
    : ["border-gray-300", "focus:border-blue-500", "focus:ring-1", "focus:ring-blue-500"];

  const selectClasses = [...baseClasses, ...stateClasses];
  if (className) selectClasses.push(className);

  return (
    <div className="flex w-full flex-col">
      <select {...rest} className={selectClasses.join(" ")} aria-invalid={isError}>
        {children}
      </select>
      {isError && errorMessage ? (
        <span className="mt-1 text-xs text-red-600" role="alert">
          {errorMessage}
        </span>
      ) : null}
    </div>
  );
}
