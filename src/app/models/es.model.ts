
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
    aggregations?: IAggResult
}

export interface IBasicBucket {
    doc_count_error_upper_bound: number
    buckets: Array<IBucket>
}

export interface IAggResult {
    [key: string]: IBasicBucket | IStat;
}

interface IBucketNode {
    [key: string]: Array<IBucket>;
}


export interface IBucket {
    key: any;
    doc_count: number | any;
    bg_count?: number | any;
    [key: string]: IBasicBucket;
}

export interface IESAggResult extends IESSearchResult<any> {
    aggregations: IAggResult
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

export interface IFileSectionMeta {
    sectionId: number;
    sentCount: number;
    //text: string;

}

export interface IFileSent {
    sectionId: number;
    sentId: number
    text: string;
    startChar: number;
    endChar: number;

}

export interface IFileSection extends IFileSectionMeta {
    text: string;
    isCollapsed: boolean;
    ents?: Array<IEntity>

}

export interface IFileMeta {
    name: string
    filePath: string;
    sectionCount: number;
    sentCount: number
    sections: Array<IFileSectionMeta>

}

export interface IEntity {
    sectionId: number;
    text: string;
    startChar: number;
    endChar: number;
    label: string
}

export interface IFile {
    name: string;
    sections: Array<IFileSection>
    sents: Array<IFileSent>
    text: string
    ents?: Array<IEntity>
}

export interface IStat {
    count: number;
    min: number;
    max: number;
    avg: number;
    sum: number;
    buckets?: Array<IBucket>
    minValue?: number;
    maxValue?: number
}

export interface ISentSimilarity {
    /*"sentId",
                "sectionText",
                "name",
                "similarity",
                "sectionId",
                "sectionText"*/
    name: string;
    sentId: number;
    sentText: string
    sectionId: number;
    sectionText: string
    similarity: number;
    startChar: number;
    endChar: number,
    query: string;
    isCollapsed?: boolean;
    score: 0 | 1;

}

export interface IDocSentSimilarityStats {
    stats: IStat,
    docSents: Array<ISentSimilarity>
}

export interface IESQuery {
    from: number,
    size: number,
    sort?: Array<any>,
    aggs?: any
    _source?: Array<any>
    query?: any

}