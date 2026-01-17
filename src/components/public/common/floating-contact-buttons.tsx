import "@/styles/floating-buttons.css";
import { Phone } from "lucide-react";

import zaloImage from "@/images/contacts/zalo.svg";

const ZALO_PHONE_NUMBER =
  import.meta.env["VITE_ZALO_PHONE_NUMBER"] || "0967853833";
const PHONE_NUMBER = import.meta.env["VITE_PHONE_NUMBER"] || "0967853833";

const formatPhoneNumber = (phone: string) => {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6)}`;
  }
  return phone;
};

export function FloatingContactButtons() {
  const formattedPhone = formatPhoneNumber(PHONE_NUMBER);

  return (
    <div className="fixed -bottom-4 -left-4 md:bottom-4 md:left-4 z-50 flex flex-col-reverse gap-0 pointer-events-none">
      {/* Phone Button (Red Style) */}
      <div className="hotline-phone-ring-wrap pointer-events-auto relative">
        <div className="hotline-phone-ring">
          <div className="hotline-phone-ring-circle"></div>
          <div className="hotline-phone-ring-circle-fill"></div>
          <div className="hotline-phone-ring-img-circle">
            <a
              href={`tel:${PHONE_NUMBER}`}
              className="pps-btn-img flex items-center justify-center w-full h-full"
            >
              <Phone className="text-white w-5 h-5 animate-tada" />
            </a>
          </div>
        </div>
        <div className="hotline-bar">
          <a href={`tel:${PHONE_NUMBER}`}>
            <span className="text-hotline">{formattedPhone}</span>
          </a>
        </div>
      </div>

      {/* Zalo Button (Blue Style) */}
      <div className="hotline-zalo-ring-wrap pointer-events-auto relative">
        <div className="hotline-zalo-ring">
          <div className="hotline-zalo-ring-circle"></div>
          <div className="hotline-zalo-ring-circle-fill"></div>
          <div className="hotline-zalo-ring-img-circle">
            <a
              href={`https://zalo.me/${ZALO_PHONE_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="pps-btn-img flex items-center justify-center w-full h-full"
            >
              <img
                src={zaloImage}
                alt="Chat Zalo"
                className="w-5 h-5 object-contain"
              />
            </a>
          </div>
        </div>
        <div className="hotline-bar-zalo">
          <a
            href={`https://zalo.me/${ZALO_PHONE_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="text-hotline">Chat Zalo</span>
          </a>
        </div>
      </div>
    </div>
  );
}
