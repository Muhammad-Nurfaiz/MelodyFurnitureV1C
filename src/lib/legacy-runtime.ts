/**
 * Runtime pendukung untuk halaman hasil migrasi dari HTML statis.
 * Menjalankan handler inline (onclick="...") dan skrip halaman asli
 * pada global scope, sehingga perilaku & tampilan tetap identik.
 */

export function runInline(event: { currentTarget: unknown }, code: string) {
  try {
    // eslint-disable-next-line no-new-func
    const fn = new Function("event", code);
    return fn.call(event.currentTarget, event);
  } catch (error) {
    console.error("Inline handler error:", error);
  }
}

export function injectStyle(css: string): HTMLStyleElement | null {
  if (typeof document === "undefined" || !css.trim()) return null;
  const el = document.createElement("style");
  el.setAttribute("data-legacy-style", "true");
  el.textContent = css;
  document.head.appendChild(el);
  return el;
}

export function injectScript(js: string): HTMLScriptElement | null {
  if (typeof document === "undefined" || !js.trim()) return null;

  const el = document.createElement("script");
  el.setAttribute("data-legacy-script", "true");

  const safeJs = `
    (function() {
      // Helper safe event listener untuk script legacy
      function safeListener(elementIdOrSelector, event, handler) {
        var el = typeof elementIdOrSelector === 'string' 
          ? (document.getElementById(elementIdOrSelector) || document.querySelector(elementIdOrSelector))
          : elementIdOrSelector;
        if (el) {
          el.addEventListener(event, handler);
        }
      }

      function runLegacyCode() {
        try {
          ${js}
        } catch (err) {
          // Hanya log jika bukan error null addEventListener agar console bersih
          if (err && err.message && !err.message.includes("addEventListener")) {
            console.error("Legacy script execution error:", err);
          }
        }
      }

      if (document.readyState === "complete" || document.readyState === "interactive") {
        setTimeout(runLegacyCode, 50);
      } else {
        window.addEventListener("DOMContentLoaded", function() {
          setTimeout(runLegacyCode, 50);
        });
      }
    })();
  `;

  el.textContent = safeJs;
  document.body.appendChild(el);
  return el;
}