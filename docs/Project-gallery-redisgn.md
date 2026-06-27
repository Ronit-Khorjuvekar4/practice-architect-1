# MASTER PROMPT — `ProjectGallery.tsx` Aesthetic Dark Gallery
> Next.js · TypeScript · Tailwind CSS v4 · `globals.css` design tokens

---

## Context & Goal

Rewrite `src/components/project/ProjectGallery.tsx` from scratch.

The gallery displays all images of a single architecture project (e.g. Control Room & Command Center). Currently images render at their native sizes so rows break unpredictably. The new implementation must:

- Use **mathematically fixed cell dimensions** (hardcoded `w × h`) so every image cell is identical and rows never shift or break regardless of the source image's real pixel dimensions.
- Stretch images to fill every pixel of their cell via `object-cover` — never leave dead space, never show grey letterboxing, never allow blur from under-sizing.
- Match the **premium dark aesthetic** of the Practice Architect design system defined in `globals.css`.
- Support a **lightbox** (fullscreen overlay) when any image is clicked — reuse or integrate with `ProjectLightbox.tsx` if it already exists.

---

## Design Token Reference (`globals.css`)

Use only these CSS custom properties — **never** raw hex values:

| Token | Usage |
|---|---|
| `var(--background)` `#111112` | page/section background |
| `var(--surface)` `#161617` | gallery section bg |
| `var(--surface-strong)` `#1a1a1b` | image cell bg / placeholder |
| `var(--foreground)` `#E8E6E6` | primary text |
| `var(--text-secondary)` | index numbers, captions |
| `var(--muted)` | hover overlays, disabled |
| `var(--border)` `rgba(255,255,255,0.14)` | cell border / gap fill |
| `var(--border-strong)` | active / hover cell border |
| `--font-sans` | all labels |

---

## Fixed Cell Dimensions — The Mathematical Rule

> **This is the single most important constraint.**
> Every image cell must be identical. Nothing is allowed to grow or shrink based on the image's actual pixel size.

### Chosen grid spec

```
CELL_W  = 480px   (explicit, never %, never auto)
CELL_H  = 320px   (explicit, hardcoded, 3:2 ratio — wide architectural shots)
GAP     = 2px     (tight, newspaper-style)
COLS    = 3       (desktop), 2 (tablet ≥768px), 1 (mobile)
```

### Why these numbers
- `480 × 320` is `3:2`. Architecture renders & floor plans are almost always landscape-dominant.
- `480px` fills a `1440px` viewport at 3 cols + 2px gaps with no leftover.
- `320px` is tall enough to show architectural detail without being portrait-heavy.
- The ratio is hardcoded in JSX as `style={{ width: 480, height: 320 }}` on the inner `<div>` wrapper — **never `aspect-ratio`** because that is still responsive to container width and will cause rows to shift when image count is odd.

### CSS rule that must be applied to the `<img>` inside each cell

```css
position: absolute;
inset: 0;
width: 100%;
height: 100%;
object-fit: cover;
object-position: center center;
```

This achieves "stretch to fill without blur or pixelation" because `object-fit: cover` only crops — it scales the image up until the shorter dimension matches the cell, then crops the overflow. The image is **never** scaled below its natural resolution when the cell is smaller than the image (architectural images from this project are high-res JPGs at ≥2000px wide).

---

## Component API

```tsx
// src/components/project/ProjectGallery.tsx

interface ProjectGalleryProps {
  images: string[];       // array of public paths e.g. ["/architecture/CC1 MAIN.jpg", ...]
  projectTitle?: string;  // used in lightbox aria-label
}

export default function ProjectGallery({ images, projectTitle }: ProjectGalleryProps)
```

---

## Component Structure (Top → Bottom)

Build the component in exactly this layered order:

### 1. Section wrapper
```tsx
<section
  aria-label="Project Gallery"
  style={{ backgroundColor: 'var(--surface)' }}
  className="w-full py-16"
>
```
- `py-16` = `64px` vertical breathing room above/below the grid.
- Background uses `--surface` token (slightly lighter than page bg so the section reads as a contained block without needing a border).

