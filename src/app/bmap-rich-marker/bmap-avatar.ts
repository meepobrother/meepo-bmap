import { Directive, ElementRef, EventEmitter, Output, AfterContentInit } from '@angular/core';
import { MarkerService } from '../marker.service';

@Directive({ selector: '[bmapAvatar]' })
export class BmapAvatarDirective implements AfterContentInit {
    @Output() bmapAvatar: EventEmitter<any> = new EventEmitter();
    constructor(
        public ele: ElementRef,
        public marker: MarkerService
    ) {

    }

    ngAfterContentInit() {
        this.bmapAvatar.next(this.ele.nativeElement);
    }
}