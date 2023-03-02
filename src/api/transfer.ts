import {call} from "../utils/http";
import {Order, Transfer} from "types/model";


const confirmTransferApi = (transfer:Transfer) => call<Order>('transfers/confirm','POST',transfer)
export {
    confirmTransferApi
}