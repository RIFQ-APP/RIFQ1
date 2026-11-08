"use client";

import { useId, useState, type InputHTMLAttributes } from "react";

const INPUT =
  "w-full rounded-xl border border-input bg-background px-4 py-3 text-sm transition-soft focus:outline-none focus:ring-2 focus:ring-ring";

export function TextField({
  label,
  hint,
  error,
  ...props
}: { label: string; hint?: string; error?: string } & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={!!error}
        aria-describedby={error || hint ? `${id}-d` : undefined}
        className={`${INPUT} ${error ? "border-destructive" : ""}`}
        {...props}
      />
      {(error || hint) && (
        <p id={`${id}-d`} className={`mt-1 text-xs ${error ? "text-destructive" : "text-muted-foreground"}`}>
          {error || hint}
        </p>
      )}
    </div>
  );
}

export function PasswordField({
  label,
  error,
  hint,
  ...props
}: { label: string; error?: string; hint?: string } & Omit<InputHTMLAttributes<HTMLInputElement>, "type">) {
  const id = useId();
  const [show, setShow] = useState(false);
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          aria-invalid={!!error}
          aria-describedby={error || hint ? `${id}-d` : undefined}
          className={`${INPUT} pe-16 ${error ? "border-destructive" : ""}`}
          dir="ltr"
          style={{ textAlign: "right" }}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute inset-y-0 start-2 my-auto h-8 rounded-lg px-2 text-xs text-muted-foreground hover:text-primary"
          aria-label={show ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
        >
          {show ? "إخفاء" : "إظهار"}
        </button>
      </div>
      {(error || hint) && (
        <p id={`${id}-d`} className={`mt-1 text-xs ${error ? "text-destructive" : "text-muted-foreground"}`}>
          {error || hint}
        </p>
      )}
    </div>
  );
}

export function SubmitButton({ loading, children }: { loading: boolean; children: React.ReactNode }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="btn-primary flex w-full items-center justify-center gap-2 py-3 text-base disabled:opacity-60"
    >
      {loading && (
        <span
          aria-hidden
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      )}
      {children}
    </button>
  );
}

export function FormError({ message }: { message: string }) {
  return (
    <div aria-live="polite">
      {message && (
        <p role="alert" className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {message}
        </p>
      )}
    </div>
  );
}
