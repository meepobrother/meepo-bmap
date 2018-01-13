import {
  Component, OnInit, ChangeDetectionStrategy,
  ElementRef, ViewChild, ChangeDetectorRef,
  ViewEncapsulation, Input
} from '@angular/core';

import {
  BmapAddressSelectService,
  BmapInputComponent,
  BmapFooterComponent,
  BMAP_LOCATION_SUCCESS,
  BMAP_MOVEEND, MarkerService,
  bmapRichMarkerRoom,
  bmapContainerRoom,
  BMAP_RICH_MARKER_ADD_RUNNERS,
  BMAP_RICH_MARKER_CLICK
} from '../../src/app/app';

declare const BMap: any;

import { CoreService } from 'meepo-core';
import { SocketService } from 'meepo-event';
import { AxiosService } from 'meepo-axios';
import { StoreService } from 'meepo-store';


import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  items: Subject<any> = new Subject();
  _items: any[] = [];
  key: string = 'meepo.bmap.runners';
  tip: string;

  move$: Subject<any> = new Subject();
  constructor(
    public core: CoreService,
    public event: SocketService,
    public cd: ChangeDetectorRef,
    public marker: MarkerService,
    public axios: AxiosService,
    public store: StoreService
  ) {
    this.event.on(bmapContainerRoom, (res: any) => {
      switch (res.type) {
        case BMAP_LOCATION_SUCCESS:
          this.move$.next(res.data);
          break;
        case BMAP_MOVEEND:
          this.move$.next(res.data);
          break;
        default:
          break;
      }
    });

    this.event.on(bmapRichMarkerRoom, (res: any) => {
      switch (res.type) {
        case BMAP_RICH_MARKER_CLICK:
          console.log(res.data);
          break;
        default:
          break;
      }
    })

    this.move$.debounceTime(1000).subscribe(res => {
      this.createRandomPoint(res);
    });
  }

  ngOnInit() {

  }

  createRandomPoint(res) {
    let runners: any[] = this.store.get(this.key, []);
    if (runners && runners.length > 0) {
      this.event.emit(bmapRichMarkerRoom, { type: BMAP_RICH_MARKER_ADD_RUNNERS, data: runners });
    } else {
      let url1 = this.core.murl('entry//open', { m: 'imeepos_runner', __do: 'runner.createRandom' }, false);
      this.axios.bpost(url1, { ...res }).subscribe((data: any) => {
        let url = this.core.murl('entry//open', { m: 'imeepos_runner', __do: 'runner.getNearBy' }, false);
        this.axios.bpost(url, { lat: res.lat, lng: res.lng }).subscribe((data: any) => {
          this.tip = data.msg;
          this.event.emit(bmapRichMarkerRoom, { type: BMAP_RICH_MARKER_ADD_RUNNERS, data: data.info });
          this.store.set(this.key, data.info);
        });
      });
    }
  }
}
