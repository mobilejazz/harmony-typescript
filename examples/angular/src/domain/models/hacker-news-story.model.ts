
export class HackerNewsStory {
  public readonly type = 'story';

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

  public hasURL(): boolean {
    return typeof this.url !== 'undefined';
  }

  public hasText(): boolean {
    return typeof this.text !== 'undefined';
  }
}
