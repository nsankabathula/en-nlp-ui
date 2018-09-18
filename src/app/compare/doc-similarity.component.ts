import { Component, Input, SimpleChange } from '@angular/core';

import { Observable } from 'rxjs';
import { IFile, IFileSent, IFileSection } from 'src/app/models/es.model';
interface UIFileSent extends IFileSent {
    sectionId: number;
    sentId: number
    text: string;
    startChar: number;
    endChar: number;
    similarity: number
    label: "highlight" | "none"
}
interface UIFileSection extends IFileSection {
    text: string;
    isCollapsed: boolean;
    sents: Array<UIFileSent>
}

@Component({
    selector: 'app-doc-similarity',
    templateUrl: './doc-similarity.component.html',
})

export class DocSimilarityComponent {

    @Input("doc")
    document: IFile

    docSections: Array<UIFileSection> = [];

    constructor() {

    }

    ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
        const clone = function (obj) {
            return JSON.parse(JSON.stringify(obj));
        }
        for (let propName in changes) {
            let changedProp = changes[propName];
            if (propName === "document") {
                const doc = <IFile>clone(changedProp.currentValue);
                this.docSections = [];
                doc.sections.forEach((sectionValue) => {
                    const section: UIFileSection = clone(sectionValue)
                    var prevStart = 0
                    var sectionSents: Array<UIFileSent> = []
                    section.sents.forEach((value) => {
                        const sent: IFileSent = clone(value)
                        if (prevStart !== sent.startChar) {
                            sectionSents.push(
                                Object.assign(clone(sent), <UIFileSent>{
                                    text: section.text.substring(prevStart, sent.startChar),
                                    label: "none",
                                    startChar: prevStart,
                                    endChar: sent.startChar,
                                    sentId: sectionSents.length
                                })
                            )
                        }
                        prevStart = sent.startChar
                        sectionSents.push(
                            Object.assign(clone(sent), <UIFileSent>{
                                text: section.text.substring(prevStart, sent.endChar),
                                label: (sent.text.split(" ").length > 5) ? "highlight" : "none",
                                startChar: prevStart,
                                endChar: sent.endChar
                            })
                        )

                        prevStart = sent.endChar

                    })

                    this.docSections.push(
                        Object.assign(clone(section),
                            <UIFileSection>{
                                sents: [].concat(sectionSents)
                            })
                    )
                })

            }
            else
                console.log("Prop Name : ", propName);
            //console.log(to);


        }

    }


}
