import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {Media} from "@ionic-native/media/ngx";
import {File} from "@ionic-native/file/ngx";
import {FileTransfer} from '@ionic-native/file-transfer/ngx';
import {FileChooser} from '@ionic-native/file-chooser/ngx';
import {FilePath} from '@ionic-native/file-path/ngx';
import { HttpClientModule } from '@angular/common/http';
import { NativeRingtones } from '@ionic-native/native-ringtones/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule,HttpClientModule, IonicModule.forRoot(), AppRoutingModule,FormsModule],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Media,
    File,
    FileTransfer,
    FileChooser,
    FilePath,
    NativeRingtones,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
