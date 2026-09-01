import { ProductCard } from "@/components/product/ProductCard";
import { Page, PageHeader, productGridClass } from "@/components/layout/Page";
import { Skeleton } from "@/components/ui/skeleton";
import { productService } from "@/services/supabase/productService";
import { useQuery } from "@tanstack/react-query";

export const Trending = () => {
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ["trending-products"],
    queryFn: () => productService.getTrending(),
  });

  return (
    <Page>
      <PageHeader
        title="Trending now"
        description="What people are buying this week."
        align="left"
      />

      {error && (
        <p className="text-destructive mb-6">Failed to load trending products.</p>
      )}

      <div className={productGridClass}>
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[3/4] w-full" />
            ))
          : products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
      </div>

      {!isLoading && products.length === 0 && (
        <p className="text-center text-muted-foreground py-16">
          No trending products yet.
        </p>
      )}
    </Page>
  );
};

export default Trending;
