import { Component, Input, SimpleChange } from '@angular/core';

import { Observable } from 'rxjs';
import { IFile, IFileSent, IFileSection, IDocSentSimilarityStats, ISentSimilarity } from 'src/app/models/es.model';
import { compare } from 'src/app/services/es-credit.service';
interface UIFileSent extends IFileSent {
    sectionId: number;
    sentId: number
    sentText: string;
    startChar: number;
    endChar: number;
    similarity: number
    label: "highlight" | "none"
}

@Component({
    selector: 'app-doc-similarity',
    templateUrl: './doc-similarity.component.html',
    styleUrls: ['./doc-similarity.component.css']
})

export class DocSimilarityComponent {

    @Input("doc")
    document: IDocSentSimilarityStats

    topN: number = 3

    docSents: Array<UIFileSent> = [];

    constructor() {

    }

    ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
        const clone = function (obj) {
            //console.log("clone", obj)
            return JSON.parse(JSON.stringify(obj));
        }
        for (let propName in changes) {
            let changedProp = changes[propName];
            if (propName === "document") {
                if (changedProp.currentValue) {
                    this.document = <IDocSentSimilarityStats>clone(changedProp.currentValue);
                    //console.log(this.document)
                    var topNSents = [].concat(this.document.docSents)
                    topNSents = [].concat(topNSents.sort(compare("sentSimilarity", "desc")).slice(0, this.topN))
                    //console.log("topNSents", topNSents)
                    this.docSents =
                        [].concat(
                            this.document.docSents.map((sent: IFileSent) => {
                                return <UIFileSent>
                                    Object.assign(clone(sent), <UIFileSent>{
                                        label: (topNSents.find((top) => {
                                            return top.sectionId === sent.sectionId && top.sentId === sent.sentId
                                        })) ? "highlight" : "none",
                                    })
                            })
                        );


                }



            }
            else
                console.log("Prop Name : ", propName);
            //console.log(to);

        }
    }




}
