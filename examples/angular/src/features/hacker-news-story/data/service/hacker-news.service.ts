export interface HackerNewsItemStoryJSON {
  by: string,
  descendants: number,
  id: number,
  kids: number[],
  score: number,
  time: number,
  title: string,
  type: 'story',
  text?: string,
  url?: string,
}

export type HackerNewsItemJSON = HackerNewsItemStoryJSON;

export interface HackerNewsService {
  getItem(id: number): Promise<HackerNewsItemJSON>;
  getLatestAskStories(): Promise<number[]>;
  getStory(id: number): Promise<HackerNewsItemStoryJSON>;
  getTopStories(): Promise<number[]>;
}

export class HackerNewsFetchService implements HackerNewsService {
  private readonly BASE_URL = 'https://hacker-news.firebaseio.com/v0';

  /**
   * Get Item
   * Hacker News API has just one endpoint to fetch different type of items (story, comment, poll…).
   * See: https://github.com/HackerNews/API
   * @param id
   * @returns
   */
  public async getItem(id: number): Promise<HackerNewsItemJSON> {
    const storyRes = await fetch(`${this.BASE_URL}/item/${id}.json`);
    return storyRes.json();
  }

  public async getLatestAskStories(): Promise<number[]> {
    const idsRes = await fetch(`${this.BASE_URL}/askstories.json`);
    return idsRes.json();
  }

  public getStory(id: number): Promise<HackerNewsItemStoryJSON> {
    return this.getItem(id);
  }

  public async getTopStories(): Promise<number[]> {
    const idsRes = await fetch(`${this.BASE_URL}/topstories.json`);
    return idsRes.json();
  }
}
