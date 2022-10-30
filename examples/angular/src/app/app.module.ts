import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppProviderModule } from '../business-logic/domain/app.provider.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LatestAskStoriesComponent } from './story/latest-ask-stories/latest-ask-stories.component';
import { ShowStoryComponent } from './story/show-story/story.component';
import {DefaultNavigationService, NavigationService} from "./services/navigation.service";
import {Router} from "@angular/router";

@NgModule({
  declarations: [
    AppComponent,
    LatestAskStoriesComponent,
    ShowStoryComponent
  ],
  imports: [
    AppProviderModule,
    AppRoutingModule,
    BrowserModule,
  ],
  providers: [
    {
      provide: NavigationService,
      deps: [Router],
      useFactory: (router: Router) => new DefaultNavigationService(router),
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
