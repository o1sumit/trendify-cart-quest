import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Edit3, Package, Heart, Settings, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@/contexts/UserContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useToast } from "@/hooks/use-toast";
import { orderService } from "@/services/supabase/orderService";
import { useQuery } from "@tanstack/react-query";
import type { Order } from "@/lib/types";
import { Page, PageHeader } from "@/components/layout/Page";

export const Profile = () => {
  const { user, updateUser } = useUser();
  const { items: wishlistItems } = useWishlist();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", email: "" });

  const { data: orderList = [] } = useQuery<Order[]>({
    queryKey: ["orders", user?.id],
    queryFn: () => orderService.getByUserId(user!.id),
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (user) {
      setEditForm({
        name: user.name || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const handleSaveProfile = async () => {
    if (!user) return;

    try {
      await updateUser(editForm);
      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your profile information has been saved successfully.",
      });
    } catch {
      toast({
        title: "Update failed",
        description: "Could not save profile changes.",
        variant: "destructive",
      });
    }
  };

  const getOrderStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "delivered":
        return "default";
      case "shipped":
        return "secondary";
      case "pending":
        return "outline";
      case "cancelled":
        return "destructive";
      default: {
        const _exhaustive: never = status;
        throw new Error(`Unhandled order status: ${_exhaustive}`);
      }
    }
  };

  if (!user) {
    return (
      <Page width="narrow">
        <div className="text-center py-12">
          <h1 className="font-display text-2xl mb-2">Please log in</h1>
          <p className="text-muted-foreground">
            You need to be logged in to view your profile.
          </p>
        </div>
      </Page>
    );
  }

  return (
    <Page width="wide">
        <PageHeader
          title="Account"
          description="Your details, wishlist, and order history."
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarImage src={user.avatar} alt={user.name || "User"} />
                  <AvatarFallback className="text-lg">
                    {user.name
                      ? user.name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")
                          .toUpperCase()
                      : "U"}
                  </AvatarFallback>
                </Avatar>

                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={editForm.name}
                        onChange={(e) =>
                          setEditForm({ ...editForm, name: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={editForm.email}
                        onChange={(e) =>
                          setEditForm({ ...editForm, email: e.target.value })
                        }
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleSaveProfile}>
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <h2 className="font-display text-xl tracking-tight">
                      {user.name || "User"}
                    </h2>
                    <p className="text-muted-foreground">{user.email}</p>
                    <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      Member since {new Date(user.joinDate).toLocaleDateString()}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsEditing(true)}
                      className="mt-4"
                    >
                      <Edit3 className="h-4 w-4" />
                      Edit profile
                    </Button>
                  </div>
                )}
              </CardHeader>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg font-medium">Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-primary" />
                    <span className="text-sm">Orders</span>
                  </div>
                  <span className="font-medium">{orderList.length}</span>
                </div>

                <Link
                  to="/wishlist"
                  className="flex items-center justify-between hover:text-primary"
                >
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-primary" />
                    <span className="text-sm">Wishlist</span>
                  </div>
                  <span className="font-medium">{wishlistItems.length}</span>
                </Link>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Status</span>
                  </div>
                  <Badge variant="default">Active</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-medium">
                  <Package className="h-5 w-5" />
                  <span>Orders</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {orderList.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-4">
                        <div>
                          <div className="font-medium">Order #{order.id.slice(0, 8)}</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(order.date).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="sm:text-right">
                          <Badge variant={getOrderStatusColor(order.status)}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                          <div className="text-lg font-semibold mt-1">
                            ${order.total.toFixed(2)}
                          </div>
                        </div>
                      </div>

                      <Separator className="my-3" />

                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between gap-3 text-sm"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <img
                                src={item.productImage}
                                alt={item.productName}
                                className="h-10 w-10 rounded object-cover shrink-0 bg-muted"
                              />
                              <div className="min-w-0">
                                <div className="font-medium truncate">{item.productName}</div>
                                <div className="text-muted-foreground">
                                  Qty: {item.quantity}
                                </div>
                              </div>
                            </div>
                            <div className="font-medium">${item.price.toFixed(2)}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {orderList.length === 0 && (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-medium mb-2">No orders yet</h3>
                    <p className="text-muted-foreground text-sm">
                      When you place orders, they'll appear here.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
    </Page>
  );
};
