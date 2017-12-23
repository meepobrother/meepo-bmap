import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
@Injectable()
export class BmapAddressSelectService {
    show$: Subject<any> = new Subject();

    time: any = new Date().getTime();
    constructor() { 
        console.log('BmapAddressSelectService is', this.time);
    }

    show() {
        this.show$.next({ show: true });
    }

    close(data: any) {
        this.show$.next({ show: false, data: data });
    }
}