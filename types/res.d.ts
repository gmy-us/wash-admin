export interface BaseRes<T> {
    message?: string
    result?: T
    success?: boolean
    tips?: string
    traceId?: string
}

export interface PageRes<T> {
    hasNext?: boolean
    list?: T[]
    current?: number
    size?: number
    total?: number
}

export interface TagRes {
    has?: string[]
    canUse?: string[]
}
