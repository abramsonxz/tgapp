"use client";

import { useMemo } from "react";

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        ready: () => void;
        expand: () => void;
        close: () => void;
        MainButton: {
          text: string;
          show: () => void;
          hide: () => void;
          onClick: (fn: () => void) => void;
        };
        BackButton: {
          show: () => void;
          hide: () => void;
          onClick: (fn: () => void) => void;
        };
        colorScheme: "light" | "dark";
        themeParams: Record<string, string>;
        initDataUnsafe?: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
          };
        };
      };
    };
  }
}

function getTelegramId(): string {
  if (typeof window === "undefined") return "demo_user";
  const tg = window.Telegram?.WebApp;
  if (tg) {
    tg.ready();
    tg.expand();
    tg.MainButton.hide();
    const user = tg.initDataUnsafe?.user;
    if (user) return String(user.id);
  }
  return "demo_user";
}

export function useTelegram() {
  const telegramId = useMemo(() => getTelegramId(), []);

  return { telegramId, isReady: true };
}
