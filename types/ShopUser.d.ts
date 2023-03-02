import User from "./User";

export type UserType = string | 'ADMIN' | 'USER' | 'MERCHANT'


export default interface ShopUser{
  storeManager?: User

  admins?: User[]
}
