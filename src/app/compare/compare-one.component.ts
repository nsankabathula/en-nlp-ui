import { Component } from '@angular/core';

import { Observable } from 'rxjs';
import { forkJoin } from "rxjs";
import { error } from 'util';
@Component({
    selector: 'app-compare-one',
    templateUrl: './compare-one.component.html',
})
export class CompareOneComponent {
    title = 'Compare One Component';

}