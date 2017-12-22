import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { ReactiveFormsModule } from '@angular/forms';

import { BmapComponent } from './bmap/bmap';
import { BmapService } from './bmap.service';
import { ApiService } from './api.service';
import { SysinfoService } from './sysinfo.service';
import { RunnerService } from './runner.service';


import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/combineLatest';

import { MeepoCoreModule } from 'meepo-core';

const BmapComponents: any[] = [
    BmapComponent
];
@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        HttpClientModule,
        MeepoCoreModule.forRoot()
    ],
    exports: [
        BmapComponents
    ],
    declarations: [
        BmapComponents
    ],
    providers: [
        BmapService,
        ApiService,
        SysinfoService,
        RunnerService
    ],
})
export class MeepoBmapModule { }
