import { Star, Heart, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Product } from '@/lib/mock-data';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, className }) => {
  const { addToCart } = useCart();
  const { toast } = useToast();
  console.log("product ", product)
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!product.inStock) {
      toast({
        title: "Out of Stock",
        description: "This product is currently unavailable.",
        variant: "destructive"
      });
      return;
    }

    addToCart(product);
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Card className={cn(
      "group overflow-hidden border-0 shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1",
      className
    )}>
      <Link to={`/product/${product?.name}`}>
        <div className="relative aspect-square overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 space-y-1">
            {product.trending && (
              <Badge className="bg-gradient-primary text-primary-foreground border-0">
                Trending
              </Badge>
            )}
            {discount > 0 && (
              <Badge variant="destructive">
                {discount}% OFF
              </Badge>
            )}
            {!product.inStock && (
              <Badge variant="secondary">
                Out of Stock
              </Badge>
            )}
          </div>

          {/* Wishlist Button */}
          <Button
            size="icon"
            variant="secondary"
            className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>

        <CardContent className="p-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>

            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{product.rating}</span>
              <span className="text-sm text-muted-foreground">
                ({product.reviews} reviews)
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-primary">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Link>

      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full"
          onClick={handleAddToCart}
          disabled={!product.inStock}
          variant={product.inStock ? "default" : "secondary"}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {product.inStock ? "Add to Cart" : "Out of Stock"}
        </Button>
      </CardFooter>
    </Card>
  );
};