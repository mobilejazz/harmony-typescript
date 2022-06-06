import { CacheRepository, DefaultObjectValidator, GetAllInteractor, GetInteractor, GetRepository, InMemoryDataSource, RepositoryMapper, SingleGetDataSourceRepository, VoidDataSource } from '@mobilejazz/harmony-core';

import { HackerNewsStoryNetworkDataSource } from 'src/data/data-sources/hacker-news-story.network.data-source';
import { HackerNewsStoryEntity } from 'src/data/entities/hacker-news-item.entity';
import { HackerNewsStoriesNetworkDataSource } from '../data/data-sources/hacker-news-stories.network.data-source';
import { HackerNewsStoryJSONToHackerNewsStoryEntityMapper } from '../data/mappers/hacker-news-story.mapper';
import { HackerNewsFetchService, HackerNewsService } from '../data/service/hacker-news.service';
import { GetHackerNewsLatestAskStoriesInteractor } from './interactors/get-hacker-news-latest-ask-stories.interactor';
import { GetHackerNewsStoryInteractor } from './interactors/get-hacker-news-story.interactor';
import { HackerNewsStoryEntityToHackerNewsStoryMapper, HackerNewsStoryToHackerNewsStoryEntityMapper } from './mappers/hacker-news-story.mapper';
import { HackerNewsStory } from './models/hacker-news-story.model';
import { CacheDecoratorFactory } from './utils';

// Caching via decorator
const Cached = CacheDecoratorFactory(new Map());

export abstract class AppProvider {
  abstract getHackerNewsLatestAskStories(): GetHackerNewsLatestAskStoriesInteractor;
  abstract getHackerNewsStory(): GetHackerNewsStoryInteractor;
}

export class AppDefaultProvider implements AppProvider {
  private readonly hackerNewsService: HackerNewsService = new HackerNewsFetchService();

  @Cached()
  private getHackerNewsStoriesRepository(): GetRepository<number> {
    return new SingleGetDataSourceRepository(
      new HackerNewsStoriesNetworkDataSource(this.hackerNewsService)
    );
  }

  @Cached()
  private getHackerNewsStoryRepository(): GetRepository<HackerNewsStory> {
    const dataSourceMapper = new HackerNewsStoryJSONToHackerNewsStoryEntityMapper();
    const voidDataSource = new VoidDataSource<HackerNewsStoryEntity>();
    const mainDataSource = new HackerNewsStoryNetworkDataSource(dataSourceMapper, this.hackerNewsService);
    const cacheDataSource = new InMemoryDataSource<HackerNewsStoryEntity>();
    const cacheRepository = new CacheRepository(
      mainDataSource,
      voidDataSource,
      voidDataSource,
      cacheDataSource,
      cacheDataSource,
      cacheDataSource,
      new DefaultObjectValidator(),
    );

    return new RepositoryMapper(
      cacheRepository,
      cacheRepository,
      cacheRepository,
      new HackerNewsStoryEntityToHackerNewsStoryMapper(),
      new HackerNewsStoryToHackerNewsStoryEntityMapper(),
    );
  }

  public getHackerNewsLatestAskStories(): GetHackerNewsLatestAskStoriesInteractor {
    return new GetHackerNewsLatestAskStoriesInteractor(
      this.getHackerNewsStory(),
      new GetAllInteractor(this.getHackerNewsStoriesRepository()),
    );
  }

  public getHackerNewsStory(): GetHackerNewsStoryInteractor {
    return new GetHackerNewsStoryInteractor(
      new GetInteractor(this.getHackerNewsStoryRepository()),
    );
  }
}
