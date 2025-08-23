import { doFetch, REQUEST_METHODS } from "@/services/fetcher";
import { PRODUCTS_API_ENDPOINTS } from "./productEndPoint";


export default {
    getAllProducts: (page: number, size: number) =>
        doFetch(`${PRODUCTS_API_ENDPOINTS.FETCH_ALL_PRODUCTS}?page=${page}&limit=${size}`, REQUEST_METHODS.GET),
    getProductById: (id: string) =>
        doFetch(`${PRODUCTS_API_ENDPOINTS.FETCH_ALL_PRODUCTS}/${id}`, REQUEST_METHODS.GET),

}