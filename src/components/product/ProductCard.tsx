import { Star, Heart, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Product } from "@/lib/types";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useToast } from "@/hooks/use-toast";
import { useAuthGate } from "@/hooks/useAuthGate";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  className?: string;
  layout?: "grid" | "list";
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  className,
  layout = "grid",
}) => {
  const { addToCart } = useCart();
  const { isSaved, toggle } = useWishlist();
  const { toast } = useToast();
  const requireAuth = useAuthGate();
  const saved = isSaved(product.id);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!requireAuth()) return;

    if (!product?.inStock) {
      toast({
        title: "Out of Stock",
        description: "This product is currently unavailable.",
        variant: "destructive",
      });
      return;
    }

    await addToCart(product);
    toast({
      title: "Added to Cart",
      description: `${product?.name || "Product"} has been added to your cart.`,
    });
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!requireAuth()) return;

    await toggle(product);
    toast({
      title: saved ? "Removed from Wishlist" : "Saved to Wishlist",
      description: product.name,
    });
  };

  const discount = product?.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  const badges = (
    <div className="absolute top-2 left-2 right-12 z-[1] flex flex-wrap gap-1">
      {product?.trending && <Badge>Trending</Badge>}
      {discount > 0 && <Badge variant="destructive">{discount}%</Badge>}
      {!product?.inStock && <Badge variant="secondary">Sold out</Badge>}
    </div>
  );

  if (layout === "list") {
    return (
      <Card
        className={cn(
          "flex flex-col overflow-hidden border bg-card shadow-soft sm:flex-row",
          className
        )}
      >
        <Link
          to={`/product/${product.id}`}
          className="flex min-w-0 flex-1 flex-col sm:flex-row"
        >
          <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-muted sm:aspect-square sm:w-36 md:w-44">
            <img
              src={product?.images?.[0] || "/placeholder.svg"}
              alt={product?.name || "Product"}
              className="h-full w-full object-cover"
            />
            {badges}
          </div>
          <div className="flex min-w-0 flex-1 flex-col p-4">
            <h3 className="font-medium leading-snug">{product?.name || "Product"}</h3>
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
              {product?.description}
            </p>
            <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
              <Star className="h-3.5 w-3.5 fill-foreground/80 text-foreground/80" />
              <span>{product?.rating || 0}</span>
              <span>({product?.reviews || 0})</span>
            </div>
            <div className="mt-auto pt-3 flex items-baseline gap-2">
              <span className="text-lg font-semibold">
                ${product?.price?.toFixed(2) || "0.00"}
              </span>
              {product?.originalPrice && (
                <span className="text-xs text-muted-foreground line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>
        </Link>
        <div className="flex items-center justify-between gap-2 border-t p-4 sm:w-40 sm:flex-col sm:justify-center sm:border-l sm:border-t-0">
          <Button
            size="icon"
            variant="secondary"
            aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
            onClick={handleWishlist}
          >
            <Heart className={cn("h-4 w-4", saved && "fill-primary text-primary")} />
          </Button>
          <Button
            className="flex-1 sm:w-full"
            size="sm"
            onClick={handleAddToCart}
            disabled={!product?.inStock}
            variant={product?.inStock ? "default" : "secondary"}
          >
            <ShoppingCart className="h-4 w-4" />
            {product?.inStock ? "Add" : "Sold out"}
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "group flex h-full flex-col overflow-hidden border bg-card shadow-soft",
        className
      )}
    >
      <Link to={`/product/${product.id}`} className="flex flex-1 flex-col">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={product?.images?.[0] || "/placeholder.svg"}
            alt={product?.name || "Product"}
            className="h-full w-full object-cover"
          />
          {badges}
          <Button
            size="icon"
            variant="secondary"
            className="absolute top-2 right-2 z-[1]"
            aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
            onClick={handleWishlist}
          >
            <Heart
              className={cn("h-4 w-4", saved && "fill-primary text-primary")}
            />
          </Button>
        </div>

        <CardContent className="flex flex-1 flex-col p-3 sm:p-4">
          <h3 className="text-sm sm:text-base font-medium leading-snug line-clamp-2">
            {product?.name || "Product"}
          </h3>
          <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="h-3.5 w-3.5 fill-foreground/80 text-foreground/80" />
            <span>{product?.rating || 0}</span>
            <span>({product?.reviews || 0})</span>
          </div>
          <div className="mt-auto pt-3 flex items-baseline gap-2">
            <span className="text-base sm:text-lg font-semibold">
              ${product?.price?.toFixed(2) || "0.00"}
            </span>
            {product?.originalPrice && (
              <span className="text-xs text-muted-foreground line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </CardContent>
      </Link>

      <CardFooter className="p-3 pt-0 sm:p-4 sm:pt-0">
        <Button
          className="w-full"
          size="sm"
          onClick={handleAddToCart}
          disabled={!product?.inStock}
          variant={product?.inStock ? "default" : "secondary"}
        >
          <ShoppingCart className="h-4 w-4" />
          {product?.inStock ? "Add to cart" : "Sold out"}
        </Button>
      </CardFooter>
    </Card>
  );
};
