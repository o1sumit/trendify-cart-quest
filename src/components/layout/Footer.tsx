import { Link } from "react-router-dom";

export const Footer = () => (
  <footer className="border-t bg-card mt-auto">
    <div className="container py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
      <div>
        <p className="font-display text-lg text-foreground">TrendCart</p>
        <p className="text-sm text-muted-foreground mt-1">
          Quiet luxury for everyday objects.
        </p>
      </div>
      <nav className="flex items-center gap-5 text-sm text-muted-foreground">
        <Link to="/trending" className="hover:text-foreground">
          Trending
        </Link>
        <Link to="/recommendations" className="hover:text-foreground">
          Shop
        </Link>
      </nav>
    </div>
    <div className="border-t">
      <div className="container py-4 text-xs text-muted-foreground">
        © {new Date().getFullYear()} TrendCart
      </div>
    </div>
  </footer>
);
