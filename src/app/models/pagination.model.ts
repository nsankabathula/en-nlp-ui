export interface IPagination<T> {
    currentPageIndex: number
    pages: Array<IPagination<T>>
    query?: any
}

export interface IPage<T> {
    query?: any
    bookmark: any
    data: Array<T>
    isLast: boolean
    isFirst: boolean
    index?: number
}