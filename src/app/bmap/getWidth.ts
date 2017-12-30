import { Directive, Input, Output, EventEmitter, ElementRef, OnInit, AfterContentChecked } from '@angular/core';

@Directive({ selector: '[getWidth]' })
export class GetWidthDirective implements OnInit, AfterContentChecked {
    @Output() getWidth: EventEmitter<any> = new EventEmitter();
    constructor(
        public ele: ElementRef
    ) { }
    ngOnInit() { }

    ngAfterContentChecked() {
        let width = this.ele.nativeElement.clientWidth;
        this.getWidth.emit(width);
    }
}