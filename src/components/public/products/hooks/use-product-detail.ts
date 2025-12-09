import { useState, useEffect } from 'react';
import { productsService, Product } from '@/services/api/productsService';

export const useProductDetail = (productId: string | undefined) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!productId) {
      setLoading(false);
      // Optionally set an error or leave as is
      setError(new Error('Product ID is not provided.'));
      return;
    }

    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const numericProductId = parseInt(productId, 10);
        if (isNaN(numericProductId)) {
          throw new Error('Invalid Product ID format.');
        }
        const response = await productsService.getById(numericProductId);
        setProduct(response);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred while fetching the product.'));
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  return { product, loading, error };
};

