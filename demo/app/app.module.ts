import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { MeepoCoreModule, MeepoCoreServiceModule } from 'meepo-core';

import { MeepoBmapModule } from '../../src/app/app';
import { IconsModule } from 'meepo-icons';
import { SocketModule } from 'meepo-event';
import { ICoreModule, IRootPage } from 'imeepos-core';



@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    MeepoCoreModule.forRoot(),
    MeepoBmapModule,
    IconsModule,
    SocketModule.forRoot(),
    ICoreModule.forRoot(),
    RouterModule.forRoot([{
      path: '',
      redirectTo: 'bmap',
      pathMatch: 'full'
    },{
      path: 'bmap',
      component: AppComponent
    }], {
        useHash: true
      })
  ],
  providers: [],
  bootstrap: [IRootPage]
})
export class AppModule { }
