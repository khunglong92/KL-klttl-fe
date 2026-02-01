import { Phone } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

import "@/styles/floating-buttons.css";
import zaloImage from "@/images/contacts/zalo.svg";
import messengerImage from "@/images/common/messenger.png";

const ZALO_PHONE_NUMBER =
  import.meta.env["VITE_ZALO_PHONE_NUMBER"] || "0967853833";
const PHONE_NUMBER = import.meta.env["VITE_PHONE_NUMBER"] || "0967853833";

const formatPhoneNumber = (phone: string) => {
  if (!phone) return "";
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 4)}.${cleaned.slice(4, 7)}.${cleaned.slice(7)}`;
  }
  return phone;
};

export function FloatingContactButtons() {
  const [showDetails, setShowDetails] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const formattedPhone = formatPhoneNumber(PHONE_NUMBER);

  const handleInteraction = () => {
    setShowDetails(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setShowDetails(false);
    }, 5000);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <>
      <div
        className="fixed -bottom-5 -left-4 z-50 flex flex-col-reverse gap-0"
        onMouseEnter={handleInteraction}
        onTouchStart={handleInteraction}
      >
        {/* Main Container - Ensuring buttons stay in alignment */}
        <motion.div
          initial={false}
          animate={{ scale: showDetails ? 1.02 : 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="relative flex flex-col-reverse items-start"
        >
          {/* Phone Button (Primary - Always Visible) */}
          <div className="hotline-phone-ring-wrap pointer-events-auto relative z-30">
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

            <AnimatePresence>
              {showDetails && (
                <motion.div
                  initial={{ opacity: 0, x: -5, scaleX: 0, originX: 0 }}
                  animate={{ opacity: 1, x: 0, scaleX: 1 }}
                  exit={{ opacity: 0, x: -5, scaleX: 0 }}
                  transition={{
                    duration: 0.3,
                    ease: [0.23, 1, 0.32, 1], // Fast out, smooth finish
                  }}
                  className="hotline-bar absolute left-[33px] bottom-[37px] z-20 pointer-events-auto overflow-hidden"
                >
                  <a href={`tel:${PHONE_NUMBER}`} className="block">
                    <span className="text-hotline whitespace-nowrap px-4 font-bold text-base tracking-wider [text-shadow:0.5px_0_0_currentColor]">
                      {formattedPhone}
                    </span>
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Zalo Button (Expandable from Bottom to Top) */}
          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{ height: 0, opacity: 0, y: 10 }}
                animate={{ height: 110, opacity: 1, y: 0 }}
                exit={{ height: 0, opacity: 0, y: 10 }}
                transition={{
                  height: { duration: 0.4, ease: [0.23, 1, 0.32, 1] },
                  y: { duration: 0.4, ease: [0.23, 1, 0.32, 1] },
                  opacity: { duration: 0.2 },
                }}
                className="hotline-zalo-ring-wrap pointer-events-auto relative z-20"
              >
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div className="hotline-zalo-ring">
                    <div className="hotline-zalo-ring-circle"></div>
                    <div className="hotline-zalo-ring-circle-fill"></div>
                    <div className="hotline-zalo-ring-img-circle">
                      <a
                        href={`https://zalo.me/${ZALO_PHONE_NUMBER}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="pps-btn-img flex items-center justify-center w-full h-full pointer-events-auto"
                      >
                        <img
                          src={zaloImage}
                          alt="Chat Zalo"
                          className="w-5 h-5 object-contain"
                        />
                      </a>
                    </div>
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, x: -5, scaleX: 0, originX: 0 }}
                  animate={{ opacity: 1, x: 0, scaleX: 1 }}
                  exit={{ opacity: 0, x: -5, scaleX: 0 }}
                  transition={{
                    duration: 0.3,
                    ease: [0.23, 1, 0.32, 1],
                  }}
                  className="hotline-bar-zalo absolute left-[33px] bottom-[37px] z-10 overflow-hidden"
                >
                  <a
                    href={`https://zalo.me/${ZALO_PHONE_NUMBER}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <span className="text-hotline whitespace-nowrap px-4">
                      Chat Zalo
                    </span>
                  </a>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Right Messenger Button */}
      <motion.div
        className="fixed bottom-4 right-4 z-50 group"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <a
          href="https://m.me/1000264956499301"
          target="_blank"
          rel="noopener noreferrer"
          className="block relative"
        >
          {/* Pulse ring - matching Messenger blue */}
          <span className="absolute inset-0 rounded-full bg-[#0084FF] animate-ping opacity-20" />

          {/* Button - Transparent background */}
          <div className="relative w-11 h-11 flex items-center justify-center transition-transform hover:scale-105">
            <img
              src={messengerImage}
              alt="Messenger"
              className="w-11 h-11 object-contain drop-shadow-lg"
            />
          </div>

          {/* Tooltip */}
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Chat Facebook
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 w-2 h-2 bg-gray-900 rotate-45" />
          </div>
        </a>
      </motion.div>
    </>
  );
}
