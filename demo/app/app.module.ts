import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { MeepoCoreModule } from 'meepo-core';
import { MeepoBmapModule } from '../../src/app/app';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    MeepoCoreModule,
    MeepoBmapModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

