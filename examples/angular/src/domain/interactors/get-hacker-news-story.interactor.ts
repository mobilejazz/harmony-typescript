import { GetInteractor } from '@mobilejazz/harmony-core';

import { GetHackerNewsStoryQuery } from '../../data/queries/hacker-news.query';
import { HackerNewsStory } from '../models/hacker-news-story.model';

export class GetHackerNewsStoryInteractor {
  constructor(
    private readonly getStory: GetInteractor<HackerNewsStory>,
  ) { }

  public async execute(id: number): Promise<HackerNewsStory> {
    return this.getStory.execute(new GetHackerNewsStoryQuery(id));
  }
}
