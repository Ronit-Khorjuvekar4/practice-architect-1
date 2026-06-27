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
    title: "Alibuag Police HQ",
    slug: "alibuag-police-HQ",
    category: "architecture",
    location: "Cornwall, United Kingdom",
    area: "480 m²",
    dateOfCompletion: "2024",
    // status: "Completed",
    media: [
      { type: "image", src: "/architecture/alibuag_police_hq/FFLR.jpg", alt: "House on the Cliff project image" },
      { type: "image", src: "/architecture/alibuag_police_hq/GFLR MAIN.jpg", alt: "House on the Cliff project image" },
    ],
  },
  {
    title: "Control Room and Command Center Building at CBD for Navi Mumbai Police",
    slug: "control-room-and-command-center-building-at-CBD-for-navi-mumbai-police",
    category: "architecture",
    location: "Lake District, United Kingdom",
    area: "640 m²",
    dateOfCompletion: "2025",
    // status: "In Progress",
    media: [
      { type: "image", src: "/architecture/Control Room and Command Center Building at CBD for Navi Mumbai Police/CC1  Main.jpg", alt: "The Sequoia Pavilion project image" },
      { type: "image", src: "/architecture/Control Room and Command Center Building at CBD for Navi Mumbai Police/CC2.jpg", alt: "The Sequoia Pavilion project image" },
      { type: "image", src: "/architecture/Control Room and Command Center Building at CBD for Navi Mumbai Police/CC3.jpg", alt: "The Sequoia Pavilion project image" },
      { type: "image", src: "/architecture/Control Room and Command Center Building at CBD for Navi Mumbai Police/CC7.jpg", alt: "The Sequoia Pavilion project image" },
      { type: "image", src: "/architecture/Control Room and Command Center Building at CBD for Navi Mumbai Police/CC8.jpg", alt: "The Sequoia Pavilion project image" },
      { type: "image", src: "/architecture/Control Room and Command Center Building at CBD for Navi Mumbai Police/CC9.jpg", alt: "The Sequoia Pavilion project image" },
      { type: "image", src: "/architecture/Control Room and Command Center Building at CBD for Navi Mumbai Police/image.png", alt: "The Sequoia Pavilion project image" },
    ],
  },
  {
    title: "Farmhouse at Gadeshwar - Mr. R. R. Beedu",
    slug: "farmhouse-at-gadeshwar",
    category: "architecture",
    location: "Lake District, United Kingdom",
    area: "640 m²",
    dateOfCompletion: "2025",
    // status: "In Progress",
    media: [
      {
        type: "video",
        src: "/architecture/farmhouse-at-gadeshwar/3.mp4",
        thumbnail: "/architecture/farmhouse-at-gadeshwar/1.jpg",
        title: "House on the Cliff project video",
        alt: "House on the Cliff project video thumbnail",
      },
      { type: "image", src: "/architecture/farmhouse-at-gadeshwar/1.jpg", alt: "The Sequoia Pavilion project image" },
      { type: "image", src: "/architecture/farmhouse-at-gadeshwar/2.jpg", alt: "The Sequoia Pavilion project image" },
    ],
  },

  // ---------- Interior ----------
  {
    title: "3 BHK house Interiors at Seawood",
    slug: "3-BHK-house-interiors-at-seawood",
    category: "interior",
    location: "Edinburgh, United Kingdom",
    area: "120 m²",
    dateOfCompletion: "2023",
    // status: "Completed",
    media: [
      { type: "image", src: "/interiors/three_bhk_seawoods/Picture13.jpg", alt: "The Reading Room project image" },
      { type: "image", src: "/interiors/three_bhk_seawoods/Picture18.jpg", alt: "The Reading Room project image" },
      { type: "image", src: "/interiors/three_bhk_seawoods/Picture17.jpg", alt: "The Reading Room project image" },
      { type: "image", src: "/interiors/three_bhk_seawoods/Picture16.jpg", alt: "The Reading Room project image" },
      { type: "image", src: "/interiors/three_bhk_seawoods/Picture15.jpg", alt: "The Reading Room project image" },
    ],
  },
  {
    title: "Control Room at Thane — for Thane City Police",
    slug: "control-room-at-thane-for-thane-city-police",
    category: "interior",
    location: "Bath, United Kingdom",
    area: "210 m²",
    dateOfCompletion: "2025",
    // status: "In Progress",
    media: [
      { type: "image", src: "/interiors/control_room_at_hane/2.jpg", alt: "Quarry House Interior project image" },
      { type: "image", src: "/interiors/control_room_at_hane/1.jpg", alt: "Quarry House Interior project image" },
      { type: "image", src: "/interiors/control_room_at_hane/3.jpg", alt: "Quarry House Interior project image" },
      { type: "image", src: "/interiors/control_room_at_hane/4.jpg", alt: "Quarry House Interior project image" },
      { type: "image", src: "/interiors/control_room_at_hane/5.jpg", alt: "Quarry House Interior project image" },
      { type: "image", src: "/interiors/control_room_at_hane/6.jpg", alt: "Quarry House Interior project image" },
      { type: "image", src: "/interiors/control_room_at_hane/7.jpg", alt: "Quarry House Interior project image" },
      { type: "image", src: "/interiors/control_room_at_hane/8.jpg", alt: "Quarry House Interior project image" },
      { type: "image", src: "/interiors/control_room_at_hane/9.jpg", alt: "Quarry House Interior project image" },
      { type: "image", src: "/interiors/control_room_at_hane/10.jpg", alt: "Quarry House Interior project image" },
      { type: "image", src: "/interiors/control_room_at_hane/11.jpg", alt: "Quarry House Interior project image" },
    ],
  },

  // ---------- Planning ----------
  {
    title: "Daund",
    slug: "daund",
    category: "planning",
    location: "Porto, Portugal",
    area: "18 hectares",
    dateOfCompletion: "2024",
    // status: "Completed",
    media: [
      { type: "image", src: "/planning/daund/4.jpg", alt: "Riverside District Masterplan project image" },
      { type: "image", src: "/planning/daund/11.jpg", alt: "Riverside District Masterplan project image" },
      { type: "image", src: "/planning/daund/1.jpg", alt: "Riverside District Masterplan project image" },
      { type: "image", src: "/planning/daund/2.jpg", alt: "Riverside District Masterplan project image" },
      { type: "image", src: "/planning/daund/3.jpg", alt: "Riverside District Masterplan project image" },
      { type: "image", src: "/planning/daund/5.jpg", alt: "Riverside District Masterplan project image" },
      { type: "image", src: "/planning/daund/6.jpg", alt: "Riverside District Masterplan project image" },
      { type: "image", src: "/planning/daund/7.jpg", alt: "Riverside District Masterplan project image" },
      { type: "image", src: "/planning/daund/8.jpg", alt: "Riverside District Masterplan project image" },
      { type: "image", src: "/planning/daund/9.jpg", alt: "Riverside District Masterplan project image" },
      { type: "image", src: "/planning/daund/10.jpg", alt: "Riverside District Masterplan project image" },
    ],
  },
  // {
  //   title: "Old Town Renewal Framework",
  //   slug: "old-town-renewal-framework",
  //   category: "planning",
  //   location: "Oslo, Norway",
  //   area: "26 hectares",
  //   dateOfCompletion: "2026",
  //   // status: "In Progress",
  //   media: [
  //     { type: "image", src: "/placeholder/04.svg", alt: "Old Town Renewal Framework project image" },
  //     { type: "image", src: "/placeholder/02.svg", alt: "Old Town Renewal Framework project image" },
  //     { type: "image", src: "/placeholder/06.svg", alt: "Old Town Renewal Framework project image" },
  //   ],
  // },

  // ---------- Landscape ----------
  {
    title: "Headland Garden",
    slug: "headland-garden",
    category: "landscape",
    location: "Cornwall, United Kingdom",
    area: "1.2 hectares",
    dateOfCompletion: "2023",
    // status: "Completed",
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
    location: "Helsinki, Finland",
    area: "0.8 hectares",
    dateOfCompletion: "2025",
    // status: "In Progress",
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
