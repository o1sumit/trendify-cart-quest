import { useState, useMemo } from 'react';
import { Grid3X3, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductFilters, ProductFilterState } from '@/components/product/ProductFilters';
import { Product } from '@/lib/mock-data';
import { Skeleton } from '@/components/ui/skeleton';
import productService from '@/services/api/product/productService';
import { useQuery } from '@tanstack/react-query';

export const Recommendations = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { data, isLoading, error } = useQuery<Product[], Error>({
    queryKey: ['all-products', 1, 20],
    queryFn: async () => {
      const result = await productService.getAllProducts(1, 20);
      const list = Array.isArray(result?.data?.data)
        ? (result.data.data as Product[])
        : [];
      return list;
    },
  });

  const [filters, setFilters] = useState<ProductFilterState>({
    categories: [],
    priceRange: [0, 500],
    rating: 0,
    inStock: false,
    tags: [],
    sortBy: 'recommended',
  });

  const products = useMemo(() => Array.isArray(data) ? data : [], [data]);

  // Get unique categories and tags safely
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
    let filtered = products.filter((product) => {
      if (!product) return false;

      // Category filter
      if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
        return false;
      }

      // Price range filter
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
        return false;
      }

      // Rating filter
      if (filters.rating > 0 && product.rating < filters.rating) {
        return false;
      }

      // Stock filter
      if (filters.inStock && !product.inStock) {
        return false;
      }

      // Tags filter
      if (filters.tags.length > 0) {
        const hasMatchingTag = filters.tags.some((tag) => product.tags?.includes(tag));
        if (!hasMatchingTag) return false;
      }

      return true;
    });

    // Sorting
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'newest':
          return b.id.localeCompare(a.id);
        case 'recommended':
        default:
          return (b.recommended ? 1 : 0) - (a.recommended ? 1 : 0) || b.rating - a.rating;
      }
    });

    return filtered;
  }, [products, filters]);

  const recommendedProducts = useMemo(
    () => filteredProducts.filter((p) => p?.recommended),
    [filteredProducts]
  );

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-3xl md:text-4xl font-bold">
            Personalized Recommendations
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover products tailored to your preferences and shopping history.
          </p>
        </div>

        {/* Recommended Section */}
        {!isLoading && recommendedProducts.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center space-x-2 mb-6">
              <Badge className="bg-gradient-primary text-primary-foreground border-0">
                Just for You
              </Badge>
              <h2 className="text-xl font-semibold">Based on your preferences</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recommendedProducts.slice(0, 4).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  className="hover:shadow-glow"
                />
              ))}
            </div>
          </div>
        )}

        {error && <div className="text-center text-red-500 mb-8">Failed to fetch products.</div>}

        {/* Filters and Products */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <ProductFilters
              onFiltersChange={setFilters}
              categories={categories}
              tags={allTags}
              maxPrice={maxPrice}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* View Mode Toggle */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-muted-foreground">
                Showing {filteredProducts.length} products
              </p>

              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Products Grid */}
            <div
              className={`grid gap-6 ${viewMode === 'grid'
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                : 'grid-cols-1'
                }`}
            >
              {isLoading ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="space-y-2">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))
              ) : (
                filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    className={viewMode === 'list' ? 'flex-row' : ''}
                  />
                ))
              )}
            </div>

            {!isLoading && filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="text-muted-foreground mb-4">
                  No products found matching your criteria.
                </div>
                <Button
                  variant="outline"
                  onClick={() =>
                    setFilters({
                      categories: [],
                      priceRange: [0, maxPrice],
                      rating: 0,
                      inStock: false,
                      tags: [],
                      sortBy: 'recommended',
                    })
                  }
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
