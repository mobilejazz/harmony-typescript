import { NgModule } from '@angular/core';
import { createAngularProviders } from '@mobilejazz/harmony-angular';

import { HackerNewsStoryProvider } from './hacker-news-story.provider';
import { GetHackerNewsLatestAskStoriesInteractor } from './domain/interactors/get-hacker-news-latest-ask-stories.interactor';
import { GetHackerNewsStoryInteractor } from './domain/interactors/get-hacker-news-story.interactor';
import { HackerNewsStoryDefaultProvider } from "./hacker-news-story.provider";

@NgModule({
  providers: createAngularProviders(
    {
      provide: HackerNewsStoryProvider,
      useFactory: () => new HackerNewsStoryDefaultProvider(
        // 'BUGFENDER_APP_KEY'
      ),
    },
    [
      GetHackerNewsLatestAskStoriesInteractor,
      GetHackerNewsStoryInteractor,
    ],
  ),
})
export class HackerNewsStoryProviderModule {}
