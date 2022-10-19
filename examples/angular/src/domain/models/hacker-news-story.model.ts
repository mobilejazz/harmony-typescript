export class HackerNewsStory {
  public readonly type = 'story';

  constructor(
    public readonly id: number,
    public readonly title: string,
    public readonly by: string,
    public readonly descendants: number,
    public readonly kids: number[],
    public readonly score: number,
    public readonly createdAt: Date,
    public readonly text?: string,
    public readonly url?: string,
  ) { }

  public hasURL(): boolean {
    return typeof this.url !== 'undefined';
  }

  public hasText(): boolean {
    return typeof this.text !== 'undefined';
  }
}
