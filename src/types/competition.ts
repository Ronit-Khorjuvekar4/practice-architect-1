export type CompetitionImage = {
  id: string;
  src: string;
  alt: string;
  width?: number;
  height?: number;
};

export type Competition = {
  id: string;
  name: string;
  images: CompetitionImage[];
};
