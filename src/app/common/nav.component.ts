import { Component } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { Observable } from 'rxjs';
import { forkJoin } from "rxjs";
import { error } from 'util';
@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
})
export class NavComponent {
    title = 'app';

}