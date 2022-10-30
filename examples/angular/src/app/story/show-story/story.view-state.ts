import { HackerNewsStory } from '../../../domain/models/hacker-news-story.model';
import { ViewState } from '@mobilejazz/harmony-core';

export class StoryLoadingViewState implements ViewState {
  public readonly $type = 'loading';
}

export class StoryErrorViewState implements ViewState {
  public readonly $type = 'error';
  constructor(
    public readonly storyId: number
  ) {
  }
}

export class StoryLoadedViewState implements ViewState {
  public readonly $type = 'loaded';
  constructor(
    public readonly story: HackerNewsStory
  ) {
  }
}

export type StoryViewState =
  | StoryLoadingViewState
  | StoryErrorViewState
  | StoryLoadedViewState;
