"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface FormInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  helperText?: string;
  errorText?: string;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ id, label, helperText, errorText, className, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    const messageId = `${inputId}-message`;
    const hasError = Boolean(errorText);

    return (
      <div className="flex flex-col gap-[6px]">
        <label
          htmlFor={inputId}
          className="font-display text-[14px] font-medium leading-[20px] text-[var(--color-text)]"
        >
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          aria-invalid={hasError}
          aria-describedby={hasError || helperText ? messageId : undefined}
          className={cn(
            "h-[38px] w-full rounded-[8px] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-[12px] text-[14px] font-normal leading-[20px] text-[var(--color-text)] placeholder-[var(--color-text-subtle)] transition-colors focus:border-[var(--color-accent)] focus:outline-none aria-[invalid=true]:border-[var(--color-danger-border)]",
            className
          )}
          {...props}
        />
        {hasError ? (
          <p
            id={messageId}
            role="alert"
            className="text-[12px] font-normal leading-[16px] text-[var(--color-danger-text)]"
          >
            {errorText}
          </p>
        ) : helperText ? (
          <p
            id={messageId}
            className="text-[12px] font-normal leading-[16px] text-[var(--color-text-subtle)]"
          >
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";
