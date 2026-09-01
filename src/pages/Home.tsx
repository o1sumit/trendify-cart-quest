import { TrendingUp, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product/ProductCard";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { productService } from "@/services/supabase/productService";
import { Skeleton } from "@/components/ui/skeleton";
import { productGridClass } from "@/components/layout/Page";

export const Home = () => {
  const { data: trendingProducts = [], isLoading: trendingLoading } = useQuery({
    queryKey: ["trending-products"],
    queryFn: () => productService.getTrending(),
  });

  const { data: featuredProducts = [], isLoading: featuredLoading } = useQuery({
    queryKey: ["featured-products"],
    queryFn: () => productService.getFeatured(3),
  });

  return (
    <div>
      <section className="bg-hero text-hero-foreground">
        <div className="container py-16 md:py-24">
          <div className="max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-hero-foreground/70">
              Curated for this season
            </p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.12] mt-4">
              Quiet luxury for everyday objects.
            </h1>
            <p className="mt-5 text-base md:text-lg text-hero-foreground/75 max-w-xl leading-relaxed">
              Discover well-made products, honest prices, and pieces worth keeping.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button size="lg" asChild>
                <Link to="/recommendations">Shop the collection</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-hero-foreground/20 bg-transparent text-hero-foreground hover:bg-hero-foreground/10 hover:text-hero-foreground"
                asChild
              >
                <Link to="/trending" className="inline-flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  What is trending
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="page-wrap">
        <div className="container">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-8">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">
                Trending
              </p>
              <h2 className="font-display text-2xl md:text-3xl mt-1">
                Popular this week
              </h2>
            </div>
            <Button variant="ghost" asChild className="self-start sm:self-auto">
              <Link to="/trending" className="inline-flex items-center gap-1">
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className={productGridClass}>
            {trendingLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-[3/4] w-full" />
                ))
              : trendingProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
          </div>
        </div>
      </section>

      <section className="bg-secondary/60 page-wrap">
        <div className="container">
          <div className="mb-8">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">
              Editors
            </p>
            <h2 className="font-display text-2xl md:text-3xl mt-1">Staff picks</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
            {featuredLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-[3/4] w-full" />
                ))
              : featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
          </div>
        </div>
      </section>
    </div>
  );
};
