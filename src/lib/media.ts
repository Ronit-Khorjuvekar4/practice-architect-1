import type { Project, ProjectMedia } from "@/types/project";

type ImageProjectMedia = ProjectMedia & { type: "image" };
type VideoProjectMedia = ProjectMedia & { type: "video" };

/** Narrows a media item to an image. */
export function isImageMedia(media: ProjectMedia): media is ImageProjectMedia {
  return media.type === "image";
}

/** Narrows a media item to a video. */
export function isVideoMedia(media: ProjectMedia): media is VideoProjectMedia {
  return media.type === "video";
}

/**
 * Resolves a single still image for use in cards and thumbnail strips,
 * where a `<video>` element is not appropriate. Prefers the first image,
 * then any video poster, and finally a shipped placeholder so callers
 * always receive a valid `next/image` source.
 */
export function getProjectCover(project: Project): string {
  const firstImage = project.media.find(isImageMedia);
  if (firstImage) {
    return firstImage.src;
  }

  const posterVideo = project.media.find(
    (media) => media.type === "video" && media.thumbnail,
  );
  if (posterVideo?.thumbnail) {
    return posterVideo.thumbnail;
  }

  return "/placeholder/01.svg";
}
