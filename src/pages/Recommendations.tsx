import { useState, useMemo } from "react";
import { Grid3X3, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductFilters, type ProductFilterState, type ProductSortBy } from "@/components/product/ProductFilters";
import { Product } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Page, PageHeader, productGridClass } from "@/components/layout/Page";
import { productService } from "@/services/supabase/productService";
import { useQuery } from "@tanstack/react-query";

export const Recommendations = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { data, isLoading, error } = useQuery<Product[], Error>({
    queryKey: ["all-products"],
    queryFn: () => productService.getAll(),
  });

  const [filters, setFilters] = useState<ProductFilterState>({
    categories: [],
    priceRange: [0, 500],
    rating: 0,
    inStock: false,
    tags: [],
    sortBy: "recommended",
  });

  const products = useMemo(() => (Array.isArray(data) ? data : []), [data]);

  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p?.category).filter(Boolean))),
    [products]
  );

  const allTags = useMemo(
    () => Array.from(new Set(products.flatMap((p) => p?.tags || []))),
    [products]
  );

  const maxPrice = useMemo(
    () => (products.length > 0 ? Math.max(...products.map((p) => p?.price || 0)) : 500),
    [products]
  );

  const filteredProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      if (!product) return false;

      if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
        return false;
      }

      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
        return false;
      }

      if (filters.rating > 0 && product.rating < filters.rating) {
        return false;
      }

      if (filters.inStock && !product.inStock) {
        return false;
      }

      if (filters.tags.length > 0) {
        const hasMatchingTag = filters.tags.some((tag) => product.tags?.includes(tag));
        if (!hasMatchingTag) return false;
      }

      return true;
    });

    return [...filtered].sort((a, b) => {
      const sortBy: ProductSortBy = filters.sortBy;
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "name":
          return a.name.localeCompare(b.name);
        case "newest":
          return (b.createdAt || b.id).localeCompare(a.createdAt || a.id);
        case "recommended":
          return (b.recommended ? 1 : 0) - (a.recommended ? 1 : 0) || b.rating - a.rating;
        default: {
          const _exhaustive: never = sortBy;
          throw new Error(`Unhandled sort: ${_exhaustive}`);
        }
      }
    });
  }, [products, filters]);

  const recommendedProducts = useMemo(
    () => filteredProducts.filter((p) => p?.recommended),
    [filteredProducts]
  );

  return (
    <Page>
      <PageHeader
        title="The shop"
        description="Browse the full collection. Filter by category, price, and rating."
      />

        {!isLoading && recommendedProducts.length > 0 && (
          <div className="mb-10">
            <h2 className="font-display text-xl mb-5">Picked for you</h2>
            <div className={productGridClass}>
              {recommendedProducts.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}

        {error && (
          <p className="text-destructive mb-6">Failed to fetch products.</p>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          <div className="lg:col-span-1 lg:sticky lg:top-24 h-fit">
            <ProductFilters
              onFiltersChange={setFilters}
              categories={categories}
              tags={allTags}
              maxPrice={maxPrice}
            />
          </div>

          <div className="lg:col-span-3">
            <div className="flex items-center justify-between gap-3 mb-5">
              <p className="text-sm text-muted-foreground">
                {isLoading
                  ? "Loading…"
                  : `${filteredProducts.length} products`}
              </p>
              <div className="flex h-9 items-center rounded-md border bg-card overflow-hidden">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  className="rounded-none"
                  aria-label="Grid view"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                  className="rounded-none"
                  aria-label="List view"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5"
                  : "grid grid-cols-1 gap-4"
              }
            >
              {isLoading
                ? Array.from({ length: 6 }).map((_, index) => (
                    <Skeleton key={index} className="aspect-[3/4] w-full" />
                  ))
                : filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      layout={viewMode}
                    />
                  ))}
            </div>

            {!isLoading && filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  No products match those filters.
                </p>
                <Button
                  variant="outline"
                  onClick={() =>
                    setFilters({
                      categories: [],
                      priceRange: [0, maxPrice],
                      rating: 0,
                      inStock: false,
                      tags: [],
                      sortBy: "recommended",
                    })
                  }
                >
                  Clear filters
                </Button>
              </div>
            )}
          </div>
        </div>
    </Page>
  );
};
