import { NgModule } from '@angular/core';
import { SocketModule, SocketRoom } from 'meepo-event';
import { BmapContainerComponent, bmapContainerRoom } from './bmap-container';

@NgModule({
    imports: [
        SocketModule.forChild(new SocketRoom(bmapContainerRoom))
    ],
    exports: [
        BmapContainerComponent
    ],
    declarations: [
        BmapContainerComponent
    ],
    providers: [],
})
export class BmapContainerModule { }
export { BmapContainerComponent, bmapContainerRoom } from './bmap-container';

