import { Component } from '@angular/core';

import { Observable } from 'rxjs';
import { forkJoin } from "rxjs";
import { error } from 'util';
import { CompareService } from 'src/app/services/compare.service';
import { FileItem } from 'src/app/models/model';
import { FileSection } from 'src/app/models/compare.models';
import { CoreEsService } from 'src/app/services/es.service';
import { ESError, IHit, IAgreement } from 'src/app/models/es.model';
import { CreditEsService } from 'src/app/services/es-credit.service';
@Component({
    selector: 'app-compare-all',
    templateUrl: './compare-all.component.html',
})
export class CompareAllComponent {
    title = 'Compare All Component';

    masterFileNames: Array<FileItem> = []
    fileSections: Array<FileSection> = []
    selectedFileItem: FileItem = null;

    constructor(private compareSvc: CompareService, private csService: CreditEsService) {
        this.compareSvc.getMasterFiles().subscribe((result: Array<FileItem>) => {
            console.log(result.length, result);
            this.masterFileNames = result;
        })


        this.csService.getDocWithCount().subscribe(
            (res: Array<any>) => {
                console.log("es result", res);
            }, (error: ESError) => {
                console.error(error.msg);
            }
        )


    }

    getFileSections(fileItem: FileItem) {
        this.selectedFileItem = null;
        this.compareSvc.getFileSections(fileItem).subscribe((res) => {
            this.fileSections = res;
            this.selectedFileItem = fileItem
        })
    }

}