
export class BaseESInterface {
    __name__: ""
    instanceof: Function = () => {
        return this.__name__
    };

}
export interface IESError extends Error {
    body: any;
    msg: any;
    path: string;
    query: any;
    response: any;
    statusCode: number
}

export class ESError implements IESError {
    body: any;
    msg: any;
    path: string;
    query: any;
    response: any;
    statusCode: number
    name: string = "ESError"
    message: any

    constructor(msg) {
        this.msg = msg
        this.message = msg;

    }

}
export interface IHit<T> {
    _index: string;
    _type: string;
    _id: any;
    _score: any
    _source: T
}

export class Hit<T> implements IHit<T> {
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
    took: number;
    aggregations?: IAggResult<any>
}

export interface IBasicBucket<T> {
    doc_count_error_upper_bound: number
    buckets: Array<IBucket<T>>
}

export interface IAggResult<T> {
    [key: string]: IBasicBucket<T> | IStat;
}
/*
interface IBucketNode {
    [key: string]: Array<IBucket>;
}
*/


export interface IBucket<T> {
    key: any;
    doc_count: number | any;
    bg_count?: number | any;
    [key: string]: IBasicBucket<T>;
}

export interface IESAggResult<T> extends IESSearchResult<any> {
    aggregations: IAggResult<T>
}

export class IAgreementSent {
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


export class ISortModel {
    field: string;
    order: "asc" | "desc"
}




export interface IStat {
    count?: number;
    min: number;
    max: number;
    avg?: number;
    sum?: number;
    buckets?: Array<IBucket<any>>
    minValue?: number;
    maxValue?: number
}





export interface IESQuery {
    from: number,
    size: number,
    sort?: Array<any>,
    aggs?: any
    _source?: Array<any>
    query?: any

}

export interface ISimilaritySectionBucket {
    doc_count: number;
    endChar: any
    startChar: any
    key: number
    maxSim: { value: number }
    minSim: { value: number }
    sectionText: any,
    sents: any,
    sims: any,
    query: any

}

export interface ISimilarityDocBucket {
    key: string
    doc_count: number
    section: {
        buckets: Array<ISimilaritySectionBucket>
    }
}

export interface ISimilarityResult {
    name: {
        buckets: Array<ISimilarityDocBucket>
    }

}


