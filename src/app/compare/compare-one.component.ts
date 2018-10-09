import { Component } from '@angular/core';

import { Observable } from 'rxjs';
import { forkJoin } from "rxjs";
import { error } from 'util';
import { CreditEsService } from 'src/app/services/es-credit.service';
import { PyService } from 'src/app/services/python.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal/modal';
import { IFileMeta, ITargetBlock } from 'src/app/models/file.model';
@Component({
    selector: 'app-compare-one',
    templateUrl: './compare-one.component.html',
})
export class CompareOneComponent {
    fileMetaData: Array<IFileMeta> = [];
    SentSimDoc: Array<ITargetBlock> = [];

    constructor(private csService: CreditEsService, private pythonSvc: PyService, private modalSvc: NgbModal) {


        this.csService.getFileMetadata().subscribe((res: Array<IFileMeta>) => {
            //console.log("getFileMetadata", res)
            this.fileMetaData = res;
        })

        //this.updateSimilarity();


    }
    showSimilarity(file: IFileMeta) {
        this.csService.getDocSimilarity(file.name).subscribe(
            (res: Array<ITargetBlock>) => {
                this.SentSimDoc = res;

            }, (err: any) => { console.error(err) }
            , () => {

            }
        )

    }


    showDoc(doc: ITargetBlock) {



    }


}