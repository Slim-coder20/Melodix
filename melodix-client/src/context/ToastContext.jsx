import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, opts = {}) => {
    const id = Math.random().toString(36).slice(2);
    const toast = {
      id,
      message,
      type: opts.type || "info", // info | success | error
      duration: opts.duration ?? 2500,
    };
    setToasts((prev) => [...prev, toast]);
    // auto-hide
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, toast.duration);
  }, []);

  const hideToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const value = useMemo(() => ({ toasts, showToast, hideToast }), [toasts, showToast, hideToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}

export function Toasts() {
  const { toasts, hideToast } = useToast();
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 w-[92%] max-w-sm">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={[
            "rounded shadow px-4 py-3 text-white flex items-center justify-between",
            t.type === "success" ? "bg-green-600" : t.type === "error" ? "bg-red-600" : "bg-gray-800",
          ].join(" ")}
        >
          <span className="text-sm">{t.message}</span>
          <button onClick={() => hideToast(t.id)} className="ml-3 text-xs opacity-80 hover:opacity-100">Fermer</button>
        </div>
      ))}
    </div>
  );
}
