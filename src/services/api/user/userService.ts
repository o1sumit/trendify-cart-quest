import { doFetch, REQUEST_METHODS } from "@/services/fetcher";
import { USER_API_ENDPOINTS } from "./userEndPoint";


export default {
    getUserDetails: (userId: string) =>
        doFetch(`${USER_API_ENDPOINTS}`, REQUEST_METHODS.POST,
            {
                "query": "get user details of " + userId,
                "dbType": "mongodb",
                "dbUrl": "mongodb+srv://dixitmwa:DixitWa%40123!@cluster0.qiysaz9.mongodb.net/shopdb"
            }
        )

}