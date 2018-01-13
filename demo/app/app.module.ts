import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { MeepoCoreModule, MeepoCoreServiceModule } from 'meepo-core';

import { MeepoBmapModule } from '../../src/app/app';
import { IconsModule } from 'meepo-icons';
import { SocketModule } from 'meepo-event';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    MeepoCoreModule.forRoot(),
    MeepoBmapModule,
    IconsModule,
    SocketModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
