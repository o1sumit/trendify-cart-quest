import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { Page, PageHeader, productGridClass } from "@/components/layout/Page";
import { useQuery } from "@tanstack/react-query";
import { productService } from "@/services/supabase/productService";
import { Skeleton } from "@/components/ui/skeleton";

export const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const { data: searchResults = [], isLoading } = useQuery({
    queryKey: ["search-products", query],
    queryFn: () => productService.search(query),
    enabled: query.trim().length > 0,
  });

  return (
    <Page>
      <PageHeader
        title="Search"
        description={
          !query
            ? "Use the search bar to find products."
            : isLoading
              ? `Searching for “${query}”`
              : `${searchResults.length} result${searchResults.length !== 1 ? "s" : ""} for “${query}”`
        }
      />

      {isLoading ? (
        <div className={productGridClass}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[3/4] w-full" />
          ))}
        </div>
      ) : searchResults.length > 0 ? (
        <div className={productGridClass}>
          {searchResults.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-secondary flex items-center justify-center">
            <Search className="h-5 w-5 text-muted-foreground" />
          </div>
          <h3 className="font-display text-xl">
            {query ? "No matches" : "Start searching"}
          </h3>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">
            {query
              ? `Nothing matched “${query}”. Try another keyword.`
              : "Search by name, category, or description."}
          </p>
        </div>
      )}
    </Page>
  );
};
