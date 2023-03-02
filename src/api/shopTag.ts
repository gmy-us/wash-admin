import {call} from "../utils/http";
import {TagRes} from "types/res";
import {Method} from "../utils/enums";
import ShopTag from "types/ShopTag";

const shopTagApi = (shopId: string) => call<TagRes>(`shopTags/${shopId}`)
const removeTagApi = (shopId: string, tag: string) => call<boolean>(`shopTags/${shopId}/${encodeURIComponent(tag)}`, Method.DELETE)
const addTagApi = (shopTag: ShopTag) => call<boolean>(`shopTags`, Method.POST, shopTag)
export {shopTagApi, removeTagApi, addTagApi}