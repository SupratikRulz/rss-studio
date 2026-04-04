import { create } from "zustand";

export type ToastType = "error" | "success" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastState {
  toasts: Toast[];
  addToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
}

let counter = 0;

const useToastStore = create<ToastState>()((set) => ({
  toasts: [],

  addToast: (message, type = "error") => {
    const id = `toast-${++counter}`;
    set((s) => ({ toasts: [...s.toasts, { id, message, type }] }));

    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, 4500);
  },

  removeToast: (id) => {
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
  },
}));

export default useToastStore;
