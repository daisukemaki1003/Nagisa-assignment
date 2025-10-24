import {type InputHTMLAttributes} from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  isError?: boolean;
  errorMessage?: string;
};

export function Input({
  placeholder,
  isError = false,
  errorMessage,
  className,
  ...rest
}: InputProps) {
  const inputClasses = [
    "w-full",
    "rounded",
    "border",
    "px-3",
    "py-2",
    "text-sm",
    "outline-none",
    "transition-colors",
  ];

  // エラーがあれば赤色にする
  const stateClasses = isError
    ? ["border-red-500", "focus:border-red-500", "focus:ring-1", "focus:ring-red-500"]
    : ["border-gray-300", "focus:border-blue-500", "focus:ring-1", "focus:ring-blue-500"];

  inputClasses.push(...stateClasses);

  // クラス名があれば追加
  if (className) inputClasses.push(className);

  return (
    <div className={"flex flex-col w-full"}>
      <input
        {...rest}
        placeholder={placeholder}
        className={inputClasses.join(" ")}
        aria-invalid={isError}
      />
      {isError && errorMessage ? (
        <span className="mt-1 text-xs text-red-600" role="alert">
          {errorMessage}
        </span>
      ) : null}
    </div>
  );
}
