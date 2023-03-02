

export type UserType = string | 'ADMIN' | 'USER' | 'MERCHANT'

export interface Transfer{
  shopId?: number

  plate?: string

  cardType?: string

  name?: string

  phone?: string

  balance?: number

  password?: string

  transfer?: number

  /**
  * 主键
  */
  id?: number

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
}

export default interface User{
  /**
  * 昵称
  */
  nickname?: string

  /**
  * 真名
  */
  name?: string

  /**
  * 头像
  */
  avatar?: string

  /**
  * 手机
  */
  phone?: string

  /**
  * 状态
  */
  status?: number

  /**
  * 微信openid 一般微信用户有 但不保证管理员没有
  */
  wxOpenId?: string

  /**
  * 支付宝小程序openId
  */
  aliOpenId?: string

  /**
  * 用户类型 1-车悟净 2-华锦至上V
  */
  type?: UserType

  transfers?: Transfer[]

  /**
  * 主键
  */
  id?: number

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
}
