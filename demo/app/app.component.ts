import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CoreService } from 'meepo-core';
import { BmapAddressSelectService } from '../../src/app/app';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  title = 'app';
  constructor(
    public core: CoreService,
    public address: BmapAddressSelectService
  ) { }

  ngOnInit() {
    console.log(this.core.time);
    this.address.show();
  }

  onFinish(e: any) {
    console.log(e);
  }
}
