import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { StoreService } from 'meepo-store';
@Injectable()
export class SysinfoService {
    that: any;
    uniacid: string = this.store.get('__meepo_uniacid', '2');
    acid: string;
    siteroot: string = this.store.get('__meepo_siteroot', 'meepo.com.cn');
    sitehttp: string = this.store.get('__meepo_sitehttp', 'https');
    time:any = new Date().getTime();
    constructor(
        public store: StoreService
    ) {
        this.acid = this.uniacid;
        console.log('sysinfof service',this.time);
    }

    getSysinfo() {
        return this.that;
    }

    getUniacid() {
        this.uniacid = this.store.get('__meepo_uniacid', '2');
        return this.uniacid;
    }
    getAcid() {
        this.uniacid = this.store.get('__meepo_uniacid', '2');
        return this.uniacid;
    }

    setUniacid(uniacid: any) {
        this.uniacid = uniacid;
        this.store.set('__meepo_uniacid', uniacid);
    }

    getSiteRoot() {
        this.siteroot = this.store.get('__meepo_siteroot', 'meepo.com.cn');
        this.sitehttp = this.store.get('__meepo_sitehttp', 'https://');
        this.siteroot = this.siteroot.replace('https://', '');
        this.siteroot = this.siteroot.replace('http://', '');

        return this.sitehttp + this.siteroot + '/';
    }

    setSiteRoot(siteroot: string) {
        this.store.set('__meepo_siteroot', siteroot);
        this.siteroot = siteroot;
    }
}

