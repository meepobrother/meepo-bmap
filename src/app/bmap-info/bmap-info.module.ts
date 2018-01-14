import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


import { SocketModule } from 'meepo-event';
import { MeepoFormsModule } from 'meepo-forms';
import { SwiperModule } from 'meepo-swiper';

import { bmapInfoRoom, BmapInfoComponent } from './bmap-info';
import { BmapInfoStep1Component } from './bmap-info-step1/bmap-info-step1';
import { BmapInfoStep2Component } from './bmap-info-step2/bmap-info-step2';

import { PickerModule } from 'meepo-picker';
import { IconsModule } from 'meepo-icons';


@NgModule({
    imports: [
        CommonModule,
        SocketModule.forChild({ name: bmapInfoRoom }),
        PickerModule,
        ReactiveFormsModule,
        MeepoFormsModule,
        SwiperModule,
        IconsModule,
        RouterModule.forChild([{
            path: 'bmap',
            component: BmapInfoStep1Component,
            outlet: 'bmapInfo'
        }, {
            path: 'bmap-info-step2',
            component: BmapInfoStep2Component,
            outlet: 'bmapInfo'
        }])
    ],
    exports: [
        BmapInfoComponent
    ],
    declarations: [
        BmapInfoComponent,
        BmapInfoStep1Component,
        BmapInfoStep2Component
    ],
    providers: [],
})
export class BmapInfoModule { }
export { bmapInfoRoom, BmapInfoComponent, BMAP_INFO_SHOW } from './bmap-info';
