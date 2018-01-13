import { NgModule } from '@angular/core';
import { MarkerService, bmapRichMarkerRoom } from './marker.service';
import { SocketModule, SocketRoom } from 'meepo-event';
import { BmapRichMarkerDirective } from './bmap-rich-marker';

@NgModule({
    imports: [
        SocketModule.forChild(new SocketRoom(bmapRichMarkerRoom))
    ],
    exports: [
        BmapRichMarkerDirective
    ],
    declarations: [
        BmapRichMarkerDirective
    ],
    providers: [
        MarkerService
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
