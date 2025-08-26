import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/product/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import productService from "@/services/api/product/productService";
import { useQuery } from "@tanstack/react-query";
import type { Product } from "@/lib/mock-data";

export const Trending = () => {
  const { data, isLoading, error } = useQuery<Product[]>({
    queryKey: ["trending-products"],
    queryFn: async () => {
      const res = await productService.getTrendingProducts();
      const list = Array.isArray(res?.data?.data) ? res.data.data : [];
      return list as Product[];
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    retry: 1,
  });

  const products = useMemo(() => (Array.isArray(data) ? data : []), [data]);

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-3xl md:text-4xl font-bold">Trending Now</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            What's popular today based on community activity.
          </p>
        </div>

        {error && (
          <div className="text-center text-red-500 mb-8">
            Failed to load trending products.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-48 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))
            : products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
        </div>

        {!isLoading && products.length === 0 && (
          <div className="text-center py-12">
            <Badge variant="outline">No trending products found</Badge>
          </div>
        )}
      </div>
    </div>
  );
};

export default Trending;
