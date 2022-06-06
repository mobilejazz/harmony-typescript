import { Mapper } from '@mobilejazz/harmony-core';

import { HackerNewsStoryEntity } from '../../data/entities/hacker-news-item.entity';
import { HackerNewsStory } from '../models/hacker-news-story.model';

export class HackerNewsStoryEntityToHackerNewsStoryMapper implements Mapper<HackerNewsStoryEntity, HackerNewsStory> {
  public map(from: HackerNewsStoryEntity): HackerNewsStory {
    return new HackerNewsStory(
      from.id,
      from.title,
      from.by,
      from.descendants,
      from.kids,
      from.score,
      from.createdAt,
      from.text,
      from.url,
    );
  }
}

export class HackerNewsStoryToHackerNewsStoryEntityMapper implements Mapper<HackerNewsStory, HackerNewsStoryEntity> {
  public map(from: HackerNewsStory): HackerNewsStoryEntity {
    return new HackerNewsStoryEntity(
      from.id,
      from.title,
      from.by,
      from.descendants,
      from.kids,
      from.score,
      from.createdAt,
      from.text,
      from.url,
    );
  }
}
