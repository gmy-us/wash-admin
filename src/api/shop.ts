import {call} from "../utils/http";
import Shop from "types/Shop";
import {Method} from "../utils/enums";
import {PageRes} from "types/res";

const shopDetailApi = (id: string) => call<Shop>(`shops/${id}`)
const updateShopStatusApi = (id: string, status: string) => call<boolean>(`shops/status/${id}?status=${encodeURIComponent(status)}`, Method.PUT)
const removeShopApi = (id: string) => call<boolean>(`shops/${id}`, Method.DELETE)
const shopPageApi = (shop: Shop) => call<PageRes<Shop>>(`shops`, Method.GET, {...shop})

const removeShopLogoAPi = (id: string) => call<boolean>(`shops/logo/${id}`, Method.DELETE)
const updateShopLogoApi = (id: string, logo: string) => call<boolean>(`shops/logo/${id}?logo=${encodeURIComponent(logo)}`, Method.PUT)
const saveShopApi = (shop: Shop) => call<Shop>(`shops`, Method.POST, shop)
const setAdminApi = (userShop: { userId: string, shopId: string, type: string }) => call<boolean>(`shops/admin`, Method.POST, userShop)
const removeAdminApi = (shopId: string, userId: string) => call<boolean>(`shops/admin/${shopId}/${userId}`, Method.DELETE)
export {
    shopDetailApi,
    shopPageApi,
    updateShopStatusApi,
    removeShopApi,
    updateShopLogoApi,
    removeShopLogoAPi,
    saveShopApi,
    setAdminApi,
    removeAdminApi
}