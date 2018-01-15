import {
    Component, OnInit, ChangeDetectorRef, Input, ViewEncapsulation,
    ElementRef, ViewChild, ChangeDetectionStrategy, AfterContentInit,
    Injector
} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SwiperWrapComponent } from 'meepo-swiper';
import { SocketService } from 'meepo-event';
import { bmapContainerRoom } from '../bmap-container/bmap-container';
import { BMAP_CLICK } from '../event';

export const bmapInfoRoom = 'bmapInfoRoom';
export const BMAP_INFO_SHOW = 'BMAP_INFO_SHOW';
import { CorePage } from 'imeepos-core';

@Component({
    selector: 'bmap-info',
    templateUrl: './bmap-info.html',
    styleUrls: ['./bmap-info.scss'],
    encapsulation: ViewEncapsulation.None
})
export class BmapInfoComponent extends CorePage {
    @Input() info: any = {};
    @Input() show: boolean = false;
    @Input() menus: any[] = [];
    @Input() others: any[] = [];
    @ViewChild(SwiperWrapComponent) main: SwiperWrapComponent;

    @Input() has: boolean = false;
    @Input() selectSkill: boolean = true;
    form: FormGroup;
    constructor(
        public cd: ChangeDetectorRef,
        public fb: FormBuilder,
        public event: SocketService,
        public injector: Injector
    ) {
        super(injector, 'BmapInfoComponent');
        this.form = this.fb.group({
            skill: [{}],
            time: [{}]
        });
        this.form.get('skill').valueChanges.subscribe(res => {
            this.selectSkill = false;
            this.cd.markForCheck();
        });
        this.event.on(bmapContainerRoom, (res) => {
            switch (res.type) {
                case BMAP_CLICK:
                    this.hidden();
                    break;
                default:
                    break;
            }
        });
        this.on((res) => {
            switch (res.type) {
                case BMAP_INFO_SHOW:
                    this.show = true;
                    this.has = true;
                    this.info = res.data.data;
                    this.selectSkill = true;
                    this.cd.detectChanges();
                    break;
                default:
                    break;
            }
        });
    }

    private on(fn: Function) {
        this.event.on(bmapInfoRoom, fn);
    }

    private emit(data: any) {
        this.event.emit(bmapInfoRoom, data);
    }

    ngOnInit() {
        this.cd.detectChanges();
    }

    ngAfterContentInit() {
        this.form.get('skill').valueChanges.subscribe(res => {
            this.selectSkill = false;
            this.updateSwiper();
        });
        this.form.get('time').valueChanges.subscribe(res => {
            this.updateSwiper();
        });
        setTimeout(() => {
            this.menus = [{
                title: '修空调',
                icon: 'ios-clock-outline'
            }, {
                title: '修马桶',
                icon: 'ios-clock-outline'
            }, {
                title: '洗衣做饭',
                icon: 'ios-clock-outline'
            }, {
                title: '带孩子',
                icon: 'ios-clock-outline'
            }, {
                title: '催乳',
                icon: 'ios-clock-outline'
            }];
            this.others = [{
                title: '咨询',
                icon: 'ios-bell-outline'
            }, {
                title: '记录',
                icon: 'ios-paw-outline'
            }, {
                title: '资料',
                icon: 'ios-person-outline'
            }];
        }, 0);
    }

    updateSwiper() {
        setTimeout(() => {
            this.main.swiper.update();
        }, 300);
    }

    hidden() {
        this.has = false;
        this.cd.markForCheck();
    }

    timePicker(e: any) {
        console.log(e);
    }
}