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