import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import productService from '@/services/api/product/productService';
import { ArrowLeft, Heart, RotateCcw, Shield, ShoppingCart, Star, Truck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export const ProductDetail = () => {

  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [productDetails, setProductDetails] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const fetchProductDetails = async () => {
    try {
      const result = await productService.getProductById(id)
      setProductDetails(result?.data?.data[0])
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchProductDetails()
  }, [])

  if (!productDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!productDetails.inStock) {
      toast({
        title: "Out of Stock",
        description: "This product is currently unavailable.",
        variant: "destructive"
      });
      return;
    }

    addToCart(productDetails);
    toast({
      title: "Added to Cart",
      description: `${productDetails.name} has been added to your cart.`,
    });
  };

  const discount = productDetails.originalPrice
    ? Math.round(((productDetails.originalPrice - productDetails.price) / productDetails.originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
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
                    className={`aspect-square overflow-hidden rounded-md border-2 transition-colors ${selectedImageIndex === index
                      ? 'border-primary'
                      : 'border-transparent hover:border-muted-foreground'
                      }`}
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

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Badge variant="outline">{productDetails.category}</Badge>
                {productDetails.trending && (
                  <Badge className="bg-gradient-primary text-primary-foreground border-0">
                    Trending
                  </Badge>
                )}
                {discount > 0 && (
                  <Badge variant="destructive">
                    {discount}% OFF
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                {productDetails.name}
              </h1>

              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center space-x-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{productDetails.rating}</span>
                </div>
                <Separator orientation="vertical" className="h-4" />
                <span className="text-muted-foreground">
                  {productDetails.reviews} reviews
                </span>
              </div>

              <div className="flex items-center space-x-3 mb-6">
                <span className="text-3xl font-bold text-primary">
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

            {/* Actions */}
            <div className="space-y-4">
              <div className="flex space-x-4">
                <Button
                  size="lg"
                  className="flex-1"
                  onClick={handleAddToCart}
                  disabled={!productDetails.inStock}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {productDetails.inStock ? "Add to Cart" : "Out of Stock"}
                </Button>

                <Button size="lg" variant="outline">
                  <Heart className="h-5 w-5" />
                </Button>
              </div>

              <div className="text-sm text-muted-foreground">
                {productDetails.inStock ? (
                  <span className="text-success">✓ In Stock</span>
                ) : (
                  <span className="text-destructive">✗ Out of Stock</span>
                )}
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Truck className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <div className="text-sm font-medium">Free Shipping</div>
                  <div className="text-xs text-muted-foreground">On orders over $50</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <Shield className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <div className="text-sm font-medium">Warranty</div>
                  <div className="text-xs text-muted-foreground">1 year coverage</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <RotateCcw className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <div className="text-sm font-medium">Returns</div>
                  <div className="text-xs text-muted-foreground">30-day policy</div>
                </CardContent>
              </Card>
            </div>

            {/* Tags */}
            <div>
              <h3 className="font-medium mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {productDetails.tags.map(tag => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};