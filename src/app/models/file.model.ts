import { IStat } from "src/app/models/es.model";

import { IMap } from "src/app/models/model"

const ENTITY_LABLES = { "GPE": [], "ORG": [], "MONEY": [] }

export class ISentence {
    id: any;
    startChar: number;
    endChar: number;
    text: any;
    prob: number;
}

export class IEntities extends ISentence {
    label: string;
    style: any = function () {
        return ENTITY_LABLES[this.label]
    }
}

export class ISection {
    sectionId: any;
    text: string;
    entities: Array<IEntities>
    sents: Array<ISentence>
    isCollapsed: boolean = true
}

export class FileSection extends ISection {



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
    sentText?: string

}

export interface IFileSection extends IFileSectionMeta {
    title?: string
    text: string;
    isCollapsed: boolean;
    ents?: Array<IEntity>
    sents?: Array<IFileSent>
    simStats?: IStat | any
    selected?: boolean
    hide?: boolean
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




export enum Score {
    MATCH = 1, //"match",
    MODERATE_MATCH = 2, //"moderate-match",
    NOTMATCH = 0,//"no_match",
    FALSE_POSITIVE = -1, //"type1-false_positive",
    FALSE_NEGATIVE = -2//"type1-false_negative"

}

export const MATCH_BREAKS = {
    MATCH: 16,
    NOTMATCH: 23
}
export enum StatusBadge {
    MATCH = "badge badge-primary",
    UKNOWN = "badge badge-warning",
    NOTMATCH = "badge badge-success"
}
export enum MatchStatus {
    MATCH,
    UKNOWN,
    NOTMATCH
}

export interface ITargetBlock {
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
    confidence: number;
    status: string
    style: any
    clazz: any
    shortName: string
    sentStats: IDocSentSimilarityStats
    bookmark?: any
    pdfFile: any
    txtFile: any
}

export interface IDocSentSimilarityStats {
    stats: IStat,
    docSents: Array<ITargetBlock | IFileSent>
}

export interface IAttachment {
    url: string,
    name: string,
    info: any
}

