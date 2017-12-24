import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
@Injectable()
export class BmapAddressSelectService {
    show$: Subject<any> = new Subject();

    time: any = new Date().getTime();
    sn: string;
    constructor() {
        console.log('BmapAddressSelectService is', this.time);
    }

    show(sn?: string) {
        this.sn = sn;
        this.show$.next({ show: true });
    }

    close(data: any) {
        this.show$.next({ show: false, data: data, sn: this.sn });
    }
}

declare const window: any;
declare const global: any;
let meepo: any;
if (window) {
    window['meepo'] = window['meepo'] || {};
    meepo = window['meepo'];
} else {
    global['meepo'] = global['meepo'] || {};
    meepo = global['meepo'] || {};
}
export function getBmapAddressSelectService() {
    if (meepo['__bmapAddressSelectService']) {
        return meepo['__bmapAddressSelectService'];
    } else {
        meepo['__bmapAddressSelectService'] = new BmapAddressSelectService();
        return meepo['__bmapAddressSelectService'];
    }
}