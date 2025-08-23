export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  images: string[];
  category: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  trending?: boolean;
  recommended?: boolean;
  tags: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  joinDate: string;
}

export interface Order {
  id: string;
  date: string;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: {
    productId: string;
    quantity: number;
    price: number;
  }[];
}

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Wireless Bluetooth Headphones',
    price: 199.99,
    originalPrice: 249.99,
    description: 'Premium wireless headphones with active noise cancellation, 30-hour battery life, and crystal-clear audio quality. Perfect for music lovers and professionals.',
    images: [
      '/src/assets/headphones-1.jpg',
      '/src/assets/headphones-2.jpg'
    ],
    category: 'Electronics',
    rating: 4.8,
    reviews: 1284,
    inStock: true,
    trending: true,
    recommended: true,
    tags: ['wireless', 'bluetooth', 'noise-cancellation', 'premium']
  },
  {
    id: '2',
    name: 'Smart Fitness Watch',
    price: 299.99,
    originalPrice: 399.99,
    description: 'Advanced fitness tracking with heart rate monitoring, GPS, and smartphone integration. Track your workouts and stay connected.',
    images: [
      '/src/assets/watch-1.jpg',
      '/src/assets/watch-2.jpg'
    ],
    category: 'Wearables',
    rating: 4.6,
    reviews: 892,
    inStock: true,
    trending: true,
    recommended: false,
    tags: ['fitness', 'smartwatch', 'health', 'gps']
  },
  {
    id: '3',
    name: 'Portable Laptop Stand',
    price: 79.99,
    description: 'Ergonomic aluminum laptop stand with adjustable height and angle. Improve your posture and productivity.',
    images: [
      '/src/assets/laptop-stand.jpg'
    ],
    category: 'Accessories',
    rating: 4.4,
    reviews: 567,
    inStock: true,
    trending: false,
    recommended: true,
    tags: ['laptop', 'ergonomic', 'portable', 'aluminum']
  },
  {
    id: '4',
    name: 'Wireless Charging Pad',
    price: 49.99,
    originalPrice: 69.99,
    description: 'Fast wireless charging pad compatible with all Qi-enabled devices. Sleek design with LED indicators.',
    images: [
      '/src/assets/charging-pad.jpg'
    ],
    category: 'Electronics',
    rating: 4.3,
    reviews: 324,
    inStock: true,
    trending: true,
    recommended: false,
    tags: ['wireless', 'charging', 'qi', 'fast-charge']
  },
  {
    id: '5',
    name: 'Gaming Mechanical Keyboard',
    price: 159.99,
    description: 'RGB backlit mechanical keyboard with customizable keys, perfect for gaming and productivity.',
    images: [
      '/src/assets/keyboard.jpg'
    ],
    category: 'Gaming',
    rating: 4.7,
    reviews: 756,
    inStock: false,
    trending: false,
    recommended: true,
    tags: ['gaming', 'mechanical', 'rgb', 'keyboard']
  },
  {
    id: '6',
    name: 'Ultra HD Webcam',
    price: 129.99,
    description: '4K webcam with auto-focus and built-in microphone. Perfect for video calls and streaming.',
    images: [
      '/src/assets/webcam.jpg'
    ],
    category: 'Electronics',
    rating: 4.5,
    reviews: 433,
    inStock: true,
    trending: false,
    recommended: true,
    tags: ['webcam', '4k', 'streaming', 'video-calls']
  }
];

export const mockUser: User = {
  id: 'user-1',
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  avatar: '/placeholder.svg',
  joinDate: '2023-01-15'
};

export const mockOrders: Order[] = [
  {
    id: 'order-1',
    date: '2024-01-15',
    status: 'delivered',
    total: 249.98,
    items: [
      { productId: '1', quantity: 1, price: 199.99 },
      { productId: '4', quantity: 1, price: 49.99 }
    ]
  },
  {
    id: 'order-2',
    date: '2024-01-10',
    status: 'shipped',
    total: 299.99,
    items: [
      { productId: '2', quantity: 1, price: 299.99 }
    ]
  },
  {
    id: 'order-3',
    date: '2024-01-05',
    status: 'delivered',
    total: 79.99,
    items: [
      { productId: '3', quantity: 1, price: 79.99 }
    ]
  }
];