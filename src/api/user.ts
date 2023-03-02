import {call} from "../utils/http";
import ShopUser from "types/ShopUser";
import User from "types/User";
import {Method} from "../utils/enums";
import {PageRes} from "types/res";

const shopUserApi = (shopId: string) => call<ShopUser>(`users/shop/${shopId}`)
const merchantApi = (shopId: string, pageParam: User) => call<PageRes<User>>(`users/merchant/${shopId}`, Method.GET, {...pageParam})
export {
    shopUserApi, merchantApi
}