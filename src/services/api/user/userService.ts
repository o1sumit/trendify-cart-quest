import { doFetch, REQUEST_METHODS } from "@/services/fetcher";
import { USER_API_ENDPOINTS } from "./userEndPoint";


export default {
    getUserDetails: (userId: string) =>
        doFetch(`${USER_API_ENDPOINTS.GET_USER_DETAILS}/${userId}/orders`, REQUEST_METHODS.GET)

}