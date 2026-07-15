import type {
  CompetitionDetails,
  CompetitionImage,
  CompetitionPage,
  CompetitionSummary,
} from "@/types/competition";

type CompetitionSource = {
  id: string;
  title: string;
  type: string;
  year: string;
  location?: string;
  imagePaths: string[];
};

const commandCentrePath =
  "/architecture/Control Room and Command Center Building at CBD for Navi Mumbai Police";

const competitionSources: CompetitionSource[] = [
  {
    id: "freedom-pocket",
    title: "Freedom Pocket",
    type: "Open",
    year: "2025",
    location: "Helsinki, Finland",
    imagePaths: [
      `/competitions/freedom-pocket/freedom-pocket.png`,
    ],
  },
  {
    id: "ryde",
    title: "Ryde",
    type: "Open",
    year: "2024",
    location: "Mumbai, India",
    imagePaths: [
      `/competitions/Ryde/1.png`,
      `/competitions/Ryde/2.png`,
      `/competitions/Ryde/3.png`,
      `/competitions/Ryde/4.png`,
    ],
  },
  {
    id: "hyde-park",
    title: "Hyde park",
    type: "Invited",
    year: "2024",
    location: "Porto, Portugal",
    imagePaths: [
      `/competitions/hyde-park/11.png`,
    ],
  }
  // {
  //   id: "tsukiji-cultural-center",
  //   title: "Tsukiji Cultural Center",
  //   type: "International",
  //   year: "2023",
  //   location: "Tokyo, Japan",
  //   imagePaths: [
  //     "/interiors/control_room_at_hane/2.jpg",
  //     "/interiors/control_room_at_hane/5.jpg",
  //     "/interiors/control_room_at_hane/8.jpg",
  //   ],
  // },
  // {
  //   id: "coastal-research-station",
  //   title: "Coastal Research Station",
  //   type: "Invited",
  //   year: "2022",
  //   location: "Cornwall, United Kingdom",
  //   imagePaths: ["/architecture/alibuag_police_hq/FFLR.jpg"],
  // },
  // {
  //   id: "highland-visitor-lodge",
  //   title: "Highland Visitor Lodge",
  //   type: "Open",
  //   year: "2022",
  //   location: "Scottish Highlands",
  //   imagePaths: [
  //     "/architecture/farmhouse-at-gadeshwar/1.jpg",
  //     "/architecture/farmhouse-at-gadeshwar/2.jpg",
  //   ],
  // },
  // {
  //   id: "porto-waterfront-masterplan",
  //   title: "Porto Waterfront Masterplan",
  //   type: "International",
  //   year: "2021",
  //   location: "Porto, Portugal",
  //   imagePaths: [
  //     "/planning/daund/5.jpg",
  //     "/planning/daund/6.jpg",
  //     "/planning/daund/7.jpg",
  //     "/planning/daund/8.jpg",
  //   ],
  // },
  // {
  //   id: "atelier-on-the-hill",
  //   title: "Atelier on the Hill",
  //   type: "Open",
  //   year: "2020",
  //   location: "Kyoto, Japan",
  //   imagePaths: [
  //     "/interiors/three_bhk_seawoods/Picture13.jpg",
  //     "/interiors/three_bhk_seawoods/Picture15.jpg",
  //   ],
  // },
  // {
  //   id: "iceland-aurora-observatory",
  //   title: "Iceland Aurora Observatory",
  //   type: "International",
  //   year: "2020",
  //   location: "Akureyri, Iceland",
  //   imagePaths: ["/placeholder/06.svg", "/placeholder/02.svg"],
  // },
  // {
  //   id: "new-town-hall-oslo",
  //   title: "New Town Hall, Oslo",
  //   type: "Invited",
  //   year: "2019",
  //   location: "Oslo, Norway",
  //   imagePaths: [
  //     "/interiors/control_room_at_hane/3.jpg",
  //     "/interiors/control_room_at_hane/6.jpg",
  //     "/interiors/control_room_at_hane/9.jpg",
  //   ],
  // },
  // {
  //   id: "forest-chapel-reconstruction",
  //   title: "Forest Chapel Reconstruction",
  //   type: "Open",
  //   year: "2018",
  //   location: "Lillehammer, Norway",
  //   imagePaths: ["/placeholder/05.svg"],
  // },
  // {
  //   id: "marrakech-artist-residency",
  //   title: "Marrakech Artist Residency",
  //   type: "International",
  //   year: "2017",
  //   location: "Marrakech, Morocco",
  //   imagePaths: [
  //     "/interiors/three_bhk_seawoods/Picture16.jpg",
  //     "/interiors/three_bhk_seawoods/Picture17.jpg",
  //     "/interiors/three_bhk_seawoods/Picture18.jpg",
  //   ],
  // },
];

function toImage(
  competition: CompetitionSource,
  src: string,
  index: number,
): CompetitionImage {
  return {
    id: `${competition.id}-${index + 1}`,
    src,
    alt: `${competition.title} — architectural concept view ${index + 1}`,
  };
}

const competitionRecords: CompetitionDetails[] = competitionSources.map(
  (competition) => {
    const images = competition.imagePaths.map((src, index) =>
      toImage(competition, src, index),
    );

    return {
      id: competition.id,
      slug: competition.id,
      title: competition.title,
      type: competition.type,
      year: competition.year,
      location: competition.location,
      coverImage: images[0],
      imageCount: images.length,
      images,
    };
  },
);

function toSummary(competition: CompetitionDetails): CompetitionSummary {
  return {
    id: competition.id,
    slug: competition.slug,
    title: competition.title,
    type: competition.type,
    year: competition.year,
    location: competition.location,
    coverImage: competition.coverImage,
    imageCount: competition.imageCount,
  };
}

export function getCompetitionPage({
  cursor,
  limit = 25,
}: {
  cursor?: string | null;
  limit?: number;
} = {}): CompetitionPage {
  const safeLimit = Math.min(Math.max(Math.floor(limit), 1), 50);
  const cursorIndex = cursor
    ? competitionRecords.findIndex((competition) => competition.id === cursor)
    : -1;
  const startIndex = cursorIndex + 1;
  const pageRecords = competitionRecords.slice(
    startIndex,
    startIndex + safeLimit,
  );
  const lastRecord = pageRecords[pageRecords.length - 1];
  const hasNextPage = startIndex + pageRecords.length < competitionRecords.length;

  return {
    items: pageRecords.map(toSummary),
    nextCursor: hasNextPage && lastRecord ? lastRecord.id : null,
  };
}

export function getCompetitionDetails(id: string) {
  return competitionRecords.find((competition) => competition.id === id);
}
