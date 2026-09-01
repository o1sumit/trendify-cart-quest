import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, ShoppingCart, User, Menu, X, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/contexts/CartContext";
import { cn } from "@/lib/utils";
import { useUser } from "@/contexts/UserContext";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { getItemCount } = useCart();
  const { isAuthenticated, user, logout } = useUser();
  const cartCount = getItemCount();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsMenuOpen(false);
    }
  };

  const goToLogin = (next: string) => {
    navigate("/login", { state: { from: { pathname: next } } });
  };

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/recommendations" },
    { name: "Trending", href: "/trending" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container">
        <div className="flex h-16 items-center gap-3">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img src="/logo.svg" alt="" className="h-8 w-8 rounded-sm" />
            <span className="font-display text-lg sm:text-xl tracking-tight text-foreground">
              TrendCart
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-6">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors",
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="flex-1" />

          <form
            onSubmit={handleSearch}
            className="hidden lg:block w-full max-w-[220px] xl:max-w-xs"
          >
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 pl-9 bg-background"
              />
            </div>
          </form>

          <div className="flex items-center gap-1 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Wishlist"
              onClick={() =>
                isAuthenticated ? navigate("/wishlist") : goToLogin("/wishlist")
              }
            >
              <Heart className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              aria-label="Cart"
              onClick={() =>
                isAuthenticated ? navigate("/cart") : goToLogin("/cart")
              }
            >
              <ShoppingCart className="h-4 w-4" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold leading-none flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>

            {isAuthenticated ? (
              <div className="hidden sm:flex items-center gap-1 pl-1">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Profile"
                  onClick={() => navigate("/profile")}
                >
                  <User className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    await logout();
                    navigate("/");
                  }}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-1 pl-1">
                <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>
                  Login
                </Button>
                <Button size="sm" onClick={() => navigate("/signup")}>
                  Sign up
                </Button>
              </div>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden border-t py-4 space-y-4">
            <form onSubmit={handleSearch} className="lg:hidden">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 pl-9"
                />
              </div>
            </form>
            <nav className="flex flex-col gap-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="px-1 py-2 text-sm font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    className="px-1 py-2 text-sm font-medium sm:hidden"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {user?.name || "Profile"}
                  </Link>
                  <button
                    type="button"
                    className="px-1 py-2 text-sm font-medium text-left sm:hidden"
                    onClick={async () => {
                      await logout();
                      setIsMenuOpen(false);
                      navigate("/");
                    }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex gap-2 pt-2 sm:hidden">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate("/login");
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate("/signup");
                    }}
                  >
                    Sign up
                  </Button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
