import {call} from "../utils/http";
import Station from "../../types/Station";
import {Method} from "../utils/enums";

const stationsByShopIdApi = (shopId: string) => call<Station[]>(`stations/byShopId/${shopId}`)
const getStationApi = (id: string) => call<Station>(`stations/${id}`)
const saveStationApi = (station: Station) => call<boolean>(`stations`, Method.POST, station)
const removeStationApi = (id: string) => call<boolean>(`stations/${id}`, Method.DELETE)
const stationPicApi = (shopId: string) => call<Station[]>(`stations/pic/${shopId}`)
export {
    stationsByShopIdApi, getStationApi, saveStationApi, removeStationApi,stationPicApi
}