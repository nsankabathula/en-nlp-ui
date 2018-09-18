
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

export interface IFileSectionMeta {
    sectionId: number;
    sentCount: number;
    //text: string;
    index?: string

}

export interface IFileSentMeta {
    sectionId: number;
    sentId: number
    text: string;
    startChar: number;
    endChar: number;

}

export interface IFileSent extends IFileSentMeta {
    sectionId: number;
    sentId: number
    text: string;
    startChar: number;
    endChar: number;
    similarity: number

}

export interface IFileSection extends IFileSectionMeta {
    text: string;
    isCollapsed: boolean;
    ents?: Array<IEntity>
    sents?: Array<IFileSent>
    simStats?: IStat


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
    simStats?: IStat
    isCollapsed?: boolean
    query?: any
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
export enum Score {
    MATCH = 1, //"match",
    MODERATE_MATCH = 2, //"moderate-match",
    NOTMATCH = 0,//"no_match",
    FALSE_POSITIVE = -1, //"type1-false_positive",
    FALSE_NEGATIVE = -2//"type1-false_negative"

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
    sentSimilarity: number;
    startChar: number;
    endChar: number,
    query: any;
    isCollapsed?: boolean;
    target: Score;
    words?: Array<string>
    rank: number;
    docCount: number;

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


