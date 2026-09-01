import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "@/lib/types";
import { useUser } from "@/contexts/UserContext";
import { wishlistService } from "@/services/supabase/wishlistService";

interface WishlistContextType {
  items: Product[];
  isLoading: boolean;
  isSaved: (productId: string) => boolean;
  toggle: (product: Product) => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user, isAuthenticated } = useUser();
  const [items, setItems] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const load = useCallback(async () => {
    if (!user) {
      setItems([]);
      return;
    }

    setIsLoading(true);
    try {
      setItems(await wishlistService.getItems(user.id));
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (isAuthenticated && user) {
      void load();
    } else {
      setItems([]);
    }
  }, [isAuthenticated, user, load]);

  const isSaved = useCallback(
    (productId: string) => items.some((item) => item.id === productId),
    [items]
  );

  const toggle = useCallback(
    async (product: Product) => {
      if (!user) return;

      const saved = items.some((item) => item.id === product.id);
      if (saved) {
        await wishlistService.remove(user.id, product.id);
        setItems((current) => current.filter((item) => item.id !== product.id));
        return;
      }

      await wishlistService.add(user.id, product.id);
      setItems((current) =>
        current.some((item) => item.id === product.id)
          ? current
          : [product, ...current]
      );
    },
    [items, user]
  );

  const value = useMemo(
    () => ({ items, isLoading, isSaved, toggle }),
    [items, isLoading, isSaved, toggle]
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
