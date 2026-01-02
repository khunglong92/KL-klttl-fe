import { AppThumbnailImage } from "@/components/public/common/app-thumbnail-image";
import zaloImage from "@/images/contacts/zalo.svg";

/**
 * A custom Zalo icon component.
 * It accepts a 'size' prop to maintain compatibility with Tabler icons,
 * but styling is primarily handled by the `className`.
 */
export const ZaloIcon = ({ className }: { size?: number | string; className?: string }) => (
  <AppThumbnailImage
    // The default w-5/h-5 matches the 20px size used in the ActionIcon
    className={className || "w-5 h-5"}
    src={zaloImage}
    alt="Zalo Icon"
  />
);
