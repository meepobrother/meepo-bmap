import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
@Injectable()
export class BmapAddressSelectService {
    show$: Subject<any> = new Subject();
    constructor() { }

    show() {
        this.show$.next({ show: true });
    }

    close(data: any) {
        this.show$.next({ show: false, data: data });
    }
}