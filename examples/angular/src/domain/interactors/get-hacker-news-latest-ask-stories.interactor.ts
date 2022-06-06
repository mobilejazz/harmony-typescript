import { GetAllInteractor } from '@mobilejazz/harmony-core';

import { GetHackerNewsStoryQuery, GetHackerNewsLatestAskStoriesQuery } from '../../data/queries/hacker-news.query';
import { HackerNewsStory } from '../models/hacker-news-story.model';
import { GetHackerNewsStoryInteractor } from './get-hacker-news-story.interactor';

export class GetHackerNewsLatestAskStoriesInteractor {
  constructor(
    private readonly getStory: GetHackerNewsStoryInteractor,
    private readonly getLatestAskStories: GetAllInteractor<number>,
  ) { }

  public async execute(limit: number = 5): Promise<HackerNewsStory[]> {
    const ids = await this.getLatestAskStories.execute(new GetHackerNewsLatestAskStoriesQuery());

    return Promise.all(
      ids
        .slice(0, limit)
        .map(id => this.getStory.execute(id))
    );
  }
}
