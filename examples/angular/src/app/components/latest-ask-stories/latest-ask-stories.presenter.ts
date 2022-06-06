import { GetHackerNewsLatestAskStoriesInteractor } from '../../../domain/interactors/get-hacker-news-latest-ask-stories.interactor';
import { HackerNewsStory } from '../../../domain/models/hacker-news-story.model';
import { NavigationService } from '../../services/navigation.service';
import { LatestAskStoriesView } from './latest-ask-stories.component';

export abstract class LatestAskStoriesPresenter {
  abstract attachView(view: LatestAskStoriesView): void;
  abstract onViewInit(): void;
  abstract onActionReload(): void;
  abstract onActionViewStory(story: HackerNewsStory): void;
}

export class DefaultLatestAskStoriesPresenter implements LatestAskStoriesPresenter {
  private view!: LatestAskStoriesView;

  constructor(
    private readonly getLatestAskStories: GetHackerNewsLatestAskStoriesInteractor,
    private readonly navigation: NavigationService,
  ) { }

  public attachView(view: LatestAskStoriesView): void {
    this.view = view;
  }

  public onViewInit(): void {
    this.onActionReload();
  }

  public async onActionReload(): Promise<void> {
    this.view.onDisplayLoading(true);
    this.view.onDisplayError(false);

    try {
      const stories = await this.getLatestAskStories.execute(5);
      this.view.onDisplayStories(stories);
    } catch {
      this.view.onDisplayError(true);
    } finally {
      this.view.onDisplayLoading(false);
    }
  }

  public onActionViewStory(story: HackerNewsStory): void {
    this.navigation.goToStory(story.id);
  }
}
