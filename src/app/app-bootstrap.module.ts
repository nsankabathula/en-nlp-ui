import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap/modal/modal.module';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap/dropdown/dropdown.module';
import { NgbDropdownMenu, NgbDropdown } from '@ng-bootstrap/ng-bootstrap/dropdown/dropdown';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
    imports: [
        CommonModule,
        //NgbDropdownModule.forRoot(),
        //NgbModalModule.forRoot(),
        NgbModule.forRoot()
    ],
    exports: [NgbDropdownModule, NgbModalModule, NgbModule]
})
export class AppBootstrapModule { }