import { doFetch, REQUEST_METHODS } from "@/services/fetcher";
import { PRODUCTS_API_ENDPOINTS } from "./productEndPoint";


export default {
    getAllProducts: (page: number, size: number) =>
        doFetch(`${PRODUCTS_API_ENDPOINTS}`, REQUEST_METHODS.POST,
            {
                "query": "get latest 20 product",
                "dbType": "mongodb",
                "dbUrl": "mongodb+srv://dixitmwa:DixitWa%40123!@cluster0.qiysaz9.mongodb.net/shopdb"
            }
        ),
    getProductById: (id: string) =>
        doFetch(`${PRODUCTS_API_ENDPOINTS}`, REQUEST_METHODS.POST,
            {
                "query": "get detail of " + id + " product",
                "dbType": "mongodb",
                "dbUrl": "mongodb+srv://dixitmwa:DixitWa%40123!@cluster0.qiysaz9.mongodb.net/shopdb"
            }
        ),

}