import { NgModule } from '@angular/core';
import { MarkerService, bmapRichMarkerRoom } from './marker.service';
import { SocketModule, SocketRoom } from 'meepo-event';
import { BmapRichMarkerDirective } from './bmap-rich-marker';
import { LoggerModule, LOGGER_STATE } from 'meepo-logger';

@NgModule({
    imports: [
        SocketModule.forChild({ name: bmapRichMarkerRoom }),
        LoggerModule
    ],
    exports: [
        BmapRichMarkerDirective
    ],
    declarations: [
        BmapRichMarkerDirective
    ],
    providers: [
        MarkerService,
        { provide: LOGGER_STATE, useValue: true }
    ]
})
export class BmapMarkerModule { }
export { BmapRichMarkerDirective } from './bmap-rich-marker';
export {
    MarkerService, bmapRichMarkerRoom,
    BMAP_RICH_MARKER_ADD_RUNNERS,
    BMAP_RICH_MARKER_CLICK,
    BMAP_RICH_MARKER_LOADED,
    BMAP_RICH_MARKER_RUNNERS_ADDED
} from './marker.service';
