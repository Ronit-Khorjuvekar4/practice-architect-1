"use client";

import { useEffect } from "react";

function isMediaElement(element: Element) {
  return (
    element instanceof HTMLImageElement || element instanceof HTMLVideoElement
  );
}

/**
 * Detects media at the pointer location as well as the direct event target.
 * The point check covers images that sit beneath decorative card overlays.
 */
function eventTargetsMedia(event: MouseEvent | DragEvent) {
  if (event.target instanceof Element && isMediaElement(event.target)) {
    return true;
  }

  return document
    .elementsFromPoint(event.clientX, event.clientY)
    .some(isMediaElement);
}

/** Discourages casual saving and dragging of first-party images and videos. */
export function MediaProtection() {
  useEffect(() => {
    const preventMediaContextMenu = (event: MouseEvent) => {
      if (eventTargetsMedia(event)) {
        event.preventDefault();
      }
    };

    const preventMediaDrag = (event: DragEvent) => {
      if (eventTargetsMedia(event)) {
        event.preventDefault();
      }
    };

    document.addEventListener("contextmenu", preventMediaContextMenu, true);
    document.addEventListener("dragstart", preventMediaDrag, true);

    return () => {
      document.removeEventListener("contextmenu", preventMediaContextMenu, true);
      document.removeEventListener("dragstart", preventMediaDrag, true);
    };
  }, []);

  return null;
}
