import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MirrorInfrastructureModule } from './mirror-infrastructure/mirror-infrastructure.module';
import { ComponentLayoutModule as MirrorComponentLayoutModule } from 'mirror-component-layout';
import { CoreModule as MirrorCoreModule } from 'mirror-core';
import { HttpClientModule } from '@angular/common/http';
import { ComponentSetModule as MirrorComponentSetModule } from 'mirror-component-set';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        AppRoutingModule,
        MirrorCoreModule.forRoot(),
        MirrorInfrastructureModule.forRoot(),
        MirrorComponentLayoutModule,
        MirrorComponentSetModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
