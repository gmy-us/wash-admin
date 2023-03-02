import {call} from "../utils/http";
import Storage from "types/Storage";
import {Method} from "../utils/enums";

const bannerApi=()=>call<Storage[]>('storages/banner')
const addStorageApi=(storage:Storage)=>call<Storage>(`storages`,Method.POST,storage)
const removeStorageApi=(id:string)=>call<boolean>(`storages/${id}`,Method.DELETE)
export {
    bannerApi,addStorageApi,removeStorageApi
}