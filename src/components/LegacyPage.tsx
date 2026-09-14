'use client';

import { useEffect, type CSSProperties, type ReactNode } from "react";
import { injectScript, injectStyle } from "@/lib/legacy-runtime";
import { applyTailwindTheme } from "@/lib/tailwind-themes";
import { initImageSkeletons } from "@/lib/image-skeleton";

type Props = {
  theme: "shop" | "admin";
  css: string;
  js: string;
  bodyClassName?: string;
  bodyStyle?: CSSProperties;
  dataAttrs?: Record<string, string>;
  children: ReactNode;
};

export function LegacyPage({
  theme,
  css,
  js,
  bodyClassName = "",
  bodyStyle,
  dataAttrs,
  children,
}: Props) {
  // Hanya jalankan di browser
  if (typeof window !== "undefined") applyTailwindTheme(theme);

  useEffect(() => {
    applyTailwindTheme(theme);
    const body = document.body;
    const html = document.documentElement;
    const prevBodyClass = body.className;
    const prevHtmlClass = html.className;

    body.className = `${bodyClassName} melody-${theme}`.trim();
    html.className = theme === "admin" ? "light" : "";
    if (bodyStyle) Object.assign(body.style, bodyStyle);
    if (dataAttrs) {
      for (const [key, value] of Object.entries(dataAttrs)) body.setAttribute(key, value);
    }

    // Injeksi CSS dan JS Legacy
    const styleEl = injectStyle(css);
    const scriptEl = injectScript(js);
    
    let stopSkeletons: (() => void) | undefined;
    const skelTimer = window.setTimeout(() => {
      stopSkeletons = initImageSkeletons();
    }, 600);

    return () => {
      window.clearTimeout(skelTimer);
      stopSkeletons?.();
      body.className = prevBodyClass;
      html.className = prevHtmlClass;
      if (dataAttrs) {
        for (const key of Object.keys(dataAttrs)) body.removeAttribute(key);
      }
      styleEl?.remove();
      scriptEl?.remove();
    };
  }, [css, js, theme, bodyClassName, bodyStyle, dataAttrs]); // <-- Tambahkan dependency array di sini

  return <>{children}</>;
}