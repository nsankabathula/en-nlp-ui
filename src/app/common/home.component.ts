import { Component } from '@angular/core';

import { Observable } from 'rxjs';
import { forkJoin } from "rxjs";
import { error } from 'util';
import { ConfigService } from 'src/app/services/config.service';
@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
})
export class HomeComponent {
    title = 'app';

    SERVER_CONFIGS = ConfigService.getAll()

}