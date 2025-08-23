import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { ProductCard } from '@/components/product/ProductCard';
import { mockProducts } from '@/lib/mock-data';

export const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  // Simple search implementation
  const searchResults = mockProducts.filter(product => 
    product.name.toLowerCase().includes(query.toLowerCase()) ||
    product.description.toLowerCase().includes(query.toLowerCase()) ||
    product.category.toLowerCase().includes(query.toLowerCase()) ||
    product.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Search className="h-6 w-6 text-primary" />
            <h1 className="text-2xl md:text-3xl font-bold">
              Search Results
            </h1>
          </div>
          
          <div className="text-muted-foreground">
            {query ? (
              <>
                Showing {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for{' '}
                <span className="font-medium text-foreground">"{query}"</span>
              </>
            ) : (
              'Please enter a search term'
            )}
          </div>
        </div>

        {/* Results */}
        {searchResults.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {searchResults.map(product => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        ) : query ? (
          <div className="text-center py-12">
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">No results found</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                We couldn't find any products matching "{query}". Try searching with different keywords or browse our categories.
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">Start your search</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Use the search bar above to find products by name, category, or description.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};