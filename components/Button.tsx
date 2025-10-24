import type {ButtonHTMLAttributes} from "react";

type CustomButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "black" | "white";
};

const VARIANT_CLASSNAME = {
  black: "bg-black text-white hover:bg-black/80",
  white: "bg-white text-black border border-black hover:bg-black/5",
} as const;

export const CustomButton = ({
  className,
  variant = "black",
  ...rest
}: CustomButtonProps) => {
  const classes = [
    "px-4",
    "py-2",
    "rounded-sm",
    "transition-opacity",
    "cursor-pointer",
    VARIANT_CLASSNAME[variant]
  ];

  return (
    <button
      className={[...classes, className]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    />
  );
};
