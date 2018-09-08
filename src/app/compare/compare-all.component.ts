import { Component, Input, ViewChild, TemplateRef } from '@angular/core';

import { Observable } from 'rxjs';
import { forkJoin } from "rxjs";
import { error } from 'util';
import { FileItem } from 'src/app/models/model';
import { FileSection } from 'src/app/models/compare.models';
import { IESError, IHit, IAgreementSent, IESAggResult, IAggResult, IBucket, IFileMeta, IFile, IFileSection, ISentSimilarity, IStat, IEntity } from 'src/app/models/es.model';
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

    sliderOptions: Options = {
        floor: -1,
        ceil: 1,
        step: 0.05,
        precision: 1,
        minRange: .3,
        maxRange: .8,
        pushRange: true,
        rightToLeft: true,
        showTicks: true,
        translate: (value: number, label: LabelType): string => {
            return (Math.round(value * 100) / 100).toString();
        }
    };
    @ViewChild('showDocModal')
    private docModal: TemplateRef<any>;

    constructor(private csService: CreditEsService, private pythonSvc: PyService, private modalSvc: NgbModal) {


        this.csService.getFileMetadata().subscribe((res: Array<IFileMeta>) => {
            //console.log("getFileMetadata", res)
            this.fileMetaData = res;
        })

        //this.updateSimilarity();



    }
    callPythonScript(section: IFileSection) {
        this.pythonSvc.callDoc2Vec(section.text).subscribe((pyResult: any) => {
            console.log("PyResult", pyResult)
            this.updateSimilarity();
        });
    }

    showSimilarityResult() {
        this.updateSimilarity();
    }

    updateSimilarity() {
        this.csService.getSimilarityStats().subscribe(
            (result: IStat) => {
                this.similartityStats = result;

                this.sliderOptions.minLimit = this.similartityStats.min;
                this.sliderOptions.maxLimit = this.similartityStats.max;
                this.sliderOptions.floor = this.similartityStats.min;
                this.sliderOptions.ceil = this.similartityStats.max;

                this.similartityStats.minValue = this.similartityStats.max / 2;
                this.similartityStats.maxValue = this.similartityStats.max;

                this.sliderOptions.maxRange = this.sliderOptions.step * 5
                this.sliderOptions.minRange = this.sliderOptions.step;

                console.log(this.similartityStats);
                if (this.similartityStats) {
                    this.fetchDocSimilarities(this.similartityStats.minValue, this.similartityStats.maxValue);
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

    fetchDocSimilarities(minValue: number, maxValue: number) {
        this.csService.getDocSimilarities(minValue, maxValue).subscribe(
            (result) => {
                //console.log("fetchDocSimilarities", result);
                this.documentSimilarities = result;
                this.documentSimilarities = this.documentSimilarities.map((value: ISentSimilarity) => {
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
        this.fetchDocSimilarities(changeContext.value, changeContext.highValue)

    }

    showDoc(doc: ISentSimilarity) {
        this.csService.getDocSimilarity(doc.name).subscribe(
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

    toggleScore(sent: ISentSimilarity) {
        sent.score = (sent.score > 0) ? 0 : 1;
        this.csService.updateScore(sent).subscribe((result: any) => {
            console.log(result);
        })
    }

    showEntityModal(section: IFileSection) {
        const modalRef = this.modalSvc.open(EntityModalContent, { centered: true, size: 'lg', windowClass: 'dark-modal' })

        modalRef.componentInstance.ents = section.ents;
        modalRef.componentInstance.text = section.text
    }

}
