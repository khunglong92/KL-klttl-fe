import "framer-motion";

declare module "framer-motion" {
  interface MotionProps {
    className?: string;
    onClick?: (e?: React.MouseEvent) => void;
    title?: string;
    href?: string;
  }
}
