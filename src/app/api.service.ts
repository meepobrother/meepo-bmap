import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SysinfoService } from './sysinfo.service';
declare const require;
const Base64: any = require('js-base64').Base64;
import { Subject } from 'rxjs/Subject';
const store: any = require('store');
// import * as store from 'store';
import { DOCUMENT } from '@angular/common';

@Injectable()
export class ApiService {
    that: any;
    header: HttpHeaders = new HttpHeaders();
    onInit: Subject<any> = new Subject();
    openid: string = store.get('__meepo_openid', 'fromUser');
    constructor(
        public http: HttpClient,
        @Inject(DOCUMENT) public document: any,
        public sysinfo: SysinfoService
    ) {
        this.header.append('Content-Type', 'application/x-www-form-urlencoded');
        this.header.append('Access-Control-Allow-Origin', '*');
        this.header.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
        this.header.append('Content-Type', 'application/json');
        this.header.append('Accept', 'application/json');
    }

    setSiteroot(siteroot: string) {
        this.sysinfo.siteroot = siteroot;
    }


    mget<T>(__do: string = 'index', __module: string = 'imeepos_runner'): Observable<T> {
        const url = this.murl('entry//open', { m: 'imeepos_runner', __do: __do });
        return this.http.get<T>(url, { headers: this.header });
    }

    murl(segment: string, params: any = {}, isCloud: boolean = false) {
        const segments = segment.split('/');
        const __controller = segments[0];
        const __action = segments[1];
        const __do = segments[2];
        let str = '';
        for (const key in params) {
            str += "&" + key + "=" + params[key];
        }
        const uniacid = store.get('__meepo_uniacid', '2');
        const siteroot = store.get('__meepo_siteroot', 'meepo.com.cn');
        if (isCloud) {
            return `https://meepo.com.cn/app/index.php?c=${__controller}&do=${__do}&a=${__action}&i=2&j=2${str}`;
        } else {
            return `${this.sysinfo.getSiteRoot()}app/index.php?c=${__controller}&do=${__do}&a=${__action}&i=${uniacid}&j=${uniacid}${str}`;
        }
    }

    wurl(segment: string, params: any = {}) {
        const segments = segment.split('/');
        const __controller = segments[0];
        const __action = segments[1];
        const __do = segments[2];
        let str = '';
        for (const key in params) {
            str += '&' + key + '=' + params[key];
        }
        return `${this.sysinfo.siteroot}web/index.php?c=${__controller}&` +
            `do=${__do}&a=${__action}&i=${this.sysinfo.getUniacid()}&j=${this.sysinfo.getAcid()}${str}`;
    }

    doMobileUrl(__do: string, __module: string) {
        return this.murl('entry//' + __do, { m: __module });
    }

    doWebUrl(__do: string, __module: string) {
        return this.wurl('site/entry/' + __do, { m: __module });
    }

    mpost<T>(__do: string = 'index', __body: any = {}, __module: string = 'imeepos_runner', isCloud: boolean = false): Observable<T> {
        const url = this.murl('entry//open', { m: 'imeepos_runner', __do: __do }, isCloud);
        __body['__meepo_openid'] = store.get('__meepo_openid', 'fromUser');
        __body['__meepo_rcode'] = store.get('__meepo_rcode', '');

        const d = JSON.stringify(__body);
        const encrypted = Base64.encode(d);
        if (url.indexOf('http://') !== -1 && window.location.protocol !== 'http:') {
            return this.mpost('cloud.getCloudUrl', { url: url, data: { encrypted: encrypted } }, 'imeepos_runner', true);
        } else {
            return this.http.post<T>(url, { encrypted: encrypted }, { headers: this.header });
        }
    }

    entry(__body: any = {}) {
        const d = JSON.stringify(__body);
        const encrypted = Base64.encode(d);
        return { encrypted: encrypted };
    }

    wget<T>(__do: string = 'index', __module: string = 'imeepos_runner'): Observable<T> {
        const params =
            new HttpParams()
                .set('c', 'site')
                .set('a', 'entry')
                .set('do', 'open')
                .set('i', this.sysinfo.getUniacid() || '2')
                .set('j', this.sysinfo.getAcid() || '2')
                .set('__do', __do)
                .set('m', __module);
        return this.http.get<T>('web', { params: params });
    }

    wpost<T>(__do: string = 'index', __body: any = {}, __module: string = 'imeepos_runner'): Observable<T> {
        const urlStr: string = this.doWebUrl(__do, __module);
        const d = JSON.stringify(__body);
        const encrypted = Base64.encode(d);
        return this.http.post<T>(urlStr, { encrypted: encrypted });
    }

    isSqlError(val: string) {
        console.log(val);
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

