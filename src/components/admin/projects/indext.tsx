import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Modal } from "@mantine/core";
import { Plus, Search, Edit, Trash2, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { apiClient } from "@/services/api/base";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import ProjectCategoryForm from "./components/project-category-form";
import ProjectForm from "./components/project-form";
import DeleteConfirmDialog from "./components/delete-confirm-dialog";
import AppButton from "@/components/atoms/app-button";

interface ProjectCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Project {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description?: string;
  content?: string;
  location?: string;
  completionDate?: string;
  image?: string;
  gallery?: any;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  category?: ProjectCategory;
}

export function AdminProjectsPage() {
  const { t, i18n } = useTranslation();
  const locale =
    i18n.language && i18n.language.startsWith("vi") ? "vi-VN" : "en-US";
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<ProjectCategory[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<ProjectCategory | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | undefined>(
    undefined
  );
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [isEditingProject, setIsEditingProject] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: "category" | "project";
    id: string;
    name: string;
  } | null>(null);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await apiClient.get<ProjectCategory[]>(
        "/project-categories"
      );
      setCategories(data || []);
    } catch (error) {
      toast.error(t("projectsAdmin.toast.loadCategoriesError"));
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch projects
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await apiClient.get<{ data: Project[] }>("/projects");
      setProjects(data?.data || []);
    } catch (error) {
      toast.error(
        t("projectsAdmin.toast.loadProjectsError", {
          defaultValue: "Lỗi khi tải danh sách dự án",
        })
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProjects();
  }, []);

  // Handle category operations
  const handleSaveCategory = async (data: any) => {
    try {
      if (isEditingCategory && selectedCategory) {
        await apiClient.patch(
          `/project-categories/${selectedCategory.id}`,
          data
        );
        toast.success(t("projectsAdmin.toast.updateCategorySuccess"));
      } else {
        await apiClient.post("/project-categories", data);
        toast.success(
          t("projectsAdmin.toast.createCategorySuccess", {
            defaultValue: "Thêm danh mục thành công",
          })
        );
      }
      setIsAddingCategory(false);
      setIsEditingCategory(false);
      setSelectedCategory(null);
      fetchCategories();
    } catch (error) {
      toast.error(t("projectsAdmin.toast.saveCategoryError"));
      console.error(error);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await apiClient.delete(`/project-categories/${id}`);
      toast.success(
        t("projectsAdmin.toast.deleteCategorySuccess", {
          defaultValue: "Xoá danh mục thành công",
        })
      );
      setDeleteConfirm(null);
      fetchCategories();
      fetchProjects();
    } catch (error) {
      toast.error(t("projectsAdmin.toast.deleteCategoryError"));
      console.error(error);
    }
  };

  // Handle project operations
  const handleSaveProject = async (data: any) => {
    try {
      if (isEditingProject && selectedProject) {
        await apiClient.patch(`/projects/${selectedProject.id}`, data);
        toast.success(t("projectsAdmin.toast.updateProjectSuccess"));
      } else {
        await apiClient.post("/projects", data);
        toast.success(t("projectsAdmin.toast.createProjectSuccess"));
      }
      setIsAddingProject(false);
      setIsEditingProject(false);
      setSelectedProject(undefined);
      fetchProjects();
    } catch (error) {
      toast.error(t("projectsAdmin.toast.saveProjectError"));
      console.error(error);
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      await apiClient.delete(`/projects/${id}`);
      toast.success(t("projectsAdmin.toast.deleteProjectSuccess"));
      setDeleteConfirm(null);
      fetchProjects();
    } catch (error) {
      toast.error(t("projectsAdmin.toast.deleteProjectError"));
      console.error(error);
    }
  };

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {t("projectsAdmin.headerTitle", { defaultValue: "Quản lý dự án" })}
          </h1>
          <p className="text-muted-foreground">
            {t("projectsAdmin.headerSubtitle", {
              defaultValue:
                "Quản lý danh mục dự án và các dự án đang thực hiện",
            })}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="projects" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="projects">
            {t("projectsAdmin.tabs.projects", { defaultValue: "Dự án" })}
          </TabsTrigger>
          <TabsTrigger value="categories">
            {t("projectsAdmin.tabs.categories")}
          </TabsTrigger>
        </TabsList>

        {/* Projects Tab */}
        <TabsContent value="projects" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{t("projectsAdmin.listTitle")}</CardTitle>
                <div className="flex gap-4 items-center">
                  <div className="relative w-72">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={t("projectsAdmin.searchPlaceholder")}
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <AppButton
                    label={t("projectsAdmin.addProject")}
                    leftSection={<Plus className="mr-2 h-4 w-4" />}
                    onClick={() => setIsAddingProject(true)}
                    showArrow={false}
                  />

                  <Modal
                    opened={isAddingProject}
                    onClose={() => {
                      setIsAddingProject(false);
                      setIsEditingProject(false);
                      setSelectedProject(undefined);
                    }}
                    title={
                      isEditingProject
                        ? t("projectsAdmin.modal.project.editTitle")
                        : t("projectsAdmin.modal.project.createTitle")
                    }
                    centered
                    size="xl"
                    scrollAreaComponent={undefined}
                  >
                    <div
                      style={{
                        maxHeight: "calc(100vh - 200px)",
                        overflowY: "auto",
                      }}
                    >
                      <ProjectForm
                        categories={categories}
                        project={
                          isEditingProject
                            ? (selectedProject ?? undefined)
                            : undefined
                        }
                        onSubmit={handleSaveProject}
                        onCancel={() => {
                          setIsAddingProject(false);
                          setIsEditingProject(false);
                          setSelectedProject(undefined);
                        }}
                      />
                    </div>
                  </Modal>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  {t("projectsAdmin.loading")}
                </div>
              ) : filteredProjects.length === 0 ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {t("projectsAdmin.noProjects", {
                      defaultValue: "Không có dự án nào. Hãy thêm dự án mới.",
                    })}
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>
                          {t("projectsAdmin.table.columns.name")}
                        </TableHead>
                        <TableHead>
                          {t("projectsAdmin.table.columns.category")}
                        </TableHead>
                        <TableHead>
                          {t("projectsAdmin.table.columns.location")}
                        </TableHead>
                        <TableHead>
                          {t("projectsAdmin.table.columns.completionDate")}
                        </TableHead>
                        <TableHead>
                          {t("projectsAdmin.table.columns.featured")}
                        </TableHead>
                        <TableHead>
                          {t("projectsAdmin.table.columns.status")}
                        </TableHead>
                        <TableHead className="text-right">
                          {t("projectsAdmin.table.columns.actions")}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProjects.map((project, index) => (
                        <motion.tr
                          key={project.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <TableCell>
                            <div>
                              <p className="font-medium">{project.name}</p>
                              <p className="text-xs text-muted-foreground line-clamp-1">
                                {project.description}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            {project.category?.name ||
                              t("projectsAdmin.na", {
                                defaultValue: t("projectsAdmin.na", {
                                  defaultValue: "N/A",
                                }),
                              })}
                          </TableCell>
                          <TableCell>
                            {project.location ||
                              t("projectsAdmin.na", { defaultValue: "N/A" })}
                          </TableCell>
                          <TableCell>
                            {project.completionDate
                              ? new Date(
                                  project.completionDate
                                ).toLocaleDateString(locale)
                              : t("projectsAdmin.na", { defaultValue: "N/A" })}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                project.isFeatured ? "default" : "secondary"
                              }
                            >
                              {project.isFeatured
                                ? t("projectsAdmin.badges.yes", {
                                    defaultValue: "Có",
                                  })
                                : t("projectsAdmin.badges.no", {
                                    defaultValue: "Không",
                                  })}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                project.isActive ? "default" : "destructive"
                              }
                            >
                              {project.isActive
                                ? t("projectsAdmin.badges.active", {
                                    defaultValue: "Hoạt động",
                                  })
                                : t("projectsAdmin.badges.inactive", {
                                    defaultValue: "Ẩn",
                                  })}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setSelectedProject(project);
                                  setIsEditingProject(true);
                                  setIsAddingProject(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  setDeleteConfirm({
                                    type: "project",
                                    id: project.id,
                                    name: project.name,
                                  })
                                }
                              >
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </Button>
                            </div>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{t("projectsAdmin.categories.title")}</CardTitle>
                <AppButton
                  label={t("projectsAdmin.categories.add")}
                  leftSection={<Plus className="mr-2 h-4 w-4" />}
                  onClick={() => setIsAddingCategory(true)}
                  showArrow={false}
                />
                <Modal
                  opened={isAddingCategory}
                  onClose={() => {
                    setIsAddingCategory(false);
                    setIsEditingCategory(false);
                    setSelectedCategory(null);
                  }}
                  title={
                    isEditingCategory
                      ? t("projectsAdmin.modal.category.editTitle")
                      : t("projectsAdmin.modal.category.createTitle")
                  }
                  centered
                  size="xl"
                >
                  <ProjectCategoryForm
                    category={
                      isEditingCategory
                        ? (selectedCategory ?? undefined)
                        : undefined
                    }
                    onSubmit={handleSaveCategory}
                    onCancel={() => {
                      setIsAddingCategory(false);
                      setIsEditingCategory(false);
                      setSelectedCategory(null);
                    }}
                  />
                </Modal>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  {t("projectsAdmin.loading")}
                </div>
              ) : categories.length === 0 ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {t("projectsAdmin.categories.noData", {
                      defaultValue:
                        "Không có danh mục nào. Hãy thêm danh mục mới.",
                    })}
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>
                          {t("projectsAdmin.categories.table.columns.name")}
                        </TableHead>
                        <TableHead>
                          {t("projectsAdmin.categories.table.columns.slug")}
                        </TableHead>
                        <TableHead>
                          {t(
                            "projectsAdmin.categories.table.columns.description"
                          )}
                        </TableHead>
                        <TableHead>
                          {t("projectsAdmin.categories.table.columns.order")}
                        </TableHead>
                        <TableHead>
                          {t("projectsAdmin.categories.table.columns.status")}
                        </TableHead>
                        <TableHead className="text-right">
                          {t("projectsAdmin.table.columns.actions")}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {categories.map((category, index) => (
                        <motion.tr
                          key={category.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <TableCell className="font-medium">
                            {category.name}
                          </TableCell>
                          <TableCell>
                            <code className="text-xs bg-muted px-2 py-1 rounded">
                              {category.slug}
                            </code>
                          </TableCell>
                          <TableCell className="max-w-xs">
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {category.description ||
                                t("projectsAdmin.na", { defaultValue: "N/A" })}
                            </p>
                          </TableCell>
                          <TableCell>{category.order}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                category.isActive ? "default" : "destructive"
                              }
                            >
                              {category.isActive
                                ? t("projectsAdmin.badges.active", {
                                    defaultValue: "Hoạt động",
                                  })
                                : t("projectsAdmin.badges.inactive", {
                                    defaultValue: "Ẩn",
                                  })}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setSelectedCategory(category);
                                  setIsEditingCategory(true);
                                  setIsAddingCategory(true);
                                }}
                              >
                                <Edit className="h-4 w-4 cursor-pointer" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  setDeleteConfirm({
                                    type: "category",
                                    id: category.id,
                                    name: category.name,
                                  })
                                }
                              >
                                <Trash2 className="h-4 w-4 text-red-600 cursor-pointer" />
                              </Button>
                            </div>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      {deleteConfirm && (
        <DeleteConfirmDialog
          type={deleteConfirm.type}
          name={deleteConfirm.name}
          onConfirm={() => {
            if (deleteConfirm.type === "category") {
              handleDeleteCategory(deleteConfirm.id);
            } else {
              handleDeleteProject(deleteConfirm.id);
            }
          }}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}
    </div>
  );
}
