import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { ImageWithFallback } from "../public/figma/ImageWithFallback";

export function Lightbox({
  selectedIndex,
  images,
  onClose,
  onPrev,
  onNext,
}: {
  images: string[];
  selectedIndex: number | null;
  onClose: (e?: React.MouseEvent) => void;
  onPrev: (e?: React.MouseEvent) => void;
  onNext: (e?: React.MouseEvent) => void;
}) {
  const isOpen = selectedIndex !== null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative w-[90vw] h-[90vh]"
            onClick={(e?: React.MouseEvent) => e?.stopPropagation()}
          >
            <ImageWithFallback
              src={images[selectedIndex ?? 0] || ""}
              alt={`View image ${selectedIndex ?? 0 + 1}`}
              className="w-full h-full object-contain"
            />
          </motion.div>

          {/* Close Button */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </motion.button>

          {/* Previous Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute left-8 top-1/2 -translate-y-1/2 text-white bg-white/10 backdrop-blur-lg rounded-full p-2"
            onClick={(e) => {
              e?.stopPropagation();
              onPrev();
            }}
          >
            <ArrowLeft className="h-6 w-6" />
          </motion.button>

          {/* Next Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute right-8 top-1/2 -translate-y-1/2 text-white bg-white/10 backdrop-blur-lg rounded-full p-2"
            onClick={(e) => {
              e?.stopPropagation();
              onNext();
            }}
          >
            <ArrowRight className="h-6 w-6" />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
