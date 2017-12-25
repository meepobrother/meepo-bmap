import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { SysinfoService } from './sysinfo.service';
import { Subject } from 'rxjs/Subject';
declare const require;
const store: any = require('store');
import { DOCUMENT } from '@angular/common';
import { AxiosService } from 'meepo-axios';
import { CoreService } from 'meepo-core';
@Injectable()
export class ApiService {
    that: any;
    onInit: Subject<any> = new Subject();
    openid: string = store.get('__meepo_openid', 'fromUser');
    constructor(
        @Inject(DOCUMENT) public document: any,
        public sysinfo: SysinfoService,
        public axios: AxiosService,
        public core: CoreService
    ) {

    }

    setSiteroot(siteroot: string) {
        this.sysinfo.siteroot = siteroot;
    }


    mget<T>(__do: string = 'index', __module: string = 'imeepos_runner'): Observable<T> {
        let get$: Subject<T> = new Subject();
        const url = this.core.murl('entry//open', { m: __module, __do: __do }, false);
        this.axios.get<T>(url).then((res: any) => {
            get$.next(res.data);
        });
        return get$.asObservable();
    }

    murl(segment: string, params: any = {}, isCloud: boolean = false) {
        return this.core.murl(segment, params, isCloud);
    }

    wurl(segment: string, params: any = {}) {
        return this.core.wurl(segment, params);
    }

    doMobileUrl(__do: string, __module: string) {
        return this.murl('entry//' + __do, { m: __module });
    }

    doWebUrl(__do: string, __module: string) {
        return this.wurl('site/entry/' + __do, { m: __module });
    }

    mpost<T>(__do: string = 'index', __body: any = {}, __module: string = 'imeepos_runner', isCloud: boolean = false): Observable<T> {
        const url = this.murl('entry//open', { m: 'imeepos_runner', __do: __do }, isCloud);
        let mpost$: Subject<T> = new Subject();
        __body['__meepo_openid'] = store.get('__meepo_openid', 'fromUser');
        __body['__meepo_rcode'] = store.get('__meepo_rcode', '');
        this.axios.bpost<T>(url, __body).then((res: any) => {
            mpost$.next(res.data);
        });
        return mpost$.asObservable();
    }

    entry(__body: any = {}) {
        return this.axios.entry(__body);
    }

    wget<T>(__do: string = 'index', __module: string = 'imeepos_runner'): Observable<T> {
        let get$: Subject<T> = new Subject();
        const url = this.core.wurl('entry//open', { m: __module, __do: __do });
        this.axios.get<T>(url).then((res: any) => {
            get$.next(res.data);
        });
        return get$.asObservable();
    }

    wpost<T>(__do: string = 'index', __body: any = {}, __module: string = 'imeepos_runner'): Observable<T> {
        let post$: Subject<T> = new Subject();
        const url = this.core.wurl('entry//open', { m: __module, __do: __do });
        this.axios.bpost<T>(url,__body).then((res: any) => {
            post$.next(res.data);
        });
        return post$.asObservable();
    }

    isSqlError(val: string) {
        if (typeof val === 'string') {
            val = val.toLowerCase().trim();
            return val.indexOf('sql:') >= 0;
        } else {
            return false;
        }
    }

    loadJScript(src: string, key: string) {
        return Observable.create(obser => {
            const script = this.document.createElement('script');
            script.type = 'text/javascript';
            script.src = src;
            script.onload = () => {
                obser.next(window[key]);
                obser.complete();
            };
            script.onerror = () => {
                obser.error();
                obser.complete();
            };
            this.document.body.appendChild(script);
        });

    }
}

