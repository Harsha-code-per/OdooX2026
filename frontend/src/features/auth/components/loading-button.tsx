import { Loader2 } from "lucide-react";
import type React from "react";
import { cn } from "@/lib/utils";

interface LoadingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  children: React.ReactNode;
}

export function LoadingButton({
  isLoading = false,
  className,
  children,
  ...props
}: LoadingButtonProps) {
  return (
    <button
      type="submit"
      disabled={isLoading || props.disabled}
      className={cn(
        "inline-flex w-full h-10 items-center justify-center rounded-lg bg-primary px-4 py-2",
        "text-sm font-medium text-primary-foreground shadow-xs cursor-pointer select-none",
        "hover:bg-primary/90 hover:shadow-md transition-all duration-150",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        "disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 size={16} className="mr-2 animate-spin" aria-hidden="true" />
          <span>Please wait...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
