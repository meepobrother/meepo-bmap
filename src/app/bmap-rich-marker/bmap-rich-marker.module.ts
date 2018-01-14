import { NgModule, Provider, Optional, SkipSelf } from '@angular/core';
import { MarkerService, bmapRichMarkerRoom } from './marker.service';
import { SocketModule, SocketRoom, SocketService } from 'meepo-event';
import { BmapRichMarkerDirective } from './bmap-rich-marker';
import { LoggerModule, LOGGER_STATE } from 'meepo-logger';
import { LoaderService } from 'meepo-loader';




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
        MarkerServiceProvider,
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
