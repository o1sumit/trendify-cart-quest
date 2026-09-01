import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useToast } from "@/hooks/use-toast";
import { useAuthGate } from "@/hooks/useAuthGate";
import { productService } from "@/services/supabase/productService";
import {
  ArrowLeft,
  Heart,
  RotateCcw,
  Shield,
  ShoppingCart,
  Star,
  Truck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Page } from "@/components/layout/Page";

export const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isSaved, toggle } = useWishlist();
  const { toast } = useToast();
  const requireAuth = useAuthGate();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const { data: productDetails, isLoading } = useQuery<Product | null, Error>({
    queryKey: ["product", id],
    queryFn: async () => {
      if (!id) return null;
      return productService.getByIdOrSlug(id);
    },
    enabled: !!id,
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    setSelectedImageIndex(0);
  }, [id]);

  if (isLoading) {
    return (
      <Page width="wide">
        <Skeleton className="h-10 w-24 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Skeleton className="w-full aspect-square" />
          <div className="space-y-6">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </Page>
    );
  }

  if (!productDetails) {
    return (
      <Page width="narrow">
        <div className="text-center py-12">
          <h1 className="font-display text-2xl mb-2">Product not found</h1>
          <p className="text-muted-foreground mb-6">
            That item is no longer in the shop.
          </p>
          <Button onClick={() => navigate("/")}>
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Button>
        </div>
      </Page>
    );
  }

  const handleAddToCart = async () => {
    if (!requireAuth()) return;

    if (!productDetails.inStock) {
      toast({
        title: "Out of Stock",
        description: "This product is currently unavailable.",
        variant: "destructive",
      });
      return;
    }

    await addToCart(productDetails);
    toast({
      title: "Added to Cart",
      description: `${productDetails.name} has been added to your cart.`,
    });
  };

  const handleWishlist = async () => {
    if (!requireAuth()) return;
    const saved = isSaved(productDetails.id);
    await toggle(productDetails);
    toast({
      title: saved ? "Removed from Wishlist" : "Saved to Wishlist",
      description: productDetails.name,
    });
  };

  const discount = productDetails.originalPrice
    ? Math.round(
        ((productDetails.originalPrice - productDetails.price) /
          productDetails.originalPrice) *
          100
      )
    : 0;

  return (
    <Page width="wide">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 -ml-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg border">
              <img
                src={productDetails.images[selectedImageIndex]}
                alt={productDetails.name}
                className="w-full h-full object-cover"
              />
            </div>

            {productDetails.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {productDetails.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={cn(
                      "aspect-square overflow-hidden rounded-md border-2 transition-colors",
                      selectedImageIndex === index
                        ? "border-primary"
                        : "border-transparent hover:border-border"
                    )}
                  >
                    <img
                      src={image}
                      alt={`${productDetails.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge variant="outline">{productDetails.category}</Badge>
                {productDetails.trending && <Badge>Trending</Badge>}
                {discount > 0 && (
                  <Badge variant="destructive">{discount}% off</Badge>
                )}
              </div>

              <h1 className="font-display text-3xl md:text-4xl tracking-tight mb-4">
                {productDetails.name}
              </h1>

              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-foreground/80 text-foreground/80" />
                  <span className="font-medium">{productDetails.rating}</span>
                </div>
                <Separator orientation="vertical" className="h-4" />
                <span className="text-muted-foreground">
                  {productDetails.reviews} reviews
                </span>
              </div>

              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-3xl font-semibold">
                  ${productDetails.price.toFixed(2)}
                </span>
                {productDetails.originalPrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    ${productDetails.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>

              <p className="text-muted-foreground leading-relaxed mb-6">
                {productDetails.description}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex gap-3">
                <Button
                  size="lg"
                  className="flex-1"
                  onClick={handleAddToCart}
                  disabled={!productDetails.inStock}
                >
                  <ShoppingCart className="h-5 w-5" />
                  {productDetails.inStock ? "Add to cart" : "Sold out"}
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-11 w-11"
                  onClick={handleWishlist}
                >
                  <Heart
                    className={cn(
                      "h-5 w-5",
                      isSaved(productDetails.id) && "fill-primary text-primary"
                    )}
                  />
                </Button>
              </div>

              <div className="text-sm">
                {productDetails.inStock ? (
                  <span className="text-success">In stock</span>
                ) : (
                  <span className="text-destructive">Sold out</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              <Card>
                <CardContent className="p-3 sm:p-4 text-center">
                  <Truck className="h-5 w-5 mx-auto mb-2 text-primary" />
                  <div className="text-xs sm:text-sm font-medium">Free shipping</div>
                  <div className="text-[11px] sm:text-xs text-muted-foreground mt-1">
                    Orders over $50
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 sm:p-4 text-center">
                  <Shield className="h-5 w-5 mx-auto mb-2 text-primary" />
                  <div className="text-xs sm:text-sm font-medium">Warranty</div>
                  <div className="text-[11px] sm:text-xs text-muted-foreground mt-1">
                    1 year coverage
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 sm:p-4 text-center">
                  <RotateCcw className="h-5 w-5 mx-auto mb-2 text-primary" />
                  <div className="text-xs sm:text-sm font-medium">Returns</div>
                  <div className="text-[11px] sm:text-xs text-muted-foreground mt-1">
                    30-day policy
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <h3 className="font-medium mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {productDetails.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
    </Page>
  );
};
