import { KeyQuery, Query } from '@mobilejazz/harmony-core'

export class GetHackerNewsLatestAskStoriesQuery extends Query { }

export class GetHackerNewsItemQuery extends KeyQuery {
  constructor(public readonly id: number) {
    super(`hn.item.${id}`);
  }
}

export class GetHackerNewsStoryQuery extends GetHackerNewsItemQuery {
  constructor(id: number) {
    super(id);
  }
}
