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

export function getBmapAddressSelectService() {
    if (window['__bmapAddressSelectService']) {
        return window['__bmapAddressSelectService'];
    } else {
        window['__bmapAddressSelectService'] = new BmapAddressSelectService();
        return window['__bmapAddressSelectService'];
    }
}