import { useState } from "react";
import { Filter, X, ChevronDown, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface ProductFiltersProps {
  onFiltersChange: (filters: ProductFilterState) => void;
  categories: string[];
  tags: string[];
  maxPrice: number;
}

export type ProductSortBy =
  | "recommended"
  | "price-low"
  | "price-high"
  | "rating"
  | "name"
  | "newest";

export interface ProductFilterState {
  categories: string[];
  priceRange: [number, number];
  rating: number;
  inStock: boolean;
  tags: string[];
  sortBy: ProductSortBy;
}

const SORT_OPTIONS: { value: ProductSortBy; label: string }[] = [
  { value: "recommended", label: "Recommended" },
  { value: "price-low", label: "Price: low to high" },
  { value: "price-high", label: "Price: high to low" },
  { value: "rating", label: "Highest rated" },
  { value: "name", label: "Name A–Z" },
  { value: "newest", label: "Newest" },
];

function isProductSortBy(value: string): value is ProductSortBy {
  return SORT_OPTIONS.some((option) => option.value === value);
}

export const ProductFilters = ({
  onFiltersChange,
  categories,
  tags,
  maxPrice,
}: ProductFiltersProps) => {
  const [filters, setFilters] = useState<ProductFilterState>({
    categories: [],
    priceRange: [0, maxPrice || 500],
    rating: 0,
    inStock: false,
    tags: [],
    sortBy: "recommended",
  });

  const [isOpen, setIsOpen] = useState(false);

  const updateFilters = (newFilters: Partial<ProductFilterState>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const clearFilters = () => {
    const clearedFilters: ProductFilterState = {
      categories: [],
      priceRange: [0, maxPrice || 500],
      rating: 0,
      inStock: false,
      tags: [],
      sortBy: "recommended",
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const activeFiltersCount =
    filters.categories.length +
    filters.tags.length +
    (filters.rating > 0 ? 1 : 0) +
    (filters.inStock ? 1 : 0) +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < (maxPrice || 500)
      ? 1
      : 0);

  return (
    <div className="bg-card border rounded-lg p-4">
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2 min-w-0">
          <Filter className="h-4 w-4 shrink-0" />
          <h3 className="font-medium">Filters</h3>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary">{activeFiltersCount}</Badge>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {activeFiltersCount > 0 && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-3.5 w-3.5" />
              Clear
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden"
            aria-expanded={isOpen}
            aria-label={isOpen ? "Hide filters" : "Show filters"}
          >
            <ChevronDown
              className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
            />
          </Button>
        </div>
      </div>

      <div className={`space-y-6 ${isOpen ? "block" : "hidden lg:block"}`}>
        <div>
          <label className="text-sm font-medium mb-2 block">Sort by</label>
          <Select
            value={filters.sortBy}
            onValueChange={(value) => {
              if (isProductSortBy(value)) {
                updateFilters({ sortBy: value });
              }
            }}
          >
            <SelectTrigger className="h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex h-9 w-full items-center justify-between">
            <span className="text-sm font-medium">Categories</span>
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 space-y-2">
            {categories.map((category) => (
              <div key={category} className="flex items-center gap-2">
                <Checkbox
                  id={`category-${category}`}
                  checked={filters.categories.includes(category)}
                  onCheckedChange={(checked) => {
                    const newCategories = checked
                      ? [...filters.categories, category]
                      : filters.categories.filter((c) => c !== category);
                    updateFilters({ categories: newCategories });
                  }}
                />
                <label
                  htmlFor={`category-${category}`}
                  className="text-sm cursor-pointer"
                >
                  {category}
                </label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex h-9 w-full items-center justify-between">
            <span className="text-sm font-medium">Price</span>
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2">
            <div className="px-1">
              <Slider
                value={filters.priceRange}
                onValueChange={(value) =>
                  updateFilters({ priceRange: value as [number, number] })
                }
                max={maxPrice || 500}
                step={10}
                className="mb-3"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>${filters.priceRange[0]}</span>
                <span>${filters.priceRange[1]}</span>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex h-9 w-full items-center justify-between">
            <span className="text-sm font-medium">Minimum rating</span>
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 space-y-2">
            {[4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center gap-2">
                <Checkbox
                  id={`rating-${rating}`}
                  checked={filters.rating === rating}
                  onCheckedChange={(checked) => {
                    updateFilters({ rating: checked ? rating : 0 });
                  }}
                />
                <label
                  htmlFor={`rating-${rating}`}
                  className="text-sm cursor-pointer flex items-center gap-1"
                >
                  {rating}+
                  <Star className="h-3.5 w-3.5 fill-foreground/80 text-foreground/80" />
                </label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        <div className="flex items-center gap-2">
          <Checkbox
            id="in-stock"
            checked={filters.inStock}
            onCheckedChange={(checked) => updateFilters({ inStock: !!checked })}
          />
          <label htmlFor="in-stock" className="text-sm cursor-pointer">
            In stock only
          </label>
        </div>

        {tags.length > 0 && (
          <Collapsible>
            <CollapsibleTrigger className="flex h-9 w-full items-center justify-between">
              <span className="text-sm font-medium">Features</span>
              <ChevronDown className="h-4 w-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2 space-y-2">
              {tags.map((tag) => (
                <div key={tag} className="flex items-center gap-2">
                  <Checkbox
                    id={`tag-${tag}`}
                    checked={filters.tags.includes(tag)}
                    onCheckedChange={(checked) => {
                      const newTags = checked
                        ? [...filters.tags, tag]
                        : filters.tags.filter((t) => t !== tag);
                      updateFilters({ tags: newTags });
                    }}
                  />
                  <label
                    htmlFor={`tag-${tag}`}
                    className="text-sm cursor-pointer capitalize"
                  >
                    {tag.replace("-", " ")}
                  </label>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>
        )}
      </div>
    </div>
  );
};
