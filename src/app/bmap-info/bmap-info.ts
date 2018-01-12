import {
    Component, OnInit, ChangeDetectorRef, Input, ViewEncapsulation,
    ElementRef, ViewChild, ChangeDetectionStrategy, AfterContentInit
} from '@angular/core';
import { MarkerService } from '../marker.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SwiperWrapComponent } from 'meepo-swiper';

@Component({
    selector: 'bmap-info',
    templateUrl: './bmap-info.html',
    styleUrls: ['./bmap-info.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BmapInfoComponent implements OnInit, AfterContentInit {
    @Input() info: any = {};
    @Input() show: boolean = false;
    @Input() menus: any[] = [];
    @Input() others: any[] = [];
    @ViewChild(SwiperWrapComponent) main: SwiperWrapComponent;

    @Input() has: boolean = false;
    @Input() selectSkill: boolean = true;
    form: FormGroup;
    constructor(
        public marker: MarkerService,
        public cd: ChangeDetectorRef,
        public fb: FormBuilder
    ) {
        this.form = this.fb.group({
            skill: [{}],
            time: [{}]
        });

    }

    ngOnInit() { }

    ngAfterContentInit() {
        this.form.get('skill').valueChanges.subscribe(res => {
            this.selectSkill = false;
            this.updateSwiper();
        });
        this.form.get('time').valueChanges.subscribe(res => {
            console.log('time picker', res);
            this.updateSwiper();
        });
        this.marker.showInfo.subscribe(res => {
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
                this.info = res;
                this.show = true;
                this.has = true;
                this.selectSkill = true;
                console.log(this);
                this.cd.markForCheck();
            }, 0);
        });
    }

    updateSwiper() {
        setTimeout(() => {
            this.main.swiper.update();
        }, 300);
    }

    hidden() {
        this.show = false;
    }

    timePicker(e: any) {
        console.log(e);
    }
}