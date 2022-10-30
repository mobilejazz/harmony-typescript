import { HackerNewsStory } from '../../../domain/models/hacker-news-story.model';
import { ViewState } from '@mobilejazz/harmony-core';

export class LatestAskStoriesLoadingViewState implements ViewState {
  public readonly $type = 'loading';
}

export class LatestAskStoriesErrorViewState implements ViewState {
  public readonly $type = 'error';
}

export class LatestAskStoriesLoadedViewState implements ViewState {
  public readonly $type = 'loaded';

  constructor(
    public readonly stories: HackerNewsStory[]
  ) {
  }
}

export type LatestAskStoriesViewState =
  | LatestAskStoriesLoadingViewState
  | LatestAskStoriesLoadedViewState
  | LatestAskStoriesErrorViewState;