---

### 2. Section heading block
```tsx
<div className="px-6 md:px-12 mb-8">
  <p
    style={{ color: 'var(--muted)', fontFamily: 'var(--font-sans)' }}
    className="text-[11px] tracking-[0.15em] uppercase mb-2"
  >
    #01 / MEDIA
  </p>
  <h2
    style={{ color: 'var(--foreground)', fontFamily: 'var(--font-sans)' }}
    className="text-[13px] tracking-[0.12em] uppercase font-normal"
  >
    PROJECT GALLERY
  </h2>
</div>
```
- Exact typographic spec from the wireframe: small monospaced-feeling label above, all-caps heading at 13px.
- Do **not** use `font-bold` or large display sizes. Architecture galleries let the images speak; the heading is an index label.

---

### 3. Grid container
```tsx
<div
  className="px-6 md:px-12"
  style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 480px)',   // HARDCODED, NOT fr or %
    gap: '2px',
    overflowX: 'auto',                          // if viewport < 3×480+gaps, scroll horizontally
  }}
>
```

**Why `repeat(3, 480px)` and NOT `repeat(3, 1fr)`:**
`1fr` makes cells responsive — their height changes when using `aspect-ratio`, which means rows will shift. Hardcoded pixel columns guarantee every cell is always exactly `480 × 320`. On viewports narrower than `~1464px`, the grid scrolls horizontally. On mobile, switch to 1 column (see Responsive section below).

---

### 4. Each image cell

```tsx
{images.map((src, index) => (
  <button
    key={src}
    onClick={() => openLightbox(index)}
    aria-label={`View image ${index + 1} of ${images.length}`}
    style={{
      display: 'block',
      width: 480,
      height: 320,
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: 'var(--surface-strong)',
      border: 'none',
      padding: 0,
      cursor: 'pointer',
      flexShrink: 0,
    }}
  >
    {/* Image — fills cell fully */}
    <Image
      src={src}
      alt={`${projectTitle ?? 'Project'} — image ${index + 1}`}
      fill                      // Next.js fill prop
      sizes="480px"             // tells browser exactly how wide
      style={{
        objectFit: 'cover',
        objectPosition: 'center center',
      }}
      quality={85}
    />

    {/* Index badge — top-right corner */}
    <span
      aria-hidden="true"
      style={{
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'var(--background)',
        color: 'var(--text-secondary)',
        fontFamily: 'var(--font-sans)',
        fontSize: 10,
        letterSpacing: '0.08em',
        lineHeight: 1,
        padding: '3px 5px',
        zIndex: 2,
      }}
    >
      {String(index + 1).padStart(2, '0')}
    </span>

    {/* Hover overlay */}
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0)',
        transition: 'background-color 200ms ease',
        zIndex: 1,
      }}
      className="group-hover:bg-black/30"  /* or use onMouseEnter/Leave state */
    />
  </button>
))}
```

**Critical Next.js `<Image>` requirements:**
- Use `fill` prop (not `width`/`height`) so Next.js scales the image into the parent container.
- The parent `<button>` must be `position: relative` and have explicit `width: 480, height: 320` so `fill` has a containing block to fill.
- `sizes="480px"` tells Next.js image optimizer the maximum render width, preventing over-fetching a 4K image for a 480px slot.
- `quality={85}` is sufficient for architectural renders — lossless is overkill and slows load.

---

### 5. Lightbox state

```tsx
const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

const openLightbox = (index: number) => setLightboxIndex(index);
const closeLightbox = () => setLightboxIndex(null);
const prevImage = () => setLightboxIndex(i => (i !== null && i > 0) ? i - 1 : i);
const nextImage = () => setLightboxIndex(i => (i !== null && i < images.length - 1) ? i + 1 : i);
```

Keyboard handler (attach via `useEffect`):
```tsx
useEffect(() => {
  const handler = (e: KeyboardEvent) => {
    if (lightboxIndex === null) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'ArrowRight') nextImage();
  };
  window.addEventListener('keydown', handler);
  return () => window.removeEventListener('keydown', handler);
}, [lightboxIndex]);
```

