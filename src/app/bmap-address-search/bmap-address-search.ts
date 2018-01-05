import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'bmap-address-search',
    templateUrl: './bmap-address-search.html',
    styleUrls: ['./bmap-address-search.scss'],
    encapsulation: ViewEncapsulation.None
})
export class BmapAddressSearchComponent implements OnInit {
    constructor() { }

    ngOnInit() { }

    down(e: any) {
        console.log('down');
        e.next(false);
    }

    up(e: any) {
        console.log('up');
        e.next(false);
    }
}
