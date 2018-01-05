import { Component, OnInit, ChangeDetectionStrategy, ElementRef, ViewChild } from '@angular/core';
import { CoreService } from 'meepo-core';
import {
  BmapAddressSelectService,
  BmapInputComponent,
  BmapFooterComponent
} from '../../src/app/app';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  title = 'app';
  height: string;

  @ViewChild('save') _saveRef: ElementRef;

  @ViewChild(BmapFooterComponent) _footer: BmapFooterComponent;
  @ViewChild(BmapInputComponent) _input: BmapInputComponent;
  

  address: any = {
    address: '',
    detail: '',
    point: {}
  };
  constructor(
    public core: CoreService,
  ) { }

  ngOnInit() {
    console.log(this.core.time);
    // this.address.show();
  }

  onFinish(e: any) {
    console.log(e);
  }

  onMyLocation() { }

  setHeight(e: number) {
    this.height = 'calc( 100% - ' + (e + this._saveRef.nativeElement.clientHeight) + 'px)';
  }

  onSave(e: any) {
    this.address.address = e.address;
    this.address.detail = e.detail;
  }

  centerChange(e: any) {
    this.address.point = e;
  }

  doSave() {
    this.address.address = this._input.getKey();
    this.address.detail = this._footer.getDetail();
    console.log(this.address);
  }
}
