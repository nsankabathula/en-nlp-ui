import { NgModule } from '@angular/core';


import {
    MatButtonModule, MatCheckboxModule, MatIconModule,
    MatToolbarModule, MatMenuModule,
    MatGridListModule, MatSidenavModule, MatSlideToggleModule,
    MatChipsModule, MatFormFieldModule, MatDatepickerModule,
    MatNativeDateModule, MatInputModule, MatListModule,
    MatStepperModule, MatSelectModule, MatTableModule, MatProgressSpinnerModule,
    MatCardModule, MatTabsModule
} from '@angular/material';

@NgModule({
    imports: [
        MatToolbarModule,
        //NgbDropdownModule.forRoot(),
        //NgbModalModule.forRoot(),

    ],
    exports: [MatToolbarModule, MatSidenavModule, MatChipsModule, MatMenuModule, MatSlideToggleModule]
})
export class AppMaterialModule { }