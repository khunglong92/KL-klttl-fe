import { useState, ImgHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

// Định nghĩa các giá trị cho object-fit
type ObjectFit = "fill" | "contain" | "cover" | "none" | "scale-down";

// Mở rộng ImgHTMLAttributes để component chấp nhận tất cả các props của thẻ <img>
interface AppImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  /**
   * Xác định cách ảnh sẽ thay đổi kích thước để vừa với container.
   * Tương ứng với thuộc tính object-fit của CSS.
   * @default 'cover'
   */
  fit?: ObjectFit;
}

export function AppThumbnailImage({
  src,
  alt,
  className,
  fit = "cover", // Đặt giá trị mặc định là 'cover'
  ...props
}: AppImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy" // Kích hoạt lazy loading gốc của trình duyệt
      onLoad={handleImageLoad}
      className={cn(
        "transition-opacity duration-500 ease-in-out",
        {
          "object-cover": fit === "cover",
          "object-contain": fit === "contain",
          "object-fill": fit === "fill",
          "object-none": fit === "none",
          "object-scale-down": fit === "scale-down",
        },
        isLoaded ? "opacity-100" : "opacity-0",
        className // Cho phép ghi đè hoặc thêm class từ bên ngoài
      )}
      {...props} // Truyền tất cả các props còn lại (như width, height, style, v.v.)
    />
  );
}