If `ProjectLightbox.tsx` already exists and accepts `{ images, currentIndex, onClose, onPrev, onNext }` props — pass state to it rather than re-implementing. If it doesn't exist or is incompatible, build the overlay inline:

```tsx
{lightboxIndex !== null && (
  <div
    role="dialog"
    aria-modal="true"
    aria-label="Image lightbox"
    style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(17,17,18,0.97)',   /* --background at 97% */
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
    }}
    onClick={closeLightbox}
  >
    {/* Prevent click-through on inner content */}
    <div
      style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }}
      onClick={e => e.stopPropagation()}
    >
      <Image
        src={images[lightboxIndex]}
        alt={`${projectTitle ?? 'Project'} — image ${lightboxIndex + 1}`}
        width={1200}
        height={800}
        style={{
          objectFit: 'contain',
          maxWidth: '90vw',
          maxHeight: '90vh',
          width: 'auto',
          height: 'auto',
        }}
        quality={95}
      />
    </div>

    {/* Close button */}
    <button onClick={closeLightbox} aria-label="Close lightbox"
      style={{ position: 'absolute', top: 24, right: 24, color: 'var(--foreground)',
               background: 'none', border: 'none', fontSize: 24, cursor: 'pointer' }}>
      ✕
    </button>

    {/* Prev */}
    {lightboxIndex > 0 && (
      <button onClick={prevImage} aria-label="Previous image"
        style={{ position: 'absolute', left: 24, top: '50%', transform: 'translateY(-50%)',
                 color: 'var(--foreground)', background: 'none', border: 'none',
                 fontSize: 32, cursor: 'pointer' }}>
        ←
      </button>
    )}

    {/* Next */}
    {lightboxIndex < images.length - 1 && (
      <button onClick={nextImage} aria-label="Next image"
        style={{ position: 'absolute', right: 24, top: '50%', transform: 'translateY(-50%)',
                 color: 'var(--foreground)', background: 'none', border: 'none',
                 fontSize: 32, cursor: 'pointer' }}>
        →
      </button>
    )}

    {/* Counter */}
    <p style={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)',
                color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: 11,
                letterSpacing: '0.1em' }}>
      {String(lightboxIndex + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
    </p>
  </div>
)}
```

---

## Responsive Behaviour

Handle breakpoints **outside** the main grid via a `<style jsx>` tag or a wrapping class — do NOT make the cell widths responsive (that defeats the hardcoded dimension requirement):

```tsx
{/* Inject breakpoint rule once at component level */}
<style>{`
  .gallery-grid {
    grid-template-columns: repeat(3, 480px);
    gap: 2px;
  }
  @media (max-width: 1023px) {
    .gallery-grid {
      grid-template-columns: repeat(2, 480px);
    }
  }
  @media (max-width: 639px) {
    .gallery-grid {
      grid-template-columns: 480px;
    }
  }
`}</style>
```

The outer container has `overflow-x: auto` so on mobile the single 480px column scrolls cleanly. This is intentional — a 320px-wide mobile phone viewing 480px cells gets a "gallery scroll" which is more premium than squishing images down.

Alternatively (if the codebase uses CSS Modules or Tailwind arbitrary values), use:
```html
<div class="grid gap-[2px] overflow-x-auto
            [grid-template-columns:repeat(1,480px)]
            sm:[grid-template-columns:repeat(2,480px)]
            lg:[grid-template-columns:repeat(3,480px)]">
```

---

## `next.config.ts` — Required for Local Images

The `public/` folder images use `next/image` with `fill`. Ensure `next.config.ts` does NOT restrict local paths:

```ts
// next.config.ts
const nextConfig = {
  images: {
    // No remotePatterns needed for /public/ images
    // But if image paths include spaces (e.g. "CC1  MAIN.jpg"), they will work
    // because Next.js serves public/ as static assets
  },
};
```

