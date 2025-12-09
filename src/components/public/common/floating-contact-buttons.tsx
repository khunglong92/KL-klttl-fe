import { cn } from "@/lib/utils";

import { AppThumbnailImage } from "./app-thumbnail-image";
import zaloImage from "@/images/contacts/zalo.svg";
import phoneImage from "@/images/contacts/phone.svg";

// Lấy số điện thoại từ biến môi trường, có fallback
const ZALO_PHONE_NUMBER =
  import.meta.env['VITE_ZALO_PHONE_NUMBER'] || "0987654321";
const PHONE_NUMBER = import.meta.env['VITE_PHONE_NUMBER'] || "0967853383";

export function FloatingContactButtons() {
  return (
    <div className="flex flex-col bottom-8 fixed left-4 gap-y-6 z-50">
      {/* Zalo Button */}
      <a
        href={`https://zalo.me/${ZALO_PHONE_NUMBER}`}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "rounded-full flex items-center justify-center",
          "w-10 h-10 md:w-12 md:h-12" // Force square shape for circular glow
        )}
        aria-label="Chat with us on Zalo"
        style={{ animation: "glow-pulse 2s infinite" }}
      >
        <AppThumbnailImage
          src={zaloImage}
          alt="Zalo Icon"
          className="w-8 h-8 md:w-11 md:h-11 object-contain"
        />
      </a>

      {/* Phone Button */}
      <a
        href={`tel:${PHONE_NUMBER}`}
        className={cn(
          "relative flex items-center left-2 bg-green-500 rounded-full text-white font-semibold shadow-lg"
        )}
        aria-label="Call us"
        style={{ animation: "glow-pulse-green 2s infinite" }}
      >
        {/* Absolutely positioned icon container */}
        <div
          className="absolute top-1/2 -translate-y-1/2 left-[-5px] w-10 h-10 md:w-12 md:h-12 flex items-center justify-center"
          style={{ animation: "ring-only 2s ease-in-out infinite" }}
        >
          <AppThumbnailImage
            src={phoneImage}
            alt="Phone Icon"
            className="w-full h-full object-contain"
          />
        </div>
        {/* Animated Phone number text with padding to avoid overlap */}
        <div className="pl-12 pr-4 py-1 flex items-center shadow-2xl">
          {PHONE_NUMBER.split("").map((char: string, index: number) => (
            <span
              key={index}
              className="inline-block"
              style={{
                animation: `scale-and-glow-text 3s infinite`,
                animationDelay: `${index * 0.2}s`,
              }}
            >
              {char}
            </span>
          ))}
        </div>
      </a>
    </div>
  );
}
