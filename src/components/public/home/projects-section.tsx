import { motion } from "framer-motion";

import { Badge, Building2, Calendar } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface ProjectsSectionProps {
  isVisible?: boolean;
}

export function ProjectsSection({ isVisible = false }: ProjectsSectionProps) {
  const projects = [
    {
      id: 1,
      title: "Nội thất Villa Thảo Điền",
      client: "Gia đình Nguyễn",
      category: "Biệt thự",
      completedDate: "Tháng 10, 2024",
      image:
        "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob21lJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzYyMDAxNDY0fDA&ixlib=rb-4.1.0&q=80&w=1080",
      description:
        "Thi công hoàn thiện nội thất cho biệt thự 3 tầng với phong cách hiện đại sang trọng",
    },
    {
      id: 2,
      title: "Văn phòng Công ty ABC",
      client: "Công ty TNHH ABC",
      category: "Văn phòng",
      completedDate: "Tháng 9, 2024",
      image:
        "https://images.unsplash.com/photo-1695687349399-452a14c409be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b29kZW4lMjBmdXJuaXR1cmUlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NjIwODAxMTV8MA&ixlib=rb-4.1.0&q=80&w=1080",
      description:
        "Cung cấp và lắp đặt toàn bộ nội thất văn phòng cho 100 nhân viên",
    },
    {
      id: 3,
      title: "Căn hộ Vinhomes Central Park",
      client: "Gia đình Trần",
      category: "Căn hộ",
      completedDate: "Tháng 8, 2024",
      image:
        "https://images.unsplash.com/photo-1759753976401-4b41b1acdaaa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBmdXJuaXR1cmUlMjBzaG93cm9vbXxlbnwxfHx8fDE3NjIwNDQyODZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      description:
        "Tư vấn và thi công nội thất căn hộ 120m² phong cách tối giản",
    },
  ];

  if (!isVisible) {
    return null;
  }

  return (
    <section id="projects" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="mb-4">Dự Án Tiêu Biểu</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Những dự án nội thất mà chúng tôi đã hoàn thành với chất lượng và sự
            hài lòng cao nhất từ khách hàng
          </p>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -10 }}
              className="group"
            >
              <div className="bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border">
                {/* Image */}
                <div className="relative overflow-hidden aspect-video">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <ImageWithFallback
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>

                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-amber-600 hover:bg-amber-700 text-white">
                      {project.category}
                    </Badge>
                  </div>

                  {/* Overlay */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-6"
                  >
                    <div className="text-white">
                      <p className="text-sm mb-1 opacity-90">
                        Khách hàng: {project.client}
                      </p>
                    </div>
                  </motion.div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="mb-2 group-hover:text-amber-600 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {project.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Building2 className="h-4 w-4" />
                      <span>{project.category}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{project.completedDate}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
