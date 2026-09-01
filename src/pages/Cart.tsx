import { Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import { orderService } from "@/services/supabase/orderService";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Page } from "@/components/layout/Page";

export const Cart = () => {
  const { state, updateQuantity, removeFromCart, clearCart } = useCart();
  const { isAuthenticated } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [checkingOut, setCheckingOut] = useState(false);

  const handleQuantityChange = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      await removeFromCart(productId);
      toast({
        title: "Item removed",
        description: "The item has been removed from your cart.",
      });
    } else {
      await updateQuantity(productId, newQuantity);
    }
  };

  const handleRemoveItem = async (productId: string, productName: string) => {
    await removeFromCart(productId);
    toast({
      title: "Item removed",
      description: `${productName} has been removed from your cart.`,
    });
  };

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Login required",
        description: "Please log in to complete checkout.",
      });
      navigate("/login", { state: { from: { pathname: "/cart" } } });
      return;
    }

    setCheckingOut(true);
    try {
      await orderService.checkout(0.08);
      await clearCart();
      toast({
        title: "Order placed",
        description: "Your order was created successfully.",
      });
      navigate("/profile");
    } catch {
      toast({
        title: "Checkout failed",
        description: "Could not place your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setCheckingOut(false);
    }
  };

  if (state.items.length === 0) {
    return (
      <Page width="narrow">
        <div className="text-center py-12">
          <ShoppingBag className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
          <h1 className="font-display text-2xl mb-2">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6">
            Add something you like, then come back here to check out.
          </p>
          <Button asChild>
            <Link to="/recommendations">Continue shopping</Link>
          </Button>
        </div>
      </Page>
    );
  }

  return (
    <Page width="wide">
      <h1 className="font-display text-3xl mb-8">Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0">
            <CardTitle className="text-lg font-medium">
              {state.items.length} item{state.items.length === 1 ? "" : "s"}
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                await clearCart();
                toast({
                  title: "Cart cleared",
                  description: "All items have been removed.",
                });
              }}
            >
              Clear
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {state.items.map((item) => (
              <div
                key={item.product.id}
                className="flex flex-col sm:flex-row sm:items-center gap-4"
              >
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="h-20 w-20 rounded-md object-cover bg-muted shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{item.product.name}</h3>
                  <p className="text-sm text-muted-foreground">{item.product.category}</p>
                  <p className="mt-1 font-semibold">${item.product.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <div className="flex items-center gap-1">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() =>
                        handleQuantityChange(item.product.id, item.quantity - 1)
                      }
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center text-sm font-medium">
                      {item.quantity}
                    </span>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() =>
                        handleQuantityChange(item.product.id, item.quantity + 1)
                      }
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() =>
                        handleRemoveItem(item.product.id, item.product.name)
                      }
                      className="text-destructive hover:text-destructive mt-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="h-fit lg:sticky lg:top-24">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${state.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-success">Free</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${(state.total * 0.08).toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-base font-semibold">
                <span>Total</span>
                <span>${(state.total * 1.08).toFixed(2)}</span>
              </div>
            </div>
            <Button
              className="w-full"
              size="lg"
              onClick={handleCheckout}
              disabled={checkingOut}
            >
              {checkingOut ? "Processing..." : "Checkout"}
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/recommendations">Continue shopping</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </Page>
  );
};
