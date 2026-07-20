/** Serializable image data consumed by the homepage photo carousel. */
export type GalleryImage = {
  id: string | number;
  url: string;
  alternativeText: string;
  width?: number;
  height?: number;
};
