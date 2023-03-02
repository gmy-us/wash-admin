import ShopTag from "./ShopTag";
import Station from "./Station";
import Storage from "./Storage";

export type FileType = string | 'FILE' | 'PIC' | 'BANNER'

export type ShopStatus = string | 'DECORATION' | 'IN_OPERATION'

export type ShopType = string | 'STAR_STORE' | 'NON_STAR_STORES'

export default interface Shop{
  /**
  * 店铺联系电话
  */
  phone?: string

  /**
  * 店铺地址
  */
  address?: string

  /**
  * 状态 0-正常营业 1-装修中
  */
  status?: ShopStatus

  /**
  * 店铺名称
  */
  name?: string

  /**
  * 纬度
  */
  latitude?: number

  /**
  * 经度
  */
  longitude?: number

  /**
  * 提现手续费
  */
  cashWithdrawalServiceFee?: number
  cashWithdrawalServiceFeeLabel?: number
  deposit?:number
  /**
  * 起步时间
  */
  startTime?: number

  /**
  * 起步价
  */
  startingPrice?: number

  /**
  * 超时单价
  */
  overtimeUnitPrice?: number

  /**
  * 1-自营
  * 2-独立
  */
  type?: ShopType

  logo?: string

  /**
  * 主键
  */
  id?: string

  /**
  * 是否已删除
  */
  deleted?: number

  /**
  * 创建时间
  */
  createTime?: any

  /**
  * 修改时间
  */
  updateTime?: any

  current?: number

  size?: number

  keywords?: string

  tags?:ShopTag[]
  stations?:Station[]

  logoFile?:Storage[]
  pics?:Storage[]
}
