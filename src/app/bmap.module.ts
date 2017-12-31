import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BmapComponent } from './bmap/bmap';
import { BmapService } from './bmap.service';
import { BmapAddressSelectService, getBmapAddressSelectService } from './bmap-address-select.service';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/combineLatest';
import { BmapAddressSelectComponent } from './bmap/bmap-address-select/bmap-address-select';
import { GetWidthDirective } from './bmap/getWidth';
import { XscrollModule } from 'meepo-xscroll';
const BmapComponents: any[] = [
    BmapComponent,
    BmapAddressSelectComponent,
    GetWidthDirective
];
import { MeepoCoreServiceModule } from 'meepo-core';
import { AxiosModule } from 'meepo-axios';
import { StoreModule } from 'meepo-store';

@NgModule({
    imports: [
        CommonModule,
        AxiosModule,
        MeepoCoreServiceModule,
        StoreModule,
        XscrollModule
    ],
    exports: [
        BmapComponents
    ],
    declarations: [
        BmapComponents
    ],
    providers: [
        BmapService,
        {
            provide: BmapAddressSelectService,
            useFactory: getBmapAddressSelectService
        }
    ]
})
export class MeepoBmapModule {}
