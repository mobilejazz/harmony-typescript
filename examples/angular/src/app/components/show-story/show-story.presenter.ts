import { GetHackerNewsStoryInteractor } from '../../../domain/interactors/get-hacker-news-story.interactor';
import { NavigationService } from '../../services/navigation.service';
import { ShowStoryView } from './show-story.component';

export abstract class ShowStoryPresenter {
  abstract attachView(view: ShowStoryView): void;
  abstract onViewInit(id: number): void;
  abstract onActionReload(): void;
  abstract onActionBack(): void;
}

export class DefaultShowStoryPresenter implements ShowStoryPresenter {
  private view!: ShowStoryView;
  private id!: number;

  constructor(
    private readonly getStory: GetHackerNewsStoryInteractor,
    private readonly navigation: NavigationService,
  ) { }

  public attachView(view: ShowStoryView): void {
    this.view = view;
  }

  public onViewInit(id: number): void {
    if (isNaN(id)) {
      // TODO: handle invalid id
      throw new Error(`Invalid ID: ${id}`);
    }

    this.id = id;
    this.onActionReload();
  }

  public async onActionReload(): Promise<void> {
    this.view.onDisplayLoading(true);
    this.view.onDisplayError(false);

    try {
      const stories = await this.getStory.execute(this.id);
      this.view.onDisplayStory(stories);
    } catch {
      this.view.onDisplayError(true);
    } finally {
      this.view.onDisplayLoading(false);
    }
  }

  public onActionBack(): void {
    this.navigation.goToLatestAskStories();
  }
}
