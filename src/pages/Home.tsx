import { Sparkles, TrendingUp, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product/ProductCard';
import { mockProducts } from '@/lib/mock-data';
import { Link } from 'react-router-dom';

export const Home = () => {
  const trendingProducts = mockProducts.filter(product => product.trending);
  const featuredProducts = mockProducts.slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center bg-gradient-hero text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto max-w-4xl">
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm">
              <Sparkles className="h-4 w-4" />
              <span>Discover trending products</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Find Your Next
              <br />
              <span className="text-primary-glow">Favorite Product</span>
            </h1>
            
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Discover trending products, get personalized recommendations, and shop with confidence.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-primary">
                <Link to="/recommendations">
                  Get Recommendations
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                <TrendingUp className="h-5 w-5 mr-2" />
                View Trending
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Products Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center space-y-4 mb-12">
            <div className="inline-flex items-center space-x-2 text-primary">
              <TrendingUp className="h-5 w-5" />
              <span className="text-sm font-medium uppercase tracking-wide">
                Trending Now
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">
              What's Popular Today
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover the hottest products that everyone is talking about right now.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {trendingProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                className="hover:shadow-glow"
              />
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              <Link to="/recommendations">
                View All Products
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-16 px-4 bg-secondary/50">
        <div className="container mx-auto">
          <div className="text-center space-y-4 mb-12">
            <div className="inline-flex items-center space-x-2 text-primary">
              <Star className="h-5 w-5" />
              <span className="text-sm font-medium uppercase tracking-wide">
                Featured
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">
              Staff Picks
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Hand-picked products by our team for their quality and value.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                className="hover:shadow-strong"
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 text-center">
        <div className="container mx-auto max-w-3xl">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Start Shopping?
            </h2>
            <p className="text-muted-foreground text-lg">
              Join thousands of satisfied customers and discover your perfect products today.
            </p>
            <Button size="lg" className="shadow-glow">
              <Link to="/recommendations">
                Browse Recommendations
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};