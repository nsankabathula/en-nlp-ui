import { Component } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { FileItem, TLineItem, PLineItem, Accuracy } from 'src/app/models/model';
import { Observable } from 'rxjs';
import { forkJoin } from "rxjs";
import { error } from 'util';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor(private appService: AppService) {


  }





}
