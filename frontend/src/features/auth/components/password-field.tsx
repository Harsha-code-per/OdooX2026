"use client";

import { Eye, EyeOff } from "lucide-react";
import type React from "react";
import { forwardRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  getPasswordStrength,
  getPasswordStrengthLabel,
} from "@/lib/validators";
import { FormError } from "./form-error";

interface PasswordFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  showStrength?: boolean;
  value?: string;
}

export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  (
    { label, error, showStrength = false, value, className, id, ...props },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = id ?? props.name;

    const strengthScore =
      showStrength && value ? getPasswordStrength(value) : 0;
    const strengthLabel =
      showStrength && value ? getPasswordStrengthLabel(strengthScore) : "";

    function toggleShowPassword() {
      setShowPassword((prev) => !prev);
    }

    return (
      <div className="space-y-1.5 text-left w-full">
        <div className="flex items-center justify-between">
          <label
            htmlFor={inputId}
            className="text-xs font-semibold text-foreground/80"
          >
            {label}
          </label>
        </div>

        <div className="relative">
          <input
            id={inputId}
            ref={ref}
            type={showPassword ? "text" : "password"}
            className={cn(
              "flex w-full h-10 rounded-lg border border-input bg-background/50 pl-3 pr-10 py-2 text-sm shadow-2xs",
              "placeholder:text-muted-foreground/60 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-ring",
              "disabled:cursor-not-allowed disabled:opacity-50",
              error &&
                "border-destructive focus-visible:ring-destructive focus-visible:border-destructive",
              className,
            )}
            value={value}
            {...props}
          />
          <button
            type="button"
            onClick={toggleShowPassword}
            className="absolute right-3 top-2.5 text-muted-foreground/70 hover:text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-ring rounded"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>

        {/* Password Strength Indicator */}
        {showStrength && value && value.length > 0 && (
          <div className="space-y-1.5 pt-1 animate-fade-in">
            <div className="flex items-center justify-between text-[10px] font-semibold">
              <span className="text-muted-foreground">Password Strength:</span>
              <span
                className={cn(
                  strengthScore <= 1 && "text-destructive",
                  strengthScore === 2 && "text-warning",
                  strengthScore === 3 && "text-info",
                  strengthScore >= 4 && "text-success",
                )}
              >
                {strengthLabel}
              </span>
            </div>
            {/* Strength segmented progress bars */}
            <div className="flex gap-1.5 h-1">
              {[0, 1, 2, 3].map((index) => (
                <div
                  key={index}
                  className={cn(
                    "flex-1 rounded-full transition-all duration-300",
                    index < strengthScore
                      ? cn(
                          strengthScore <= 1 && "bg-destructive",
                          strengthScore === 2 && "bg-warning",
                          strengthScore === 3 && "bg-info",
                          strengthScore >= 4 && "bg-success",
                        )
                      : "bg-muted",
                  )}
                />
              ))}
            </div>
          </div>
        )}

        <FormError message={error} />
      </div>
    );
  },
);

PasswordField.displayName = "PasswordField";
