import { Mapper } from '@mobilejazz/harmony-core';

import { HackerNewsStoryEntity } from '../entities/hacker-news-item.entity';
import { HackerNewsItemStoryJSON } from '../service/hacker-news.service';

export class HackerNewsStoryJSONToHackerNewsStoryEntityMapper implements Mapper<HackerNewsItemStoryJSON, HackerNewsStoryEntity> {
  public map(from: HackerNewsItemStoryJSON): HackerNewsStoryEntity {
    return new HackerNewsStoryEntity(
      from.id,
      from.title,
      from.by,
      from.descendants,
      from.kids ?? [],
      from.score,
      new Date(from.time * 1000),
      from.text,
      from.url,
    );
  }
}
