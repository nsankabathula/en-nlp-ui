import { Component } from '@angular/core';

import { Observable } from 'rxjs';
import { forkJoin } from "rxjs";
import { error } from 'util';
import { AppService } from '../services/app.service';
@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
})
export class HomeComponent {
    title = 'app';
    SERVER_CONFIGS: Array<any> = []

    constructor(private appSvc: AppService) {

        this.appSvc._discover().subscribe((value) => {
            this.SERVER_CONFIGS = value;
        })
        /*
                this.appSvc._discover().subscribe((result: any) => {
                    console.log(result);
                    this.SERVER_CONFIGS = result;
                })
                */

    }

}