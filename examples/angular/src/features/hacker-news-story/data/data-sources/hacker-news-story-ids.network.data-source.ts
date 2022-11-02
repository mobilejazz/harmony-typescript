import { GetDataSource, MethodNotImplementedError, Query, QueryNotSupportedError } from '@mobilejazz/harmony-core';

import { GetHackerNewsLatestAskStoriesQuery } from '../queries/hacker-news.query';
import { HackerNewsService } from '../service/hacker-news.service';

export class HackerNewsStoryIdsNetworkDataSource implements GetDataSource<number[]> {
  constructor(
    private readonly hackerNews: HackerNewsService,
  ) { }

  public async get(query: Query): Promise<number[]> {
    if (query instanceof GetHackerNewsLatestAskStoriesQuery) {
      return this.hackerNews.getLatestAskStories();
    }
    throw new QueryNotSupportedError();
  }

  public getAll(query: Query): Promise<number[][]> {
    throw new MethodNotImplementedError();
  }
}
