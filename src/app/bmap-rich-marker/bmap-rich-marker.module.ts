import { NgModule, Provider, Optional, SkipSelf } from '@angular/core';
import { MarkerService, bmapRichMarkerRoom } from './marker.service';
import { SocketModule, SocketRoom, SocketService } from 'meepo-event';
import { BmapRichMarkerDirective } from './bmap-rich-marker';
import { LoaderService } from 'meepo-loader';
import { CommonModule } from '@angular/common';

export function markerFactory(socket: SocketService, loader: LoaderService, exist: MarkerService): MarkerService {
    return exist || new MarkerService(socket, loader);
}
export const MarkerServiceProvider: Provider = {
    provide: MarkerService,
    useFactory: markerFactory,
    deps: [SocketService, LoaderService, [new Optional(), new SkipSelf(), SocketService]]
};

@NgModule({
    imports: [
        CommonModule,
        SocketModule.forChild({ name: bmapRichMarkerRoom }),
    ],
    exports: [
        BmapRichMarkerDirective
    ],
    declarations: [
        BmapRichMarkerDirective
    ],
    providers: [
        MarkerServiceProvider
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
