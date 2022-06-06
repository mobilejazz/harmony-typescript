import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppProviderModule } from '../domain/app.provider.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LatestAskStoriesComponent } from './components/latest-ask-stories/latest-ask-stories.component';
import { ShowStoryComponent } from './components/show-story/show-story.component';

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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
