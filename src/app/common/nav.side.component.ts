import { Component, Input } from '@angular/core';

/**
 * @title Multi-row toolbar
 */
@Component({
    selector: 'app-nav-side',
    templateUrl: 'nav.side.component.html',
    styleUrls: ['./nav.side.component.css']

})
export class SideNavBar {

    @Input("windowHeight")
    windowHeight: number

}