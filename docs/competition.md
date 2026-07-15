I want you to design and implement a new **Competition section** on the homepage of my Practice Architect website.

Before making any changes, first inspect the existing codebase carefully and understand:

* the current Next.js project structure
* the homepage layout
* the existing design system
* typography
* spacing
* colors
* breakpoints
* image handling
* component patterns
* animation libraries already installed
* data-fetching patterns already used
* whether the project uses Server Components, Client Components, API routes, CMS data, static data, or another backend source

Do not unnecessarily replace the existing architecture or install duplicate libraries.

The final section must visually match the existing website and feel like a premium architectural portfolio experience.

---

# Competition Section — Core Requirement

The client wants to showcase architecture competitions directly on the homepage.

The competition content will include:

* sketches
* architectural renders
* physical model images
* prototypes
* concept development images
* process images
* drawings

These are not certificates.

Each competition can contain:

* only 1 image
* or multiple images

Currently there are only a few competitions, but this system must be designed to scale properly even if the client later adds:

* 20 competitions
* 100 competitions
* 500+ competitions

I do not want a traditional card grid, masonry layout, long archive section, or repeated “View More” buttons.

The design should use a:

# LEFT-SIDE COMPETITION INDEX + RIGHT-SIDE VISUAL STAGE

---

# Desktop Layout

Create a two-column competition section.

Example structure:

COMPETITIONS

┌──────────────────────────────┬─────────────────────────────────────────────┐
│ LEFT SIDE                    │ RIGHT SIDE                                  │
│                              │                                             │
│ Competition Index            │ Large Selected Competition Visual          │
│                              │                                             │
│ 001 Competition Name         │                                             │
│ 002 Competition Name         │         Large Active Image                  │
│ 003 Competition Name         │                                             │
│ 004 Competition Name         │                                             │
│ 005 Competition Name         │                                             │
│                              │                                             │
│ Scrollable list              │ Competition Name                            │
│                              │  Image Count                │
└──────────────────────────────┴─────────────────────────────────────────────┘

The overall section should have a controlled height.

The section must NOT become taller when hundreds of competitions are added.

The left-side list should scroll independently.

The right-side preview should remain visually stable while users browse the competition list.

---

# Left Side — Competition Index

The left side should display a compact architectural index.

Each row may contain:

* sequential number
* competition title
* optional image count

Example:

001   Urban Housing Competition        
002   Future Commons                    
003   Civic Library                     
004   River Edge                        

The row design should feel editorial and architectural.

Avoid heavy cards.

Prefer:

* clean typography
* horizontal dividers
* subtle hover states
* active state
* strong spacing
* minimal UI
* premium portfolio aesthetic

The currently selected competition must have a clear active state.

The user should be able to select a competition by:

* clicking
* keyboard navigation where practical

Hover can preview a competition on desktop, but selection should remain click-based so the interaction is predictable.

---

# Right Side — Selected Competition Visual Stage

The right side should show the currently selected competition.

It should display:

* large main image
* competition title
* current image position
* total image count

Example:

Urban Housing Competition

03 / 12

If the competition has only one image:

* show the image normally
* do not show unnecessary previous/next controls
* optionally show 01 / 01 only if it fits the design

If the competition contains multiple images:

* allow previous/next navigation
* allow swipe gestures on touch devices
* allow keyboard left/right arrows when appropriate
* show a subtle image counter such as 03 / 12

Do not use a nested carousel inside each competition list item.

Only the currently selected competition should display its images on the right side.

---

# Scalability Requirement

This section must work efficiently even when there are hundreds of competitions.

The implementation should combine:

1. Infinite data loading
2. List virtualization/windowing
3. Lazy-loaded competition galleries
4. Optimized image loading

---

# Infinite Loading

Do not fetch all competitions at once.

Initially load:

25 competitions

When the user scrolls near the bottom of the left-side competition list, automatically fetch the next:

25 competitions

Example:

Initial:
1–25

Near bottom:
fetch 26–50

Then:
fetch 51–75

Continue as needed.

Do not wait until the user reaches the absolute final item.

Prefetch the next batch slightly earlier so scrolling feels continuous.

Prefer cursor-based pagination if supported by the backend.

Example API shape:

GET /competitions?limit=25&cursor=...

The exact API structure should follow the existing project architecture.

---

# Virtualized Competition List

The left-side competition index must use list virtualization/windowing.

This is important.

Even if 500 competitions have already been fetched, React should not render all 500 rows into the DOM.

Only render:

* currently visible rows
* a small overscan buffer above
* a small overscan buffer below

As the user scrolls:

* old off-screen rows should be removed from the rendered DOM
* newly visible rows should be rendered

The scrollbar should still behave naturally as though the entire loaded dataset exists.

Preferred solution:

TanStack Virtual

However:

* first check whether the project already uses another virtualization library
* reuse an existing suitable solution if available
* do not install redundant libraries

---

# Infinite Query / Data Fetching

Preferred solution:

TanStack Query with useInfiniteQuery

Use it for:

* initial competition loading
* fetching the next 25 competitions
* caching loaded pages
* deduplicating requests
* maintaining loading state
* preventing unnecessary refetches

However:

* first inspect the existing application
* if another data-fetching library or architecture is already used consistently, follow the existing architecture instead of unnecessarily introducing TanStack Query

The solution must feel native to the current codebase.

---

# Important Data Loading Rule

The competition list API should return lightweight summary data only.

Example:

{
id,
slug,
title,
location,
coverImage,
thumbnail,
imageCount
}

Do NOT return every full-size image for every competition while loading the competition index.

For example, do not load 25 competitions × 20 full-resolution images.

That would be inefficient.

The full competition gallery should only be loaded when that competition becomes selected.

---

