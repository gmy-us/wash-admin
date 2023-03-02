export type FileType = string | 'FILE' | 'PIC' | 'BANNER'

export type ShopStatus = string | 'DECORATION' | 'IN_OPERATION'

export type ShopType = string | 'STAR_STORE' | 'NON_STAR_STORES'

export default interface Storage{
  /**
  * 图片地址
  */
  url?: string

  /**
  * 1-图片 2-文件 3-banner
  */
  fileType?: FileType

  /**
  * 外键ID 可以是任何表
  */
  foreignId?: number

  /**
  * 页面路径
  */
  pagePath?: string

  name?: string

  percentage?: number

  status?: string

  type?: string

  uid?: string

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
