import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Product } from "@/lib/types";
import { useUser } from "@/contexts/UserContext";
import { cartService } from "@/services/supabase/cartService";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
}

type CartAction =
  | { type: "SET_ITEMS"; items: CartItem[] }
  | { type: "ADD_ITEM"; product: Product }
  | { type: "REMOVE_ITEM"; productId: string }
  | { type: "UPDATE_QUANTITY"; productId: string; quantity: number }
  | { type: "CLEAR_CART" };

const CartContext = createContext<{
  state: CartState;
  isLoading: boolean;
  addToCart: (product: Product) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getItemCount: () => number;
} | null>(null);

const calculateTotal = (items: CartItem[]): number =>
  items.reduce((total, item) => total + item.product.price * item.quantity, 0);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "SET_ITEMS":
      return { items: action.items, total: calculateTotal(action.items) };

    case "ADD_ITEM": {
      const existingItem = state.items.find(
        (item) => item.product.id === action.product.id
      );

      const updatedItems = existingItem
        ? state.items.map((item) =>
            item.product.id === action.product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [...state.items, { product: action.product, quantity: 1 }];

      return { items: updatedItems, total: calculateTotal(updatedItems) };
    }

    case "REMOVE_ITEM": {
      const updatedItems = state.items.filter(
        (item) => item.product.id !== action.productId
      );
      return { items: updatedItems, total: calculateTotal(updatedItems) };
    }

    case "UPDATE_QUANTITY": {
      if (action.quantity <= 0) {
        const updatedItems = state.items.filter(
          (item) => item.product.id !== action.productId
        );
        return { items: updatedItems, total: calculateTotal(updatedItems) };
      }

      const updatedItems = state.items.map((item) =>
        item.product.id === action.productId
          ? { ...item, quantity: action.quantity }
          : item
      );
      return { items: updatedItems, total: calculateTotal(updatedItems) };
    }

    case "CLEAR_CART":
      return { items: [], total: 0 };

    default: {
      const _exhaustive: never = action;
      throw new Error(`Unhandled cart action: ${JSON.stringify(_exhaustive)}`);
    }
  }
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user, isAuthenticated } = useUser();
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadCart = async () => {
      if (isAuthenticated && user) {
        setIsLoading(true);
        try {
          const remoteItems = await cartService.getItems(user.id);
          dispatch({ type: "SET_ITEMS", items: remoteItems });
        } finally {
          setIsLoading(false);
        }
      } else {
        dispatch({ type: "CLEAR_CART" });
      }
    };

    void loadCart();
  }, [isAuthenticated, user]);

  const addToCart = async (product: Product) => {
    const existing = state.items.find((i) => i.product.id === product.id);
    const quantity = existing ? existing.quantity + 1 : 1;

    dispatch({ type: "ADD_ITEM", product });

    if (user) {
      await cartService.upsertItem(user.id, product.id, quantity);
    }
  };

  const removeFromCart = async (productId: string) => {
    dispatch({ type: "REMOVE_ITEM", productId });
    if (user) await cartService.removeItem(user.id, productId);
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", productId, quantity });

    if (user) {
      if (quantity <= 0) {
        await cartService.removeItem(user.id, productId);
      } else {
        await cartService.upsertItem(user.id, productId, quantity);
      }
    }
  };

  const clearCart = async () => {
    dispatch({ type: "CLEAR_CART" });
    if (user) await cartService.clear(user.id);
  };

  const getItemCount = () =>
    state.items.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        state,
        isLoading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
