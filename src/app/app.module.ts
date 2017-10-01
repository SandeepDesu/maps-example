import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { MapComponent } from './../pages/maps/maps.component';
import { MapService } from './../services/mapservice.services';
import { MapPointer } from './../pages/pointer/pointer.component';
@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    MapPointer
  ],
  imports: [
    BrowserModule,
    HttpModule
  ],
  providers: [MapService],
  bootstrap: [AppComponent]
})
export class AppModule { }
