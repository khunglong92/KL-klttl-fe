import { motion } from "framer-motion";

interface AnimatedTitleProps {
  number: string;
  title: string;
}

export function AnimatedTitle({ number, title }: AnimatedTitleProps) {
  return (
    <div className="mb-16">
      <div className="flex flex-col gap-6">
        {/* Number with gradient background */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-4"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-orange-500 blur-xl opacity-30" />
            <div className="relative bg-gradient-to-br from-amber-500 to-orange-500 text-white px-6 py-3 rounded-2xl text-2xl font-bold">
              {number}
            </div>
          </div>

          {/* Animated line */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 h-px bg-gradient-to-r from-amber-500 via-orange-400 to-transparent origin-left"
          />
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl leading-tight max-w-5xl text-foreground font-bold">
            {title}
          </h2>

          {/* Decorative accent */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-4 w-32 h-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full origin-left"
          />
        </motion.div>
      </div>
    </div>
  );
}
