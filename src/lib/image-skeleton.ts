/**
 * Skeleton loader global untuk seluruh gambar konten.
 * Setiap <img> mendapat efek shimmer sampai gambarnya benar-benar termuat,
 * lalu di-fade-in. Gambar baru (hasil render script legacy) ikut terpantau
 * lewat MutationObserver.
 */

const LOADING = "melody-img-loading";
const READY = "melody-img-ready";
const MARK = "data-melody-skel";

function settle(img: HTMLImageElement) {
  img.classList.remove(LOADING);
  img.classList.add(READY);
}

function track(img: HTMLImageElement) {
  if (img.hasAttribute(MARK)) return;
  img.setAttribute(MARK, "1");

  if (img.complete && img.naturalWidth > 0) {
    img.classList.add(READY);
    return;
  }

  img.classList.add(LOADING);
  img.addEventListener("load", () => settle(img), { once: true });
  img.addEventListener("error", () => settle(img), { once: true });
}

export function initImageSkeletons(): () => void {
  if (typeof document === "undefined") return () => {};

  const scan = (root: ParentNode) => {
    root.querySelectorAll<HTMLImageElement>("img").forEach(track);
  };

  scan(document);

  const observer = new MutationObserver((records) => {
    for (const record of records) {
      record.addedNodes.forEach((node) => {
        if (!(node instanceof HTMLElement)) return;
        if (node.tagName === "IMG") track(node as HTMLImageElement);
        else scan(node);
      });
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
  return () => observer.disconnect();
}
