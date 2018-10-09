export interface IRow {
    id: string | number,
    key: string
    value: {
        rev: string
    }
}

export interface IViewRow<T> {
    id: string | number,
    key: string
    value: any,
    doc?: T
}

export interface IAllDocs {
    offset: number,
    rows: Array<IRow>
    total_rows: number
}

export interface IViewResult<T> {
    offset: number,
    rows: Array<IViewRow<T>>
    total_rows: number
}

export interface IFindQuery {
    selector: any
    limit?: number
    skip?: number
    sort?: Array<any>
    fields: Array<any>
    use_index?: string | Array<any>
    execution_stats?: boolean | true
    bookmark?: string
}

export interface IExecutionStats {
    total_keys_examined: number,
    total_docs_examined: number,
    total_quorum_docs_examined: number,
    results_returned: number,
    execution_time_ms: number
}

export interface IFindResult<T> {
    docs: Array<T>
    bookmark: string
    warning: string
    execution_stats?: IExecutionStats
}