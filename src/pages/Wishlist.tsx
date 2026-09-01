import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product/ProductCard";
import { Page, PageHeader, productGridClass } from "@/components/layout/Page";
import { LoadingState } from "@/components/layout/LoadingState";
import { useWishlist } from "@/contexts/WishlistContext";
import { Link } from "react-router-dom";

export const Wishlist = () => {
  const { items, isLoading } = useWishlist();

  if (isLoading) {
    return <LoadingState label="Loading wishlist" />;
  }

  if (items.length === 0) {
    return (
      <Page width="narrow">
        <div className="text-center py-12">
          <Heart className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
          <h1 className="font-display text-2xl mb-2">Your wishlist is empty</h1>
          <p className="text-muted-foreground mb-6">
            Save pieces you like and come back to them later.
          </p>
          <Button asChild>
            <Link to="/recommendations">Continue shopping</Link>
          </Button>
        </div>
      </Page>
    );
  }

  return (
    <Page>
      <PageHeader title={`Wishlist (${items.length})`} />
      <div className={productGridClass}>
        {items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </Page>
  );
};

export default Wishlist;
