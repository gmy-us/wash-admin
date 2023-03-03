export type StationStatus = string | 'IDLE' | 'CAR_WASH' | 'MAINTAIN' | 'MANUAL_CAR_WASH'

export default interface ShopTag{
  shopId?: string

  textColor?: string

  content?: string

  color?: string

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
}
