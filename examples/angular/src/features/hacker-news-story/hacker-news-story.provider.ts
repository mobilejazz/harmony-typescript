import {
  CacheDecoratorFactory,
  CacheRepository,
  DefaultObjectValidator,
  GetInteractor,
  GetRepository,
  InMemoryDataSource,
  RepositoryMapper,
  SingleGetDataSourceRepository,
  VoidDataSource
} from '@mobilejazz/harmony-core';
import { HackerNewsStoryNetworkDataSource } from 'src/features/hacker-news-story/data/data-sources/hacker-news-story.network.data-source';
import { HackerNewsStoryEntity } from 'src/features/hacker-news-story/data/entities/hacker-news-item.entity';
import { HackerNewsStoryJSONToHackerNewsStoryEntityMapper } from './data/mappers/hacker-news-story.mapper';
import { HackerNewsFetchService, HackerNewsService } from './data/service/hacker-news.service';
import { GetHackerNewsLatestAskStoriesInteractor } from './domain/interactors/get-hacker-news-latest-ask-stories.interactor';
import { GetHackerNewsStoryInteractor } from './domain/interactors/get-hacker-news-story.interactor';
import { HackerNewsStoryEntityToHackerNewsStoryMapper, HackerNewsStoryToHackerNewsStoryEntityMapper } from './domain/mappers/hacker-news-story.mapper';
import { HackerNewsStory } from './domain/models/hacker-news-story.model';
import { HackerNewsStoryIdsNetworkDataSource } from "./data/data-sources/hacker-news-story-ids.network.data-source";

// Caching via decorator
const Cached = CacheDecoratorFactory(new Map());

export abstract class HackerNewsStoryProvider {
  abstract getHackerNewsLatestAskStories(): GetHackerNewsLatestAskStoriesInteractor;
  abstract getHackerNewsStory(): GetHackerNewsStoryInteractor;
}

export class HackerNewsStoryDefaultProvider implements HackerNewsStoryProvider {
  private readonly hackerNewsService: HackerNewsService = new HackerNewsFetchService();

  @Cached()
  private getHackerNewsStoryIdsRepository(): GetRepository<number[]> {
    return new SingleGetDataSourceRepository(
      new HackerNewsStoryIdsNetworkDataSource(this.hackerNewsService)
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
      new GetInteractor(this.getHackerNewsStoryIdsRepository()),
    );
  }

  public getHackerNewsStory(): GetHackerNewsStoryInteractor {
    return new GetHackerNewsStoryInteractor(
      new GetInteractor(this.getHackerNewsStoryRepository()),
    );
  }
}
