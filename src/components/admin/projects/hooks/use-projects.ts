import { useState, useEffect, useCallback } from "react";
import { projectsService } from "@/services/api/projectsService";
import { toast } from "sonner";
import { Project } from "../types";

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch projects
  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const data = await projectsService.getProjects(undefined, page, perPage);
      setProjects(data?.data || []);
      setTotal(data?.pagination?.total || 0);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Lỗi khi tải dự án";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [page, perPage]);

  // Create project
  const createProject = useCallback(
    async (data: any) => {
      try {
        await projectsService.createProject(data);
        toast.success("Thêm dự án thành công");
        await fetchProjects();
        return true;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Lỗi khi thêm dự án";
        toast.error(message);
        return false;
      }
    },
    [fetchProjects]
  );

  // Update project
  const updateProject = useCallback(
    async (id: string, data: any) => {
      try {
        await projectsService.updateProject(id, data);
        toast.success("Cập nhật dự án thành công");
        await fetchProjects();
        return true;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Lỗi khi cập nhật dự án";
        toast.error(message);
        return false;
      }
    },
    [fetchProjects]
  );

  // Delete project
  const deleteProject = useCallback(
    async (id: string) => {
      try {
        await projectsService.deleteProject(id);
        toast.success("Xoá dự án thành công");
        await fetchProjects();
        return true;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Lỗi khi xoá dự án";
        toast.error(message);
        return false;
      }
    },
    [fetchProjects]
  );

  // Delete category
  const deleteCategory = useCallback(
    async (id: string) => {
      try {
        await projectsService.deleteCategory(id);
        toast.success("Xoá danh mục thành công");
        await fetchProjects();
        return true;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Lỗi khi xoá danh mục";
        toast.error(message);
        return false;
      }
    },
    [fetchProjects]
  );

  // Initial fetch
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return {
    projects,
    loading,
    error,
    page,
    setPage,
    perPage,
    setPerPage,
    total,
    searchQuery,
    setSearchQuery,
    createProject,
    updateProject,
    deleteProject,
    deleteCategory,
    refetch: () => {
      fetchProjects();
    },
  };
}