**Image path note:** Files like `CC1  MAIN.jpg` (double space) and folder names with spaces (`Control Room and Command Center Building at CBD for Navi Mumbai Police`) must be URL-encoded when passed as `src` to `<Image>`:
```tsx
// In projects.ts / media.ts — encode the path
const src = encodeURI('/architecture/Control Room and Command Center Building at CBD for Navi Mumbai Police/CC1  MAIN.jpg');
```
Or better: rename the files to kebab-case in `public/` and update the data source.

---

## What NOT to do

| ❌ Do NOT | ✅ Do instead |
|---|---|
| `width="100%" height="auto"` on `<img>` | `fill` prop + explicit parent dimensions |
| `aspect-ratio: 4/3` on the cell | Hardcode `width: 480; height: 320` |
| `grid-template-columns: repeat(3, 1fr)` | `repeat(3, 480px)` |
| `object-fit: contain` in the grid | `object-fit: cover` (contain leaves letterbox gaps) |
| `<img>` without `sizes` hint | Always pass `sizes="480px"` to `next/image` |
| Any `minHeight` / `maxHeight` on cells | Nothing overrides the hardcoded 320px |
| Wrapping cell in another responsive div | Cell is the atom — its dimensions are final |
| Image index badge using `i+1` as text | `String(i+1).padStart(2,'0')` for `01`–`09` style |

---

## Full File Template

```tsx
'use client';

import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';

interface ProjectGalleryProps {
  images: string[];
  projectTitle?: string;
}

const CELL_W = 480;
const CELL_H = 320;

export default function ProjectGallery({ images, projectTitle }: ProjectGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const prevImage = useCallback(() =>
    setLightboxIndex(i => (i !== null && i > 0 ? i - 1 : i)), []);
  const nextImage = useCallback(() =>
    setLightboxIndex(i => (i !== null && i < images.length - 1 ? i + 1 : i)), [images.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightboxIndex, closeLightbox, prevImage, nextImage]);

  if (!images || images.length === 0) return null;

  return (
    <>
      {/* ── Breakpoint overrides for the hardcoded grid ── */}
      <style>{`
        .pa-gallery-grid {
          display: grid;
          grid-template-columns: repeat(3, ${CELL_W}px);
          gap: 2px;
          overflow-x: auto;
        }
        @media (max-width: 1023px) {
          .pa-gallery-grid { grid-template-columns: repeat(2, ${CELL_W}px); }
        }
        @media (max-width: 639px) {
          .pa-gallery-grid { grid-template-columns: ${CELL_W}px; }
        }
      `}</style>

      <section
        aria-label="Project Gallery"
        style={{ backgroundColor: 'var(--surface)' }}
        className="w-full py-16"
      >
        {/* Section label */}
        <div className="px-6 md:px-12 mb-8">
          <p style={{ color: 'var(--muted)', fontFamily: 'var(--font-sans)' }}
             className="text-[11px] tracking-[0.15em] uppercase mb-2">
            #01 / MEDIA
          </p>
          <h2 style={{ color: 'var(--foreground)', fontFamily: 'var(--font-sans)' }}
              className="text-[13px] tracking-[0.12em] uppercase font-normal">
            PROJECT GALLERY
          </h2>
        </div>

        {/* Image grid */}
        <div className="px-6 md:px-12">
          <div className="pa-gallery-grid">
            {images.map((src, index) => (
              <button
                key={`${src}-${index}`}
                onClick={() => openLightbox(index)}
                aria-label={`View image ${index + 1} of ${images.length}`}
                style={{
                  display: 'block',
                  width: CELL_W,
                  height: CELL_H,
                  position: 'relative',
                  overflow: 'hidden',
                  backgroundColor: 'var(--surface-strong)',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  flexShrink: 0,
                  outline: 'none',
                }}
              >
                <Image
                  src={src}
                  alt={`${projectTitle ?? 'Project'} — image ${index + 1}`}
                  fill
                  sizes={`${CELL_W}px`}
                  style={{ objectFit: 'cover', objectPosition: 'center center' }}
                  quality={85}
                />
                {/* Index badge */}
                <span
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    zIndex: 2,
                    backgroundColor: 'var(--background)',
                    color: 'var(--text-secondary)',
                    fontFamily: 'var(--font-sans)',
                    fontSize: 10,
                    letterSpacing: '0.08em',
                    lineHeight: 1,
                    padding: '3px 6px',
                  }}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Lightbox ── */}
      {lightboxIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${projectTitle ?? 'Project'} lightbox`}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(17,17,18,0.97)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
          onClick={closeLightbox}
        >
          <div
            style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }}
            onClick={e => e.stopPropagation()}
          >
            <Image
              src={images[lightboxIndex]}
              alt={`${projectTitle ?? 'Project'} — image ${lightboxIndex + 1}`}
              width={1200}
              height={800}
              style={{
                objectFit: 'contain',
                maxWidth: '90vw',
                maxHeight: '90vh',
                width: 'auto',
                height: 'auto',
              }}
              quality={95}
            />
          </div>

          {/* Controls */}
          <button onClick={closeLightbox} aria-label="Close lightbox"
            style={{ position: 'absolute', top: 24, right: 24,
                     color: 'var(--foreground)', background: 'none',
                     border: 'none', fontSize: 20, cursor: 'pointer',
                     letterSpacing: '0.05em' }}>
            ✕
          </button>

          {lightboxIndex > 0 && (
            <button onClick={e => { e.stopPropagation(); prevImage(); }}
              aria-label="Previous image"
              style={{ position: 'absolute', left: 24, top: '50%',
                       transform: 'translateY(-50%)',
                       color: 'var(--foreground)', background: 'none',
                       border: 'none', fontSize: 28, cursor: 'pointer' }}>
              ←
            </button>
          )}

          {lightboxIndex < images.length - 1 && (
            <button onClick={e => { e.stopPropagation(); nextImage(); }}
              aria-label="Next image"
              style={{ position: 'absolute', right: 80, top: '50%',
                       transform: 'translateY(-50%)',
                       color: 'var(--foreground)', background: 'none',
                       border: 'none', fontSize: 28, cursor: 'pointer' }}>
              →
            </button>
          )}

          <p style={{ position: 'absolute', bottom: 24, left: '50%',
                      transform: 'translateX(-50%)',
                      color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)',
                      fontSize: 11, letterSpacing: '0.1em' }}>
            {String(lightboxIndex + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
          </p>
        </div>
      )}
    </>
  );
}
```

---

## How This Component Is Called

In `src/components/project/ProjectDetailLayout.tsx` (or wherever the single project page assembles its sections), pass the project's image array:

```tsx
import ProjectGallery from '@/components/project/ProjectGallery';

