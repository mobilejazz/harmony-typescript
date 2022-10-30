import { NgModule } from '@angular/core';

import { AppDefaultProvider, AppProvider } from './app.provider';
import { GetHackerNewsLatestAskStoriesInteractor } from './interactors/get-hacker-news-latest-ask-stories.interactor';
import { GetHackerNewsStoryInteractor } from './interactors/get-hacker-news-story.interactor';

@NgModule({
  providers: [
    {
      provide: AppProvider,
      deps: [],
      useFactory: () => {
        return new AppDefaultProvider();
      },
    },
    {
      provide: GetHackerNewsLatestAskStoriesInteractor,
      deps: [AppProvider],
      useFactory: (provider: AppProvider) => provider.getHackerNewsLatestAskStories(),
    },
    {
      provide: GetHackerNewsStoryInteractor,
      deps: [AppProvider],
      useFactory: (provider: AppProvider) => provider.getHackerNewsStory(),
    },
  ]
})
export class AppProviderModule { }
