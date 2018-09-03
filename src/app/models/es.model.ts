export interface ESError extends Error {
    body: any;
    msg: any;
    path: string;
    query: any;
    response: any;
    statusCode: number
}
export interface IHit<T> {
    _index: string;
    _type: string;
    _id: any;
    _score: any
    _source: T
}
export interface IResultHit<T> {
    total: number
    max_score: number;
    hits: Array<IHit<T>>
}

export interface IESSearchResult<T> {
    hits: IResultHit<T>;
    took: 76;
}

export interface IAggResult<T> {

}

export interface IESAggResult<T> extends IESSearchResult<any> {
    aggregations: any
}
export class IAgreement {
    endChar: number;
    index: number;
    name: string
    sectionId: number;
    sectionText: string;
    sentId: number;
    sentText: string;
    similarity: number;
    words: Array<string>
}