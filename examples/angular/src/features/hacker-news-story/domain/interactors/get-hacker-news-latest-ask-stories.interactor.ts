import { GetInteractor, Logger } from '@mobilejazz/harmony-core';

import { GetHackerNewsLatestAskStoriesQuery } from '../../data/queries/hacker-news.query';
import { HackerNewsStory } from '../models/hacker-news-story.model';
import { GetHackerNewsStoryInteractor } from './get-hacker-news-story.interactor';

export class GetHackerNewsLatestAskStoriesInteractor {
  constructor(
    private readonly getStory: GetHackerNewsStoryInteractor,
    private readonly getLatestAskStoryIds: GetInteractor<number[]>,
    private readonly logger: Logger,
  ) { }

  public async execute(limit = 5): Promise<HackerNewsStory[]> {
    this.logger.log('Getting latest news from Hacker News');

    const ids = await this.getLatestAskStoryIds.execute(new GetHackerNewsLatestAskStoriesQuery());

    return Promise.all(
      ids
        .slice(0, limit)
        .map(id => this.getStory.execute(id))
    );
  }
}
