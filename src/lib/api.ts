import { mockProducts, Product } from './mock-data';

export const getAllProducts = (): Promise<Product[]> => {
    console.log('Fetching all products...');
    return new Promise(resolve => {
        // Simulate network delay
        setTimeout(() => {
            console.log('Products fetched.');
            resolve(mockProducts);
        }, 1000);
    });
};