import { motion } from "framer-motion";

interface AnimatedTitleProps {
  number: string;
  title: string;
}

export function AnimatedTitle({ number, title }: AnimatedTitleProps) {
  return (
    <div className="mb-8">
      <div className="flex flex-row items-center gap-6">
        {/* Number with gradient background */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative shrink-0"
        >
          <div className="absolute inset-0 bg-linear-to-br from-amber-500 to-orange-500 blur-xl opacity-30" />
          <div className="relative bg-linear-to-br from-amber-500 to-orange-500 text-white px-5 py-3 rounded-2xl text-xl md:text-2xl font-bold">
            {number}
          </div>
        </motion.div>

        {/* Title & Divider */}
        <div className="flex-1 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl leading-tight text-foreground font-bold whitespace-nowrap overflow-hidden text-ellipsis">
              {title}
            </h2>
          </motion.div>

          {/* Animated line - now below title or between? User just said "liền kề" (adjacent).
               Let's keep the line below title as a separator. */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-2 h-px bg-linear-to-r from-amber-500 via-orange-400 to-transparent origin-left w-full max-w-md"
          />
        </div>
      </div>
    </div>
  );
}
