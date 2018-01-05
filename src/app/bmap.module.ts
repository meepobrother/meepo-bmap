import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BmapComponent } from './bmap/bmap';
import { BmapService } from './bmap.service';
import { BmapAddressSelectService, getBmapAddressSelectService } from './bmap-address-select.service';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/combineLatest';
import { BmapAddressSelectComponent } from './bmap/bmap-address-select/bmap-address-select';
import { BmapContainerComponent } from './bmap-container/bmap-container';
import { BmapAddressSearchComponent } from './bmap-address-search/bmap-address-search';
import { BmapInputComponent } from './bmap-input/bmap-input';
import { BmapFooterComponent } from './bmap-footer/bmap-footer';

import { GetWidthDirective } from './bmap/getWidth';
import { XscrollModule } from 'meepo-xscroll';
import { IconsModule } from 'meepo-icons';

const BmapComponents: any[] = [
    BmapComponent,
    BmapAddressSelectComponent,
    GetWidthDirective,
    BmapContainerComponent,
    BmapAddressSearchComponent,
    BmapInputComponent,
    BmapFooterComponent
];

import { MeepoCoreServiceModule } from 'meepo-core';
import { AxiosModule } from 'meepo-axios';
import { StoreModule } from 'meepo-store';
import { LoaderModule } from 'meepo-loader';
import { EventModule } from 'meepo-event';
import { MinirefreshModule } from 'meepo-minirefresh';

@NgModule({
    imports: [
        CommonModule,
        AxiosModule,
        MeepoCoreServiceModule,
        StoreModule,
        XscrollModule,
        LoaderModule.forRoot({
            root: ''
        }),
        EventModule.forRoot(),
        MinirefreshModule,
        IconsModule
    ],
    exports: [
        ...BmapComponents
    ],
    declarations: [
        ...BmapComponents
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
