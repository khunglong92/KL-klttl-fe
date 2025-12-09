import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { ProjectCategory } from "../types";

export default function ProjectCategoryForm({
  category,
  onSubmit,
  onCancel,
}: {
  category?: ProjectCategory;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    order: 0,
    isActive: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description || "",
        order: category.order,
        isActive: category.isActive,
      });
    }
  }, [category]);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name,
      slug: generateSlug(name),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Vui lòng nhập tên danh mục");
      return;
    }

    if (!formData.slug.trim()) {
      toast.error("Vui lòng nhập slug");
      return;
    }

    try {
      setLoading(true);
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Tên danh mục *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={handleNameChange}
          placeholder="Nhập tên danh mục"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">Slug *</Label>
        <Input
          id="slug"
          value={formData.slug}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, slug: e.target.value }))
          }
          placeholder="Slug tự động tạo từ tên"
          required
        />
        <p className="text-xs text-muted-foreground">
          Slug được sử dụng trong URL, tự động tạo từ tên danh mục
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Mô tả</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
          placeholder="Nhập mô tả danh mục"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="order">Thứ tự hiển thị</Label>
        <Input
          id="order"
          type="number"
          value={formData.order}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              order: parseInt(e.target.value),
            }))
          }
          placeholder="0"
        />
        <p className="text-xs text-muted-foreground">
          Số nhỏ hơn sẽ hiển thị trước
        </p>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="isActive"
          checked={formData.isActive}
          onCheckedChange={(checked) =>
            setFormData((prev) => ({ ...prev, isActive: checked as boolean }))
          }
        />
        <Label htmlFor="isActive" className="font-normal cursor-pointer">
          Kích hoạt danh mục
        </Label>
      </div>

      <div className="flex gap-2 justify-end pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Huỷ
        </Button>
        <Button
          type="submit"
          className="bg-gradient-to-r from-orange-500 to-red-500"
          disabled={loading}
        >
          {loading ? "Đang lưu..." : "Lưu danh mục"}
        </Button>
      </div>
    </form>
  );
}
