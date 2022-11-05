export class HackerNewsStoryEntity {
  public type = 'story';

  constructor(
    public id: number,
    public title: string,
    public by: string,
    public descendants: number,
    public kids: number[],
    public score: number,
    public createdAt: Date,
    public text?: string,
    public url?: string,
  ) { }
}

export type HackerNewsItemEntity = HackerNewsStoryEntity;
