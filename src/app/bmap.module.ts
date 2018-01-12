import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
import { BmapCenterIconComponent } from './bmap-center-icon/bmap-center-icon';
import { BmapRichMarkerDirective } from './bmap-rich-marker/bmap-rich-marker';
import { BmapAvatarDirective } from './bmap-rich-marker/bmap-avatar';
import { BmapInfoComponent } from './bmap-info/bmap-info';


import { GetWidthDirective } from './bmap/getWidth';
import { XscrollModule } from 'meepo-xscroll';
import { IconsModule } from 'meepo-icons';
import { MeepoFormsModule } from 'meepo-forms';

import { MarkerService } from './marker.service';

const BmapComponents: any[] = [
    BmapComponent,
    BmapAddressSelectComponent,
    GetWidthDirective,
    BmapContainerComponent,
    BmapAddressSearchComponent,
    BmapInputComponent,
    BmapFooterComponent,
    BmapCenterIconComponent,
    BmapRichMarkerDirective,
    BmapAvatarDirective,
    BmapInfoComponent,
];

import { MeepoCoreServiceModule } from 'meepo-core';
import { AxiosModule } from 'meepo-axios';
import { StoreModule } from 'meepo-store';
import { LoaderModule } from 'meepo-loader';
import { EventModule } from 'meepo-event';
import { SwiperModule } from 'meepo-swiper';
import { PickerModule } from 'meepo-picker';


import { MinirefreshModule } from 'meepo-minirefresh';
import { ReactiveFormsModule } from '@angular/forms';
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
        IconsModule,
        FormsModule,
        MeepoFormsModule,
        SwiperModule.forRoot(),
        ReactiveFormsModule,
        PickerModule
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
        },
        MarkerService
    ]
})
export class MeepoBmapModule { }
