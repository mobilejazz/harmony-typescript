import {
  Cached,
  CacheRepository,
  DefaultObjectValidator,
  DeviceConsoleLogger,
  GetInteractor,
  GetRepository,
  InMemoryDataSource,
  Logger,
  RepositoryMapper,
  SingleGetDataSourceRepository,
  VoidDataSource
} from '@mobilejazz/harmony-core';
import { BugfenderLogger } from '@mobilejazz/harmony-bugfender';
import { Bugfender } from '@bugfender/sdk';
import { HackerNewsStoryNetworkDataSource } from './data/data-sources/hacker-news-story.network.data-source';
import { HackerNewsStoryEntity } from './data/entities/hacker-news-item.entity';
import { HackerNewsStoryJSONToHackerNewsStoryEntityMapper } from './data/mappers/hacker-news-story.mapper';
import { HackerNewsFetchService, HackerNewsService } from './data/service/hacker-news.service';
import { GetHackerNewsLatestAskStoriesInteractor } from './domain/interactors/get-hacker-news-latest-ask-stories.interactor';
import { GetHackerNewsStoryInteractor } from './domain/interactors/get-hacker-news-story.interactor';
import { HackerNewsStoryEntityToHackerNewsStoryMapper, HackerNewsStoryToHackerNewsStoryEntityMapper } from './domain/mappers/hacker-news-story.mapper';
import { HackerNewsStory } from './domain/models/hacker-news-story.model';
import { HackerNewsStoryIdsNetworkDataSource } from "./data/data-sources/hacker-news-story-ids.network.data-source";

export abstract class HackerNewsStoryProvider {
  abstract provideGetHackerNewsLatestAskStories(): GetHackerNewsLatestAskStoriesInteractor;
  abstract provideGetHackerNewsStory(): GetHackerNewsStoryInteractor;
}

export class HackerNewsStoryDefaultProvider implements HackerNewsStoryProvider {
  private readonly hackerNewsService: HackerNewsService = new HackerNewsFetchService();

  constructor(
    private readonly bugfenderAppKey?: string,
  ) {}

  @Cached()
  private getLogger(): Logger {
    if (this.bugfenderAppKey) {
      Bugfender.init({
        appKey: this.bugfenderAppKey,
        overrideConsoleMethods: false,
      });

      return new BugfenderLogger(Bugfender);
    }

    return new DeviceConsoleLogger();
  }

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

  public provideGetHackerNewsLatestAskStories(): GetHackerNewsLatestAskStoriesInteractor {
    this.getLogger().info('Creating instance: GetHackerNewsLatestAskStoriesInteractor');

    return new GetHackerNewsLatestAskStoriesInteractor(
      this.provideGetHackerNewsStory(),
      new GetInteractor(this.getHackerNewsStoryIdsRepository()),
      this.getLogger().withTag(GetHackerNewsLatestAskStoriesInteractor),
    );
  }

  public provideGetHackerNewsStory(): GetHackerNewsStoryInteractor {
    this.getLogger().info('Creating instance: GetHackerNewsStoryInteractor');

    return new GetHackerNewsStoryInteractor(
      new GetInteractor(this.getHackerNewsStoryRepository()),
      this.getLogger().withTag(GetHackerNewsStoryInteractor),
    );
  }
}
