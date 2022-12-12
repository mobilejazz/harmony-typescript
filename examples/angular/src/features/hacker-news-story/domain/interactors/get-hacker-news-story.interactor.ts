import { GetInteractor, Logger } from '@mobilejazz/harmony-core';

import { GetHackerNewsStoryQuery } from '../../data/queries/hacker-news.query';
import { HackerNewsStory } from '../models/hacker-news-story.model';

export class GetHackerNewsStoryInteractor {
  constructor(
    private readonly getStory: GetInteractor<HackerNewsStory>,
    private readonly logger: Logger,
  ) { }

  public async execute(id: number): Promise<HackerNewsStory> {
    this.logger.log('Getting story: %s', id);
    return this.getStory.execute(new GetHackerNewsStoryQuery(id));
  }
}
