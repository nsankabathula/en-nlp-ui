import { Component, Input, OnChanges, SimpleChange } from '@angular/core';
import { ISentSimilarity } from 'src/app/models/es.model';

@Component({
    selector: 'app-section-similarity',
    template: `
    <div *ngIf="textArray && textArray.length>0">
        
        <span>{{textArray[0]}}</span>
        <span class="badge badge-info">{{doc.sentId}}</span>
        <u><span><strong>{{textArray[1]}}</strong></span>
        </u>
        <span>{{textArray[2]}}</span>
        <span class="badge badge-dark">{{doc.sectionId}}</span>
    </div>
    `
})
export class SectionTextComponent implements OnChanges {

    @Input('data') doc: ISentSimilarity
    textArray: Array<string> = new Array(3);

    constructor() {

    }
    ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
        for (let propName in changes) {
            let changedProp = changes[propName];

            let to: ISentSimilarity = changedProp.currentValue;
            if (changedProp.isFirstChange()) {
                this.textArray[0] = to.sectionText.substring(0, to.startChar)
                this.textArray[1] = to.sectionText.substring(to.startChar, to.endChar)
                this.textArray[2] = to.sectionText.substring(to.endChar)

            }

        }

    }


}