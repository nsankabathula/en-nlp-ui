import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';  // replaces previous Http service
import { AppService } from 'src/app/services/app.service';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NavComponent } from 'src/app/common/nav.component';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { TrainingComponent } from 'src/app/training/training.component';
import { TrainingService } from 'src/app/services/training.service';
import { HomeComponent } from 'src/app/common/home.component';
import { AppBootstrapModule } from 'src/app/app-bootstrap.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompareAllComponent } from 'src/app/compare/compare-all.component';
import { CompareOneComponent } from 'src/app/compare/compare-one.component';
import { CompareService } from 'src/app/services/compare.service';
import { CoreEsService } from 'src/app/services/es.service';
import { CreditEsService } from 'src/app/services/es-credit.service';


@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    TrainingComponent,
    HomeComponent,
    CompareAllComponent,
    CompareOneComponent,

  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    //NgbModule.forRoot(),
    AppRoutingModule,
    AppBootstrapModule,
    FormsModule,
    ReactiveFormsModule,

  ],
  providers: [AppService, TrainingService, CompareService, CoreEsService, CreditEsService],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private appSvc: AppService) {
    //console.log(appSvc.getFileNames())
  }
}
