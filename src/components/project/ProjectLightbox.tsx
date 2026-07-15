import { GalleryLightbox } from "@/components/ui/GalleryLightbox";
import type { ProjectMedia } from "@/types/project";

type ProjectLightboxProps = {
  media: ProjectMedia[];
  title: string;
  index: number;
  onClose: () => void;
  onIndexChange: (index: number) => void;
};

/** Keeps the project-facing API while sharing the viewer with other galleries. */
export function ProjectLightbox({
  media,
  title,
  index,
  onClose,
  onIndexChange,
}: ProjectLightboxProps) {
  return (
    <GalleryLightbox
      media={media}
      title={title}
      index={index}
      onClose={onClose}
      onIndexChange={onIndexChange}
    />
  );
}
