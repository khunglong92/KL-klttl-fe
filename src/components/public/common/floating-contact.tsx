import { motion } from "framer-motion";
import { Phone, MessageCircle } from "lucide-react";
import { AppThumbnailImage } from "./app-thumbnail-image";
import zaloImage from "@/images/contacts/zalo.svg";

export function FloatingContact() {
  const companyPhone = import.meta.env["VITE_COMPANY_PHONE"] || "0967853833";

  return (
    <div className="fixed right-4 bottom-20 z-50 flex flex-col gap-3">
      {/* Phone Button */}
      <motion.a
        href={`tel:${companyPhone}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="relative group"
        aria-label="Gọi điện"
      >
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full bg-accent-red animate-ping opacity-30" />

        {/* Button */}
        <div className="relative w-14 h-14 bg-accent-red hover:bg-accent-red-700 rounded-full flex items-center justify-center shadow-lg shadow-accent-red/30 transition-colors">
          <Phone className="h-6 w-6 text-white" />
        </div>

        {/* Tooltip */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          whileHover={{ opacity: 1, x: 0 }}
          className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        >
          Gọi ngay: {companyPhone}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 w-2 h-2 bg-gray-900 rotate-45" />
        </motion.div>
      </motion.a>

      {/* Zalo Button */}
      <a
        href={`https://zalo.me/${companyPhone}`}
        target="_blank"
        rel="noopener noreferrer"
        className="relative group"
        aria-label="Chat Zalo"
      >
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Pulse ring */}
          <span className="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-30" />

          {/* Button */}
          <div className="relative w-14 h-14 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30 transition-colors overflow-hidden">
            <AppThumbnailImage src={zaloImage} alt="Zalo" className="w-8 h-8" />
          </div>
        </motion.div>

        {/* Tooltip */}
        <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Chat Zalo
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 w-2 h-2 bg-gray-900 rotate-45" />
        </div>
      </a>

      {/* Messenger/Chat Button (optional) */}
      <motion.a
        href="/contact"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.4, type: "spring", stiffness: 200 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="relative group"
        aria-label="Liên hệ"
      >
        {/* Button */}
        <div className="relative w-14 h-14 bg-navy hover:bg-navy-700 rounded-full flex items-center justify-center shadow-lg shadow-navy/30 transition-colors">
          <MessageCircle className="h-6 w-6 text-white" />
        </div>

        {/* Tooltip */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          whileHover={{ opacity: 1, x: 0 }}
          className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        >
          Gửi tin nhắn
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 w-2 h-2 bg-gray-900 rotate-45" />
        </motion.div>
      </motion.a>
    </div>
  );
}
