export type StationStatus = string | 'IDLE' | 'CAR_WASH' | 'MAINTAIN' | 'MANUAL_CAR_WASH'

export default interface Station {
    /**
     * 店铺ID
     */
    shopId?: string

    /**
     * 状态 0-空闲 1-洗车 2-维护 3-人工洗车
     */
    status?: StationStatus

    /**
     * 工位编号
     */
    number?: number

    /**
     * 是否有门
     */
    supportDoor?: boolean

    /**
     * 电源开关
     */
    powerStatus?: boolean

    /**
     * 水开关
     */
    waterStatus?: boolean

    /**
     * 入场识别器序列号
     */
    inSerial?: string

    /**
     * 出场识别器序列号
     */
    outSerial?: string

    /**
     * 电控盒子序列号
     */
    boxSerial?: string

    /**
     * 电源盒子io口
     */
    powerPort?: number

    /**
     * 水io口
     */
    waterPort?: number

    /**
     * 门io口
     */
    doorPort?: number

    inPic?: string

    outPic?: string

    aliInPic?: string

    aliOutPic?: string

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
