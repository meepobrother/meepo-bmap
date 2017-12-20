import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
declare const require;
const store: any = require('store');

@Injectable()
export class SysinfoService {
    that: any;
    uniacid: string = store.get('__meepo_uniacid', '2');
    acid: string;
    siteroot: string = store.get('__meepo_siteroot', 'meepo.com.cn');
    sitehttp: string = store.get('__meepo_sitehttp', 'https');

    constructor() {
        this.acid = this.uniacid;
    }

    getSysinfo() {
        this.that = this.that || new SysinfoService();
        return this.that;
    }

    getUniacid() {
        this.uniacid = store.get('__meepo_uniacid', '2');
        return this.uniacid;
    }
    getAcid() {
        this.uniacid = store.get('__meepo_uniacid', '2');
        return this.uniacid;
    }

    setUniacid(uniacid: any) {
        this.uniacid = uniacid;
        store.set('__meepo_uniacid', uniacid);
    }

    getSiteRoot() {
        this.siteroot = store.get('__meepo_siteroot', 'meepo.com.cn');
        this.sitehttp = store.get('__meepo_sitehttp', 'https://');
        this.siteroot = this.siteroot.replace('https://', '');
        this.siteroot = this.siteroot.replace('http://', '');

        return this.sitehttp + this.siteroot + '/';
    }

    setSiteRoot(siteroot: string) {
        store.set('__meepo_siteroot', siteroot);
        this.siteroot = siteroot;
    }
}

