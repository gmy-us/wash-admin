import {call} from "../utils/http";
import {LoginParam} from "types/param";
import User from "types/User";
import {Method} from "../utils/enums";


const loginApi=(loginParam:LoginParam)=>call<User>('auth',Method.POST,loginParam)
export {loginApi}