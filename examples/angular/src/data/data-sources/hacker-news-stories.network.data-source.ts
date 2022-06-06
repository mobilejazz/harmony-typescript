import { GetDataSource, Query, QueryNotSupportedError } from '@mobilejazz/harmony-core';

import { GetHackerNewsLatestAskStoriesQuery } from '../queries/hacker-news.query';
import { HackerNewsService } from '../service/hacker-news.service';

export class HackerNewsStoriesNetworkDataSource implements GetDataSource<number> {
  constructor(
    private readonly hackerNews: HackerNewsService,
  ) { }

  public async get(query: Query): Promise<number> {
    throw new QueryNotSupportedError();
  }

  public async getAll(query: Query): Promise<number[]> {
    if (query instanceof GetHackerNewsLatestAskStoriesQuery) {
      return this.hackerNews.getLatestAskStories();
    }

    throw new QueryNotSupportedError();
  }
}
