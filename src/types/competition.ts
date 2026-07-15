export type CompetitionImage = {
  id: string;
  src: string;
  alt: string;
};

export type CompetitionSummary = {
  id: string;
  slug: string;
  title: string;
  type: string;
  year: string;
  location?: string;
  coverImage: CompetitionImage;
  imageCount: number;
};

export type CompetitionDetails = CompetitionSummary & {
  images: CompetitionImage[];
};

export type CompetitionPage = {
  items: CompetitionSummary[];
  nextCursor: string | null;
};
