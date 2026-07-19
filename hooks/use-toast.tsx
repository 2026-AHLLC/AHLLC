"use client";

import * as React from "react";

import type {
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast";

const TOAST_LIMIT = 5;
const TOAST_REMOVE_DELAY = 1000;

type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

type State = {
  toasts: ToasterToast[];
};

const listeners: Array<(state: State) => void> = [];

let memoryState: State = {
  toasts: [],
};

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

function dispatch(state: State) {
  memoryState = state;
  listeners.forEach((listener) => listener(memoryState));
}

export function toast(toast: Omit<ToasterToast, "id">) {
  const id = genId();

  const newToast: ToasterToast = {
    ...toast,
    id,
    open: true,
  };

  dispatch({
    toasts: [newToast, ...memoryState.toasts].slice(
      0,
      TOAST_LIMIT
    ),
  });

  setTimeout(() => {
    dispatch({
      toasts: memoryState.toasts.filter(
        (t) => t.id !== id
      ),
    });
  }, TOAST_REMOVE_DELAY);

  return id;
}

export function useToast() {
  const [state, setState] =
    React.useState(memoryState);

  React.useEffect(() => {
    listeners.push(setState);

    return () => {
      const index =
        listeners.indexOf(setState);

      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, []);

  return {
    ...state,
    toast,
  };
}