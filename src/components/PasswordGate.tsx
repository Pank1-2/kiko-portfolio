import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { passwordMatches, unlockCases } from "../gate";

export function PasswordGate({
  onClose,
  onUnlock,
}: {
  onClose: () => void;
  onUnlock: () => void;
}) {
  const titleId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const [value, setValue] = useState("");
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    inputRef.current?.focus();
    const previous = document.activeElement as HTMLElement | null;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCloseRef.current();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = prevOverflow;
      previous?.focus();
    };
  }, []);

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!passwordMatches(value)) {
      setError(true);
      inputRef.current?.focus();
      return;
    }
    unlockCases();
    onUnlock();
  }

  return createPortal(
    <div className="gate" role="presentation" onClick={onClose}>
      <div
        className="gate-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
      >
        <span className="gate-lock" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="22" height="22">
            <rect x="5" y="10" width="14" height="10" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
            <path d="M8 10V7.5a4 4 0 0 1 8 0V10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </span>
        <h2 id={titleId}>This case study is private</h2>
        <p>Enter the password to continue.</p>
        <form onSubmit={submit}>
          <label className="gate-field">
            <span className="sr-only">Password</span>
            <input
              ref={inputRef}
              type={visible ? "text" : "password"}
              value={value}
              placeholder="Password"
              autoComplete="current-password"
              aria-invalid={error || undefined}
              onChange={(event) => {
                setValue(event.target.value);
                if (error) setError(false);
              }}
            />
            <button
              type="button"
              className="gate-eye"
              aria-label={visible ? "Hide password" : "Show password"}
              aria-pressed={visible}
              onClick={() => setVisible((open) => !open)}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                {visible ? (
                  <path
                    d="M3 3l18 18M10.5 10.7A3 3 0 0 0 13.3 13.5M9.9 5.2A10 10 0 0 1 12 5c5.5 0 9.5 4.2 11 7-1 1.8-2.6 3.6-4.6 5M6.1 6.7C4 8 2.6 10 1 12c1.5 2.8 5.5 7 11 7 1.2 0 2.3-.2 3.3-.6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                ) : (
                  <>
                    <path
                      d="M1 12C2.5 9.2 6.5 5 12 5s9.5 4.2 11 7c-1.5 2.8-5.5 7-11 7S2.5 14.8 1 12z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                    />
                    <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1.6" />
                  </>
                )}
              </svg>
            </button>
          </label>
          {error ? <p className="gate-error">That password isn't right.</p> : null}
          <button type="submit" className="btn solid gate-submit">
            Continue
          </button>
        </form>
        <button type="button" className="gate-dismiss" onClick={onClose}>
          Nevermind
        </button>
      </div>
    </div>,
    document.body,
  );
}
