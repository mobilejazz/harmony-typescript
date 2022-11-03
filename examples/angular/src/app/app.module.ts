import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LatestAskStoriesComponent } from './story/latest-ask-stories/latest-ask-stories.component';
import { ShowStoryComponent } from './story/show-story/story.component';
import { DefaultNavigationService, NavigationService } from "./services/navigation.service";
import { Router} from "@angular/router";
import {
  HackerNewsStoryProviderModule
} from "../features/hacker-news-story/hacker-news-story.provider.module";

@NgModule({
  declarations: [
    AppComponent,
    LatestAskStoriesComponent,
    ShowStoryComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    // Features
    HackerNewsStoryProviderModule
  ],
  providers: [
    {
      provide: NavigationService,
      deps: [Router],
      useFactory: (router: Router) => new DefaultNavigationService(router),
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
