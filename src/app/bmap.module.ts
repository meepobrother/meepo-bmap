import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BmapComponent } from './bmap/bmap';
import { BmapService } from './bmap.service';
import { SysinfoService } from './sysinfo.service';
import { BmapAddressSelectService, getBmapAddressSelectService } from './bmap-address-select.service';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/combineLatest';
import { BmapAddressSelectComponent } from './bmap/bmap-address-select/bmap-address-select';
import { PickerModule } from 'meepo-picker';
const BmapComponents: any[] = [
    BmapComponent,
    BmapAddressSelectComponent,
];
import { MeepoCoreServiceModule } from 'meepo-core';
import { AxiosModule } from 'meepo-axios';
import { StoreModule } from 'meepo-store';

@NgModule({
    imports: [
        CommonModule,
        AxiosModule,
        MeepoCoreServiceModule,
        PickerModule,
        StoreModule
    ],
    exports: [
        BmapComponents
    ],
    declarations: [
        BmapComponents
    ],
    providers: [
        BmapService,
        SysinfoService,
        {
            provide: BmapAddressSelectService,
            useFactory: getBmapAddressSelectService
        }
    ]
})
export class MeepoBmapModule {}
