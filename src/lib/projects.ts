import type { Project } from "@/types/project";

/**
 * Sample project data — at least two projects per category so the listing
 * and detail pages can be built and tested in later phases.
 *
 * Each project carries a `media` array of images and/or videos. Image paths
 * point to the monochrome SVG placeholders in `/public/placeholder` (and a
 * few first-party PNGs); video items would add `type: "video"` with an
 * optional `thumbnail` poster.
 */
export const projects: Project[] = [
  // ---------- Architecture ----------
  {
    title: "House on the Cliff",
    slug: "house-on-the-cliff",
    category: "architecture",
    shortDescription:
      "A timber and concrete residence perched on a granite headland.",
    description:
      "A long, low house that sits lightly against the cliff edge and frames the Atlantic without competing with it. The plan is a single linear bar splayed along the contour, with bedroom wings folded back into the slope and living spaces cantilevered toward the sea. Board-formed concrete holds its cool grey light against warm cedar joinery and brushed oak floors.",
    location: "Cornwall, United Kingdom",
    area: "480 m²",
    dateOfCompletion: "2024",
    status: "Completed",
    media: [
      { type: "image", src: "/Residential.png", alt: "House on the Cliff project image" },
      { type: "image", src: "/Residential.png", alt: "House on the Cliff project image" },
      { type: "image", src: "/Residential.png", alt: "House on the Cliff project image" },
      { type: "image", src: "/Residential.png", alt: "House on the Cliff project image" },
      {
        type: "video",
        src: "/ok.mp4",
        thumbnail: "/Residential.png",
        title: "House on the Cliff project video",
        alt: "House on the Cliff project video thumbnail",
      }
    ],
  },
  {
    title: "The Sequoia Pavilion",
    slug: "the-sequoia-pavilion",
    category: "architecture",
    shortDescription: "A cultural pavilion folded into the lakeland edge.",
    description:
      "A 640 m² cultural pavilion folded into the lakeland edge — timber-clad, slow-lit and quietly civic. The roof steps with the terrain so the building reads as landscape before it reads as architecture, and a continuous clerestory traces daylight across the exhibition spine.",
    location: "Lake District, United Kingdom",
    area: "640 m²",
    dateOfCompletion: "2025",
    status: "In Progress",
    media: [
      { type: "image", src: "/INTERIOR.png", alt: "The Sequoia Pavilion project image" },
      { type: "image", src: "/INTERIOR.png", alt: "The Sequoia Pavilion project image" },
      { type: "image", src: "/INTERIOR.png", alt: "The Sequoia Pavilion project image" },
    ],
  },

  // ---------- Interior ----------
  {
    title: "The Reading Room",
    slug: "the-reading-room",
    category: "interior",
    shortDescription: "A private library interior in oak, plaster and shadow.",
    description:
      "An interior commission that treats a single room as a quiet instrument for light. Full-height oak shelving wraps three walls, lime plaster softens the fourth, and a recessed cornice washes the ceiling so the room reads as atmosphere rather than decoration.",
    location: "Edinburgh, United Kingdom",
    area: "120 m²",
    dateOfCompletion: "2023",
    status: "Completed",
    media: [
      { type: "image", src: "/placeholder/02.svg", alt: "The Reading Room project image" },
      { type: "image", src: "/placeholder/03.svg", alt: "The Reading Room project image" },
      { type: "image", src: "/placeholder/04.svg", alt: "The Reading Room project image" },
    ],
  },
  {
    title: "Quarry House Interior",
    slug: "quarry-house-interior",
    category: "interior",
    shortDescription:
      "A material-led renovation of a former stone merchant's house.",
    description:
      "The interior of a former stone merchant's house, reworked around a tight palette of pale render, blackened steel and reclaimed flagstone. Partitions were removed to return the ground floor to a single connected volume, with joinery detailed to read as furniture rather than fit-out.",
    location: "Bath, United Kingdom",
    area: "210 m²",
    dateOfCompletion: "2025",
    status: "In Progress",
    media: [
      { type: "image", src: "/placeholder/06.svg", alt: "Quarry House Interior project image" },
      { type: "image", src: "/placeholder/05.svg", alt: "Quarry House Interior project image" },
      { type: "image", src: "/placeholder/01.svg", alt: "Quarry House Interior project image" },
    ],
  },

  // ---------- Planning ----------
  {
    title: "Riverside District Masterplan",
    slug: "riverside-district-masterplan",
    category: "planning",
    shortDescription:
      "A neighbourhood-scale framework for a former industrial waterfront.",
    description:
      "A masterplan that knits a disused industrial waterfront back into the city grid. The framework sets block sizes, street hierarchy and public-realm rules while leaving individual plots open to a range of architects, prioritising walkable distances and a continuous river edge.",
    location: "Porto, Portugal",
    area: "18 hectares",
    dateOfCompletion: "2024",
    status: "Completed",
    media: [
      { type: "image", src: "/placeholder/03.svg", alt: "Riverside District Masterplan project image" },
      { type: "image", src: "/placeholder/01.svg", alt: "Riverside District Masterplan project image" },
      { type: "image", src: "/placeholder/05.svg", alt: "Riverside District Masterplan project image" },
    ],
  },
  {
    title: "Old Town Renewal Framework",
    slug: "old-town-renewal-framework",
    category: "planning",
    shortDescription:
      "A feasibility study for the gradual renewal of a historic centre.",
    description:
      "A phased renewal framework for a historic town centre, balancing heritage constraints against the need for new housing and civic space. The study maps every plot by condition and value, then proposes a sequence of small, fundable interventions rather than a single redevelopment.",
    location: "Oslo, Norway",
    area: "26 hectares",
    dateOfCompletion: "2026",
    status: "In Progress",
    media: [
      { type: "image", src: "/placeholder/04.svg", alt: "Old Town Renewal Framework project image" },
      { type: "image", src: "/placeholder/02.svg", alt: "Old Town Renewal Framework project image" },
      { type: "image", src: "/placeholder/06.svg", alt: "Old Town Renewal Framework project image" },
    ],
  },

  // ---------- Landscape ----------
  {
    title: "Headland Garden",
    slug: "headland-garden",
    category: "landscape",
    shortDescription: "A windswept coastal garden read first as terrain.",
    description:
      "A coastal garden designed for a granite headland, where planting is chosen for its response to salt and wind rather than for display. Drystone terraces follow the existing contour, and a single mown path draws visitors from the house to the cliff edge.",
    location: "Cornwall, United Kingdom",
    area: "1.2 hectares",
    dateOfCompletion: "2023",
    status: "Completed",
    media: [
      { type: "image", src: "/placeholder/05.svg", alt: "Headland Garden project image" },
      { type: "image", src: "/placeholder/04.svg", alt: "Headland Garden project image" },
      { type: "image", src: "/placeholder/03.svg", alt: "Headland Garden project image" },
    ],
  },
  {
    title: "Civic Square Landscape",
    slug: "civic-square-landscape",
    category: "landscape",
    shortDescription:
      "A public-realm scheme returning a car park to civic ground.",
    description:
      "A public-realm scheme that converts a central car park back into civic ground. A single continuous stone surface unifies the space, level changes are resolved as generous seating steps, and a grid of semi-mature trees gives the square shade and structure from its first season.",
    location: "Helsinki, Finland",
    area: "0.8 hectares",
    dateOfCompletion: "2025",
    status: "In Progress",
    media: [
      { type: "image", src: "/placeholder/01.svg", alt: "Civic Square Landscape project image" },
      { type: "image", src: "/placeholder/06.svg", alt: "Civic Square Landscape project image" },
      { type: "image", src: "/placeholder/02.svg", alt: "Civic Square Landscape project image" },
    ],
  },
];

/** All projects belonging to a given category slug. */
export function getProjectsByCategory(category: string): Project[] {
  return projects.filter((project) => project.category === category);
}

/** A single project matched by both its category and slug. */
export function getProject(
  category: string,
  slug: string,
): Project | undefined {
  return projects.find(
    (project) => project.category === category && project.slug === slug,
  );
}
