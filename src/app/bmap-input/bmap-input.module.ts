import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocketModule } from 'meepo-event';
import { bmapInputRoom, BmapInputComponent } from './bmap-input';
@NgModule({
    imports: [
        CommonModule,
        SocketModule.forChild({ name: bmapInputRoom })
    ],
    exports: [
        BmapInputComponent
    ],
    declarations: [
        BmapInputComponent
    ],
    providers: [],
})
export class BmapInputModule { }
