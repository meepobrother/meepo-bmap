import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { MeepoCoreModule, MeepoCoreServiceModule } from 'meepo-core';
import { MeepoBmapModule } from 'meepo-bmap';
// import { MeepoBmapModule } from '../../src/app/app';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    MeepoCoreModule.forRoot(),
    MeepoCoreServiceModule.forRoot(),
    MeepoBmapModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

