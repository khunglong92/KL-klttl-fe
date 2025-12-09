import { useMemo, useState } from "react";
import {
  useProductsPaginated,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from "@/services/hooks/useProducts";
import { useCategories } from "@/services/hooks/useCategories";
import type {
  CreateProductDto,
  Product,
  UpdateProductDto,
} from "@/services/api/productsService";
import { toast } from "sonner";
import type { ProductsPage } from "@/services/hooks/useProducts";

export function useProductCrud() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<{
    name: string;
    description: string;
    technicalSpecs: string;
    price: string;
    warrantyPolicy: string;
    images: string;
    files?: File[];
    categoryId: number | null;
    isFeatured?: boolean;
  }>({
    name: "",
    description: "",
    technicalSpecs: "",
    price: "",
    warrantyPolicy: "",
    images: "",
    files: [],
    categoryId: null,
    isFeatured: true,
  });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const pagedResult = useProductsPaginated(page, limit, searchQuery);
  const paged: ProductsPage | undefined = pagedResult.data as unknown as
    | ProductsPage
    | undefined;
  const items = useMemo(() => {
    return paged?.data ?? [];
  }, [paged]);
  const total = paged?.total ?? 0;

  const { data: categories } = useCategories();
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();

  const openCreate = () => {
    setEditing(null);
    setForm({
      name: "",
      description: "",
      technicalSpecs: "",
      price: "",
      warrantyPolicy: "",
      images: "",
      files: [],
      categoryId: null,
      isFeatured: true,
    });
    setIsDialogOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);

    // Parse description từ object hoặc string
    let descriptionStr = "";
    if (p.description) {
      if (typeof p.description === "string") {
        descriptionStr = p.description;
      } else {
        descriptionStr = JSON.stringify(p.description);
      }
    }

    // Parse technicalSpecs từ object hoặc string
    let technicalSpecsStr = "";
    if (p.technicalSpecs) {
      if (typeof p.technicalSpecs === "string") {
        technicalSpecsStr = p.technicalSpecs;
      } else {
        technicalSpecsStr = JSON.stringify(p.technicalSpecs);
      }
    }

    // Parse images từ array hoặc string
    let imagesStr = "";
    if (p.images) {
      if (typeof p.images === "string") {
        imagesStr = p.images;
      } else {
        imagesStr = JSON.stringify(p.images);
      }
    }

    setForm({
      name: p.name,
      description: descriptionStr,
      technicalSpecs: technicalSpecsStr,
      price: p.price ? String(p.price) : "",
      warrantyPolicy: p.warrantyPolicy || "",
      images: imagesStr,
      files: [],
      categoryId: p.category?.id ?? null,
      isFeatured: (p as any).isFeatured ?? false,
    });
    setIsDialogOpen(true);
  };

  const submit = async (overrideForm?: {
    name: string;
    description: string;
    technicalSpecs: string;
    price: string;
    warrantyPolicy: string;
    images: string;
    categoryId: number | null;
    isFeatured?: boolean;
  }) => {
    const source = overrideForm ?? form;
    if (!source.name.trim()) {
      toast.error("Tên sản phẩm là bắt buộc");
      return;
    }
    if (!source.categoryId) {
      toast.error("Vui lòng chọn danh mục");
      return;
    }

    // Parse description từ JSON string thành object
    // Images đã được upload trong form hook và set vào form.images dưới dạng JSON string
    let descriptionObj: Record<string, unknown> | undefined = undefined;
    if (source.description) {
      try {
        descriptionObj = JSON.parse(source.description);
      } catch {
        // Nếu không phải JSON hợp lệ, giữ nguyên string
        descriptionObj = { overview: source.description } as any;
      }
    }

    // Parse technicalSpecs từ JSON string thành object
    let technicalSpecsObj: Record<string, unknown> | undefined = undefined;
    if (source.technicalSpecs) {
      try {
        technicalSpecsObj = JSON.parse(source.technicalSpecs);
        // Remove empty values
        if (technicalSpecsObj) {
          Object.keys(technicalSpecsObj).forEach((key) => {
            const value = (technicalSpecsObj as any)[key];
            if (value === "" || value === null || value === undefined) {
              delete (technicalSpecsObj as any)[key];
            }
          });
          // Chỉ gửi nếu có ít nhất 1 field
          if (Object.keys(technicalSpecsObj).length === 0) {
            technicalSpecsObj = undefined;
          }
        }
      } catch {
        technicalSpecsObj = undefined;
      }
    }

    // Parse images từ JSON string thành array (đã được upload trong form hook)
    let imagesArray: string[] | undefined = undefined;
    if (source.images) {
      try {
        const parsed = JSON.parse(source.images);
        if (Array.isArray(parsed) && parsed.length > 0) {
          imagesArray = parsed;
        }
      } catch {
        // Nếu parse lỗi, giữ undefined
        imagesArray = undefined;
      }
    }

    // Build payload theo format của backend API
    const payload: {
      name: string;
      description?: Record<string, unknown>;
      technicalSpecs?: Record<string, unknown>;
      price?: number;
      warrantyPolicy?: string;
      images?: string[];
      categoryId: number;
      isFeatured?: boolean;
    } = {
      name: source.name.trim(),
      categoryId: source.categoryId,
      isFeatured: source.isFeatured ?? true,
    };

    // Chỉ thêm các field optional nếu có giá trị
    if (descriptionObj) {
      payload.description = descriptionObj;
    }
    if (technicalSpecsObj) {
      payload.technicalSpecs = technicalSpecsObj;
    }
    if (source.price) {
      const priceNum = Number(source.price);
      if (!isNaN(priceNum) && priceNum > 0) {
        payload.price = priceNum;
      }
    }
    if (source.warrantyPolicy?.trim()) {
      payload.warrantyPolicy = source.warrantyPolicy.trim();
    }
    if (imagesArray && imagesArray.length > 0) {
      payload.images = imagesArray;
    }

    try {
      if (editing) {
        await updateMutation.mutateAsync({
          id: editing.id,
          body: payload as UpdateProductDto,
        });
        toast.success("Cập nhật sản phẩm thành công");
      } else {
        await createMutation.mutateAsync(payload as CreateProductDto);
        toast.success("Đã thêm sản phẩm thành công");
      }
      setIsDialogOpen(false);
    } catch (e: any) {
      toast.error(e?.message || "Có lỗi xảy ra");
    }
  };

  const remove = async (id: number) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Đã xóa sản phẩm thành công!");
    } catch (e: any) {
      toast.error(e?.message || "Xóa thất bại");
    }
  };

  return {
    items: items,
    total,
    page,
    limit,
    setPage,
    setLimit,
    categories: categories ?? [],
    searchQuery,
    setSearchQuery,
    isDialogOpen,
    setIsDialogOpen,
    editing,
    form,
    setForm,
    openCreate,
    openEdit,
    submit,
    remove,
    isSaving: createMutation.isPending || updateMutation.isPending,
  };
}
