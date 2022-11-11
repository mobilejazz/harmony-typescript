import { HackerNewsStoryProvider } from './hacker-news-story.provider';
import { GetHackerNewsLatestAskStoriesInteractor } from './domain/interactors/get-hacker-news-latest-ask-stories.interactor';
import { GetHackerNewsStoryInteractor } from './domain/interactors/get-hacker-news-story.interactor';
import { HackerNewsStoryDefaultProvider } from "./hacker-news-story.provider";
import { NgModule } from "@angular/core";

@NgModule({
  providers: [
    {
      provide: HackerNewsStoryProvider,
      deps: [],
      useFactory: () => new HackerNewsStoryDefaultProvider(),
    },
    {
      provide: GetHackerNewsLatestAskStoriesInteractor,
      deps: [HackerNewsStoryProvider],
      useFactory: (provider: HackerNewsStoryProvider) => provider.getHackerNewsLatestAskStories(),
    },
    {
      provide: GetHackerNewsStoryInteractor,
      deps: [HackerNewsStoryProvider],
      useFactory: (provider: HackerNewsStoryProvider) => provider.getHackerNewsStory(),
    },
  ]
})
export class HackerNewsStoryProviderModule {}