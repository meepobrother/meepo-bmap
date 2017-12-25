import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CoreService } from 'meepo-core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  title = 'app';
  constructor(
    public core: CoreService
  ) { }

  ngOnInit() {
    console.log(this.core.time);
  }

  onFinish(e: any) {
    console.log(e);
  }
}
