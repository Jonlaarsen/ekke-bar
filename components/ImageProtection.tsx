"use client";

import { useEffect } from "react";

const PROTECTED_SELECTOR = "img, canvas, picture, video";

function isProtectedTarget(target: EventTarget | null) {
  return (
    target instanceof Element && target.closest(PROTECTED_SELECTOR) !== null
  );
}

export default function ImageProtection() {
  useEffect(() => {
    const onContextMenu = (e: MouseEvent) => {
      if (isProtectedTarget(e.target)) e.preventDefault();
    };

    const onDragStart = (e: DragEvent) => {
      if (isProtectedTarget(e.target)) e.preventDefault();
    };

    document.addEventListener("contextmenu", onContextMenu);
    document.addEventListener("dragstart", onDragStart);

    return () => {
      document.removeEventListener("contextmenu", onContextMenu);
      document.removeEventListener("dragstart", onDragStart);
    };
  }, []);

  return null;
}
