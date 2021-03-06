import { Component, Input, ViewChild, TemplateRef, HostListener } from '@angular/core';

import { Observable, forkJoin, of, Subject } from 'rxjs';
import { tap, debounceTime, map, distinctUntilChanged, switchMap, merge, catchError, filter } from "rxjs/operators";
import { error } from 'util';
import { FileItem, IMap } from 'src/app/models/model';
import { FileSection, IAttachment } from 'src/app/models/file.model';
import { IESError, IHit, IAgreementSent, IESAggResult, IAggResult, IBucket, IStat } from 'src/app/models/es.model';

import { IFile, ITargetBlock, IDocSentSimilarityStats } from "src/app/models/file.model"
import { IFileSentMeta, IFileSent, IFileSection, IFileSectionMeta, IFileMeta } from "src/app/models/file.model"
import { Score, MatchStatus, MATCH_BREAKS, StatusBadge, IEntity } from "src/app/models/file.model"

import { CreditEsService } from 'src/app/services/es-credit.service';
import { Options, LabelType, ChangeContext, PointerType } from 'ng5-slider';
import { PyService } from 'src/app/services/python.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap/';
import { ModalContent } from 'src/app/common/modal-content.component';
import { EntityModalContent } from 'src/app/compare/entity.component';
import { WindowRef } from 'src/app/services/window.service';
import { NgbTypeaheadConfig, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';

import { NlpService } from 'src/app/services/nlp.service';


declare let window;

@Component({
    selector: 'app-compare-all',
    templateUrl: './compare-all.component.html',
    styleUrls: ['./compare-all.component.scss', './compare-all.component.css']
})
export class CompareAllComponent {

    document: IFile;
    selectedFileMeta: IFileMeta = null;
    targetBlocks: Array<ITargetBlock> = []
    similartityStats: IStat = null;
    fileMetaData: Array<IFileMeta> = []
    sentSimDoc: Array<ITargetBlock> = [];
    DocSimilarities: Array<IFile> = []
    INDEX: string = "";
    leftDivHeight: number = 880

    currentSection: IFileSection;

    searching = false;
    searchFailed = false;
    filterTargetBlocks$: any;
    hideSearchingWhenUnsubscribed = new Observable(() => () => this.searching = false);
    searchModel: any
    searchResultFormatter = (x: { name: string }) => x.name;
    @ViewChild('instance') instance: NgbTypeahead;
    click$ = new Subject<string>();

    SCORE = Score;

    @ViewChild('showDocModal')
    private docModal: TemplateRef<any>;

    constructor(//private csMetaSvc: CreditEsService, 
        private pythonSvc: PyService,
        private modalSvc: NgbModal, private windowRef: WindowRef, private nlpSvc: NlpService, config: NgbTypeaheadConfig) {

        config.showHint = true;

        this.filterTargetBlocks$ = (termSubject$: Observable<string>) => {
            return termSubject$.pipe(
                debounceTime(300)
                , distinctUntilChanged()
                /*, tap(() => {
                    console.log("searching");
                    this.searching = true;
                })
                */
                , switchMap((term) =>
                    (this.currentSection && term.length > 2) ?
                        this.fetchResults(this.nlpSvc.targetFilter(this.currentSection, term), this.nlpSvc.attachments())
                            .pipe(
                            tap(() => {
                                this.searchFailed = false
                                console.log("got results")
                            })
                            , map((result) => {
                                console.log(result[0]);

                                return result[0];
                            })
                            , catchError(() => {
                                this.searchFailed = false;
                                console.error("searching failed")
                                return of([]);
                            }))
                        : []


                )
                , tap(() => {
                    this.searching = false;
                    console.log("searching complete")
                })
                , merge(this.hideSearchingWhenUnsubscribed)

            );

        }
        this.nlpSvc.master().subscribe((res) => {

            this.document = res;
            console.log("result", this.document);

        })






    }

    @HostListener('window:load')
    onLoad() {
        // call our matchHeight function here later        
        this.resetHeight();
    }

    resetHeight() {
        console.log("resetHeight", this.windowRef.nativeWindow.innerHeight)
        this.leftDivHeight = this.windowRef.nativeWindow.innerHeight * .83
        console.log("leftDivHeight", this.leftDivHeight)
    }

    @HostListener('window:resize')
    onResize() {
        // call our matchHeight function here later
        this.resetHeight();
    }
    /*
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
    */
    closeAllExcept(section: IFileSectionMeta) {
        this.document.sections.forEach((fileSec: IFileSection) => {
            fileSec.isCollapsed = section.sectionId !== fileSec.sectionId

        })
    }

    showSimilarityForSection(doc: IFile, section: IFileSection) {
        //const index = doc.name.toLowerCase() + "_" + section.sectionId.toString()

        this.closeAllExcept(section)

        console.log("showSimilarityForSection", section, doc)

        this.fetchDocSimilarities(section);
    }

    fetchResults(targets: Observable<Array<ITargetBlock>>, attachments: Observable<IMap<IAttachment>>) {
        return forkJoin([targets, attachments]).pipe(
            map((results) => {
                console.log("attachments", results[1])

                let targets: Array<ITargetBlock> = results[0]
                let attachmentMap = results[1];
                console.log("fetchDocSimilarities", targets);
                this.targetBlocks = targets;
                this.targetBlocks = this.targetBlocks.map((row: ITargetBlock) => {

                    row.isCollapsed = true;
                    row.rank = row.rank + 1
                    row.confidence = ((row.rank / row.docCount) * 100)
                    row.status = MatchStatus[(row.confidence < MATCH_BREAKS.MATCH) ? MatchStatus.MATCH : ((row.confidence > MATCH_BREAKS.NOTMATCH) ? MatchStatus.NOTMATCH : MatchStatus.UKNOWN)]

                    row.confidence = (MatchStatus[MatchStatus.MATCH] == row.status) ? 100 - row.confidence : row.confidence;
                    row.style = {
                        background:
                            (row.status == MatchStatus[MatchStatus.MATCH]) ? "linear-gradient(to bottom, #33ccff " + row.confidence + "%, #33cc33 100%)" :
                                "linear-gradient(to bottom, #33ccff 0%, #ccff33" + row.confidence + "%)"

                    }
                    row.clazz = StatusBadge[row.status]
                    row.shortName = row.name.substring(0, 20) + ".." + row.name.substring(row.name.length - 4)
                    row.sentStats = { stats: null, docSents: row["targetSents"] }
                    row.txtFile = attachmentMap[row.name.toUpperCase()]
                    const pdfFileName = row.name.substring(0, row.name.length - 3).toLocaleUpperCase() + "PDF"
                    //console.log(pdfFileName);
                    row.pdfFile = attachmentMap[pdfFileName]

                    return row;
                });
                this.targetBlocks[0].isCollapsed = false;
                return results;
            })
        )
    }
    fetchDocSimilarities(section: IFileSection) {
        this.currentSection = section;
        this.fetchResults(this.nlpSvc.target(section), this.nlpSvc.attachments()).subscribe((results) => {
            console.log("do something", results)
        });
        /*
        forkJoin([this.nlpSvc.target(section), this.nlpSvc.attachments()]).subscribe(
            (results) => {
                console.log("attachments", results[1])

                let targets: Array<ITargetBlock> = results[0]
                let attachmentMap = results[1];
                console.log("fetchDocSimilarities", targets);
                this.targetBlocks = targets;
                this.targetBlocks = this.targetBlocks.map((row: ITargetBlock) => {

                    row.isCollapsed = true;
                    row.rank = row.rank + 1
                    row.confidence = ((row.rank / row.docCount) * 100)
                    row.status = MatchStatus[(row.confidence < MATCH_BREAKS.MATCH) ? MatchStatus.MATCH : ((row.confidence > MATCH_BREAKS.NOTMATCH) ? MatchStatus.NOTMATCH : MatchStatus.UKNOWN)]

                    row.confidence = (MatchStatus[MatchStatus.MATCH] == row.status) ? 100 - row.confidence : row.confidence;
                    row.style = {
                        background:
                            (row.status == MatchStatus[MatchStatus.MATCH]) ? "linear-gradient(to bottom, #33ccff " + row.confidence + "%, #33cc33 100%)" :
                                "linear-gradient(to bottom, #33ccff 0%, #ccff33" + row.confidence + "%)"

                    }
                    row.clazz = StatusBadge[row.status]
                    row.shortName = row.name.substring(0, 20) + ".." + row.name.substring(row.name.length - 4)
                    row.sentStats = { stats: null, docSents: row["targetSents"] }
                    row.txtFile = attachmentMap[row.name.toUpperCase()]
                    const pdfFileName = row.name.substring(0, row.name.length - 3).toLocaleUpperCase() + "PDF"
                    //console.log(pdfFileName);
                    row.pdfFile = attachmentMap[pdfFileName]

                    return row;
                });
                this.targetBlocks[0].isCollapsed = false;
            }
        )
        */

    }




    /*
        showDoc(doc: ISentSimilarity) {
            console.log("showDoc", doc)
            this.csMetaSvc.getDocSimilarity(doc.name, doc.query.index).subscribe(
                (res: Array<ISentSimilarity>) => {
                    this.sentSimDoc = res;
    
                }, (err: any) => { console.error(err) }
                , () => {
                    this.showModal(doc.name)
                }
            )
        }
    */
    showFile(attachment: IAttachment, fileType: string = "pdf") {
        console.info("showfile", attachment, fileType);
        window.open(attachment.url, attachment.name)


        //window.open(this.pythonSvc.downloadUrl(fileName), fileName);



    }

    showModal(name: string) {
        const modalRef = this.modalSvc.open(ModalContent, { centered: true, size: 'lg', windowClass: 'dark-modal' });
        modalRef.componentInstance.name = name;
        //modalRef.componentInstance.text = text
        modalRef.componentInstance.modalBody = this.docModal;

    }

    toggleScore(sent: ITargetBlock, score: Score = Score.NOTMATCH) {

        sent.target = score
        /*
                this.csMetaSvc.updateTarget(sent, sent.query.index).subscribe((result: any) => {
                    console.log(result);
                })*/
    }

    showEntityModal(section: IFileSection) {
        const modalRef = this.modalSvc.open(EntityModalContent, { centered: true, size: 'lg', windowClass: 'dark-modal' })
        console.log(section.ents)
        modalRef.componentInstance.ents = section.ents;
        modalRef.componentInstance.text = section.text
    }

}
