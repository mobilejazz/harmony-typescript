import { GetDataSource, MethodNotImplementedError, Query, QueryNotSupportedError } from '@mobilejazz/harmony-core';

import { HackerNewsStoryEntity } from '../entities/hacker-news-item.entity';
import { HackerNewsStoryJSONToHackerNewsStoryEntityMapper } from '../mappers/hacker-news-story.mapper';
import { GetHackerNewsStoryQuery } from '../queries/hacker-news.query';
import { HackerNewsService } from '../service/hacker-news.service';

export class HackerNewsStoryNetworkDataSource implements GetDataSource<HackerNewsStoryEntity> {
  constructor(
    private readonly mapper: HackerNewsStoryJSONToHackerNewsStoryEntityMapper,
    private readonly hackerNews: HackerNewsService,
  ) { }

  public async get(query: Query): Promise<HackerNewsStoryEntity> {
    if (query instanceof GetHackerNewsStoryQuery) {
      const story = await this.hackerNews.getStory(query.id);
      return this.mapper.map(story);
    }

    throw new QueryNotSupportedError();
  }

  public getAll(query: Query): Promise<HackerNewsStoryEntity[]> {
    throw new MethodNotImplementedError();
  }
}
