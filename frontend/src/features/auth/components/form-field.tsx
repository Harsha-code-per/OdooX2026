import type React from "react";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { FormError } from "./form-error";

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const inputId = id ?? props.name;

    return (
      <div className="space-y-1.5 text-left w-full">
        <label
          htmlFor={inputId}
          className="text-xs font-semibold text-foreground/80"
        >
          {label}
        </label>
        <input
          id={inputId}
          ref={ref}
          className={cn(
            "flex w-full h-10 rounded-lg border border-input bg-background/50 px-3 py-2 text-sm shadow-2xs",
            "placeholder:text-muted-foreground/60 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-ring",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error &&
              "border-destructive focus-visible:ring-destructive focus-visible:border-destructive",
            className,
          )}
          {...props}
        />
        <FormError message={error} />
      </div>
    );
  },
);

FormField.displayName = "FormField";
