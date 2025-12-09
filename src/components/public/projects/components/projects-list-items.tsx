import { motion } from "framer-motion";
import { Project } from "../hooks/use-projects-public";
import { ProjectCard } from "./project-card";
import { useTranslation } from "react-i18next";

interface ProjectsListItemsProps {
  projects: Project[];
}

export function ProjectsListItems({ projects }: ProjectsListItemsProps) {
  const { t } = useTranslation();

  if (projects.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center py-20"
      >
        <p className="text-lg md:text-xl text-muted-foreground">
          {t("projects.list.empty", "Dự án đang được cập nhật")}
        </p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {projects.map((project, index) => (
        <ProjectCard key={project.id} project={project} index={index} />
      ))}
    </div>
  );
}