# Selected Competition Gallery Loading

When a competition is selected:

1. display any available lightweight cover image immediately
2. fetch/load the selected competition’s gallery
3. cache the gallery data
4. show the selected image
5. preload nearby gallery images where useful

Example:

Current image:
Image 10

Optionally preload:
Image 9
Image 11

Do not aggressively preload the complete gallery if it contains a large number of high-resolution images.

The gallery should remain smooth even if a competition contains:

* 1 image
* 10 images
* 50 images

---

# Image Optimization

Use the project’s existing image solution.

If the project uses Next.js Image, use it properly.

Requirements:

* responsive image sizes
* correct width/height or aspect-ratio handling
* lazy loading for non-critical images
* proper loading priority only for the initially visible active image
* avoid layout shift
* use optimized thumbnails in the competition index if thumbnails are required
* do not load unnecessarily large source images for small UI areas

Architectural images may have different aspect ratios.

Do not distort images.

Use a consistent visual frame on the right side.

Depending on the existing website design, use either:

* object-fit: contain for showing full architectural drawings/sketches
* object-fit: cover for highly visual renders

Choose the strategy intelligently based on content.

Prefer preserving the artwork rather than aggressively cropping important architectural drawings.

---

# Interaction Behaviour

Desktop:

* left competition list scrolls independently
* selecting a competition updates the right visual stage
* active competition is clearly highlighted
* hover can provide subtle preview feedback
* previous/next controls navigate images within the selected competition
* keyboard navigation should work where reasonable

Mobile:

Do not simply squeeze the desktop two-column layout.

Create a proper responsive version.

Recommended mobile behaviour:

* competition index first
* selected competition visual below or in an expandable viewer
* tapping a competition updates or opens the selected visual
* swipe left/right for multi-image competition galleries
* large touch targets
* no hover-dependent functionality

Consider a sticky or compact selected-project header if appropriate, but only if it improves the existing site.

---

# Accessibility

Implement accessibility properly.

Requirements:

* semantic buttons for interactive controls
* keyboard-accessible competition selection
* visible focus states
* accessible previous/next image controls
* meaningful alt text for architectural images
* do not make every image decorative if it contains meaningful content
* avoid redundant alt text when several images show nearly identical views
* use aria labels where necessary
* respect prefers-reduced-motion

Do not rely only on hover.

---

# Animation

Animations should be subtle and premium.

Possible transitions:

* soft image fade
* slight crossfade between selected competitions
* minimal text movement
* active row transition

Do not use:

* excessive parallax
* heavy 3D effects
* large motion
* distracting carousel animations

The architecture imagery should remain the main focus.

Use existing animation libraries if the project already has them.

Do not add a large animation dependency only for this section unless necessary.

---

# Suggested Data Model

Use or adapt a structure similar to:

type Competition = {
id: string;
slug?: string;
title: string;
category?: string;
coverImage: {
src: string;
alt: string;
};
imageCount: number;
};

type CompetitionDetails = {
id: string;
title: string;
images: Array<{
id: string;
src: string;
alt: string;
width?: number;
height?: number;
}>;
};

Do not blindly use this structure if the existing project already has an established data model.

Adapt it to the existing codebase.

---

# Empty / Loading / Error States

Handle all states properly.

Initial loading:

* use a subtle skeleton matching the final layout

Loading next 25 competitions:

* show a minimal loading indicator inside the list
* do not block the whole section

Loading selected gallery:

* keep the previous visual or cover image visible
* show a subtle loading state
* avoid flashing blank content

Error:

* provide a retry state
* do not break the entire homepage

No competitions:

* gracefully hide or show an appropriate empty state

---

# Performance Requirements

The section should remain performant with a very large dataset.

Avoid:

* rendering hundreds of rows
* loading all competition images on initial page load
* unnecessary global state
* large rerenders when scrolling
* recreating expensive components
* loading full galleries for competitions the user never opens

Use:

* memoization where genuinely helpful
* virtualization
* paginated fetching
* request caching
* image optimization
* lazy loading
* code splitting where appropriate

The gallery/lightbox or heavy interaction code can be dynamically loaded if that improves the current architecture.

---

# Important UX Rule

Treat the competition as the primary content unit.

Do not treat each individual image as a separate homepage item.

The left side represents competitions.

The right side represents the image collection of the currently selected competition.

This is the main concept of the entire design.

---

# Expected Final Experience

The user enters the Competition section.

They see:

* a clean competition index on the left
* a large architectural image on the right

They scroll the competition index.

Only visible rows are rendered.

When they approach the bottom:

* the next 25 competitions load automatically

When they select a competition:

* only that competition’s gallery is loaded
* its images appear in the right-side visual stage

If it has:

1 image:
show the single image

Multiple images:
enable image navigation

The section height remains controlled regardless of whether there are:

3 competitions
100 competitions
500 competitions

---

# Implementation Process

Please follow this order:

1. Inspect the existing project thoroughly.
2. Identify the best files/components where this section should be implemented.
3. Identify existing reusable components and libraries.
4. Explain briefly what you found.
5. Create the competition data architecture.
6. Implement the desktop layout.
7. Implement infinite loading.
8. Implement virtualization.
9. Implement selected competition gallery loading.
10. Implement responsive mobile behaviour.
11. Add accessibility.
12. Optimize performance.
13. Test edge cases.
14. Run lint/typecheck/build and fix issues caused by your implementation.

Do not modify unrelated sections.

Do not redesign the entire homepage.

Keep the implementation modular and production-ready.

At the end, provide:

* files created
* files modified
* libraries added, if any
* data flow explanation
* virtualization explanation
* infinite-loading explanation
* image-loading strategy
* responsive behaviour
* any backend/API requirements still needed
