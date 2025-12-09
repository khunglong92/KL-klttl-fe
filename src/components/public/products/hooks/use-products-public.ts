import { productsService } from "@/services/api/productsService";
import { useQuery } from "@tanstack/react-query";
import { useCategories } from "@/services/hooks/useCategories";

export default function useProductsPublic() {
  const { data: products = [], isLoading: loadingProducts } = useQuery({
    queryKey: ["products"],
    queryFn: () => productsService.findAll({ limit: 100 }),
    select: (data) => data.data,
  });

  const { data: categories = [], isLoading: loadingCategories } =
    useCategories();

  return {
    products,
    categories,
    loading: loadingProducts || loadingCategories,
  };
}
