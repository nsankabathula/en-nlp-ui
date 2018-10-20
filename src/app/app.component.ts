import { Component, Input, ViewChild, TemplateRef, HostListener } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { FileItem, TLineItem, PLineItem, Accuracy } from 'src/app/models/model';
import { Observable } from 'rxjs';
import { forkJoin } from "rxjs";
import { error } from 'util';
import { WindowRef } from 'src/app/services/window.service';

import { WindowHeight } from "src/app/common/window.height"

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent extends WindowHeight {
  title = 'app';
  //windowHeight: number = 880

  constructor(private appService: AppService, windowRef: WindowRef) {

    super(windowRef)
  }
  /*
  @HostListener('window:load')
  onLoad() {
    // call our matchHeight function here later        
    this.resetHeight();
  }

  resetHeight() {
    console.log("resetHeight", this.windowRef.nativeWindow.innerHeight)
    this.windowHeight = this.windowRef.nativeWindow.innerHeight * .9
    console.log("leftDivHeight", this.windowHeight)
  }

  @HostListener('window:resize')
  onResize() {
    // call our matchHeight function here later
    this.resetHeight();
  }
  */



}
