import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BmapComponent } from './bmap/bmap';
import { BmapService } from './bmap.service';
import { ApiService } from './api.service';
import { SysinfoService } from './sysinfo.service';
import { RunnerService } from './runner.service';
import { BmapAddressSelectService, getBmapAddressSelectService } from './bmap-address-select.service';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/combineLatest';
import { BmapAddressSelectComponent } from './bmap/bmap-address-select/bmap-address-select';
import { BmapOrderInfoComponent } from './bmap/bmap-order-info/bmap-order-info';
import { PickerModule } from 'meepo-picker';
const BmapComponents: any[] = [
    BmapComponent,
    BmapAddressSelectComponent,
    BmapOrderInfoComponent
];
import { MeepoCoreServiceModule } from 'meepo-core';
import { AxiosModule } from 'meepo-axios';
@NgModule({
    imports: [
        CommonModule,
        AxiosModule,
        MeepoCoreServiceModule,
        PickerModule
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
        RunnerService,
        {
            provide: BmapAddressSelectService,
            useFactory: getBmapAddressSelectService
        }
    ]
})
export class MeepoBmapModule {}