// Assuming project.images is string[] of /public paths
<ProjectGallery
  images={project.images}
  projectTitle={project.title}
/>
```

The `project.images` array in `src/lib/projects.ts` should look like:
```ts
images: [
  '/architecture/Control Room and Command Center Building at CBD for Navi Mumbai Police/CC1  MAIN.jpg',
  '/architecture/Control Room and Command Center Building at CBD for Navi Mumbai Police/CC2.jpg',
  // ...
]
```

---

## Summary Checklist

- [ ] Cell is always `480 × 320px` — hardcoded, no exceptions
- [ ] `<Image fill />` with `sizes="480px"` inside a `position:relative` container of `width:480 height:320`
- [ ] `objectFit: 'cover'` on every grid image — never `contain`
- [ ] `objectFit: 'contain'` in the lightbox — show full image without crop
- [ ] Grid uses `repeat(3, 480px)` — never `1fr`
- [ ] Outer grid container has `overflow-x: auto` for narrow viewports
- [ ] Index badge `01`–`09`+ using `padStart(2,'0')`
- [ ] Keyboard navigation: Escape, ←, → in lightbox
- [ ] All colours from CSS custom properties — zero hardcoded hex
- [ ] Section heading: 11px muted label + 13px uppercase `PROJECT GALLERY`
- [ ] `'use client'` directive at top (state + event listeners)
- [ ] Empty image array renders nothing (`if (!images || images.length === 0) return null`)