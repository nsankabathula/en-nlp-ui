import { Component, Input, ViewChild, TemplateRef } from '@angular/core';

import { Observable } from 'rxjs';
import { forkJoin } from "rxjs";
import { error } from 'util';
import { FileItem } from 'src/app/models/model';
import { FileSection } from 'src/app/models/compare.models';
import { IESError, IHit, IAgreementSent, IESAggResult, IAggResult, IBucket, IFileMeta, IFile, IFileSection, ISentSimilarity, IStat, IEntity, IFileSectionMeta, Score } from 'src/app/models/es.model';
import { CreditEsService } from 'src/app/services/es-credit.service';
import { Options, LabelType, ChangeContext, PointerType } from 'ng5-slider';
import { PyService } from 'src/app/services/python.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap/';
import { ModalContent } from 'src/app/common/modal-content.component';
import { EntityModalContent } from 'src/app/compare/entity.component';

@Component({
    selector: 'app-compare-all',
    templateUrl: './compare-all.component.html',
    styleUrls: ['./compare-all.component.scss']
})
export class CompareAllComponent {

    document: IFile;
    selectedFileMeta: IFileMeta = null;
    documentSimilarities: Array<ISentSimilarity> = []
    similartityStats: IStat = null;
    fileMetaData: Array<IFileMeta> = []
    sentSimDoc: Array<ISentSimilarity> = [];
    DocSimilarities: Array<IFile> = []
    INDEX: string = "";

    SCORE = Score;

    sliderOptions: Options = {
        floor: -1,
        ceil: 1,
        step: 0.05,
        precision: 1,
        minRange: .3,
        maxRange: .8,
        pushRange: true,
        rightToLeft: false,
        showTicks: true,
        translate: (value: number, label: LabelType): string => {
            //console.log("translate", value)
            return ((value !== null && value !== undefined) ? Math.round(value * 100) / 100 : 0).toString();
        }
    };
    @ViewChild('showDocModal')
    private docModal: TemplateRef<any>;

    constructor(private csService: CreditEsService, private pythonSvc: PyService, private modalSvc: NgbModal) {


        this.csService.getFileMetadata().subscribe((res: Array<IFileMeta>) => {
            //console.log("getFileMetadata", res)
            this.fileMetaData = res;
            const doc = this.fileMetaData[0]
            this.getFileSections(doc)
            //this.showSimilarityForSection(doc, doc.sections[0]);
        })







    }
    callPythonScript(section: IFileSection, doc: IFileMeta) {
        //const index = doc.name.toLowerCase() + "_" + section.sectionId.toString()
        const index = section.index;
        this.pythonSvc.callDoc2Vec(section, doc.name, index).subscribe((pyResult: any) => {
            console.log("PyResult", pyResult)
            this.updateSimilarity(index);
        });
    }

    showSimilarityResult(index: string = "credit") {
        this.updateSimilarity(index);
    }

    showSimilarityForSection(doc: IFileMeta, section: IFileSectionMeta) {
        //const index = doc.name.toLowerCase() + "_" + section.sectionId.toString()
        console.log("showSimilarityForSection", section, doc)
        const index = doc.name + "_" + section.sectionId

        this.fetchDocSimilarities(-1, 1, index);
    }

    updateSimilarity(index: string = "credit") {
        this.INDEX = index;
        this.csService.getSimilarityStats(index).subscribe(
            (result: IStat) => {
                this.similartityStats = result;
                const max = (this.similartityStats.max) ? this.similartityStats.max : 1
                const min = (this.similartityStats.min) ? this.similartityStats.min : -1
                this.sliderOptions.minLimit = min;
                this.sliderOptions.maxLimit = max;
                this.sliderOptions.floor = min;
                this.sliderOptions.ceil = max;

                this.similartityStats.minValue = max / 2;
                this.similartityStats.maxValue = max;

                this.sliderOptions.maxRange = this.sliderOptions.step * 10
                this.sliderOptions.minRange = this.sliderOptions.step;

                console.log(this.similartityStats);
                if (this.similartityStats) {
                    this.fetchDocSimilarities(this.similartityStats.minValue, this.similartityStats.maxValue, index);
                }
            }
        )
    }
    getFileSections(fileItem: IFileMeta) {
        this.selectedFileMeta = null;
        this.document = null;

        this.csService.getDoc(fileItem).subscribe(
            (res: IFile) => {
                this.selectedFileMeta = fileItem
                this.document = res;

                this.document.sections = this.document.sections.map((value: IFileSection) => {
                    value.ents = [].concat(this.document.ents.filter((ent: IEntity) => {
                        return value.sectionId === ent.sectionId
                    }))

                    value.isCollapsed = true;
                    return value;
                })

                //console.log(this.document.sections[0])


            }
        )


    }

    fetchDocSimilarities(minValue: number, maxValue: number, index: string = "credit") {
        /*
                this.csService.getSimBySection(minValue, maxValue, index).subscribe((response: Array<IFile>) => {
                    this.DocSimilarities = response;
                }, ((error) => { console.error(error) }), () => {
                    console.log("fetchDocSimilarities", this.DocSimilarities);
                })
        */

        this.csService.getDocSimilarities(index, minValue, maxValue).subscribe(
            (result) => {
                console.log("fetchDocSimilarities", result);
                this.documentSimilarities = result;
                this.documentSimilarities = this.documentSimilarities.map((value: ISentSimilarity) => {
                    value.sectionText = value.words.join(" ");
                    value.isCollapsed = true;
                    return value;
                });

            })

    }

    onUserChangeStart(changeContext: ChangeContext): void {
        //this.logText += `onUserChangeStart(${this.getChangeContextString(changeContext)})\n`;
    }

    onUserChange(changeContext: ChangeContext): void {
        //this.logText += `onUserChange(${this.getChangeContextString(changeContext)})\n`;
    }

    onUserChangeEnd(changeContext: ChangeContext): void {
        //this.logText += `onUserChangeEnd(${this.getChangeContextString(changeContext)})\n`;
        this.getChangeContextString(changeContext);
    }

    getChangeContextString(changeContext: ChangeContext): void {
        this.fetchDocSimilarities(changeContext.value, changeContext.highValue, this.INDEX)

    }

    showDoc(doc: ISentSimilarity) {
        console.log("showDoc", doc)
        this.csService.getDocSimilarity(doc.name, doc.query.index).subscribe(
            (res: Array<ISentSimilarity>) => {
                this.sentSimDoc = res;

            }, (err: any) => { console.error(err) }
            , () => {
                this.showModal(doc.name)
            }
        )



    }

    showModal(name: string) {
        const modalRef = this.modalSvc.open(ModalContent, { centered: true, size: 'lg', windowClass: 'dark-modal' });
        modalRef.componentInstance.name = name;
        //modalRef.componentInstance.text = text
        modalRef.componentInstance.modalBody = this.docModal;

    }

    toggleScore(sent: ISentSimilarity, score: Score = Score.NOTMATCH) {

        sent.target = score

        this.csService.updateTarget(sent, sent.query.index).subscribe((result: any) => {
            console.log(result);
        })
    }

    showEntityModal(section: IFileSection) {
        const modalRef = this.modalSvc.open(EntityModalContent, { centered: true, size: 'lg', windowClass: 'dark-modal' })

        modalRef.componentInstance.ents = section.ents;
        modalRef.componentInstance.text = section.text
    }

}
