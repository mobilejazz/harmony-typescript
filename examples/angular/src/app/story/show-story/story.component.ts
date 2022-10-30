import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GetHackerNewsStoryInteractor } from '../../../domain/interactors/get-hacker-news-story.interactor';
import { NavigationService } from '../../services/navigation.service';
import { StoryErrorViewState, StoryLoadedViewState, StoryLoadingViewState, StoryViewState } from "./story.view-state";

@Component({
  selector: 'app-show-story',
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.scss'],
})
export class ShowStoryComponent implements OnInit {
  public viewState!: StoryViewState;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly cdr: ChangeDetectorRef,
    private readonly getStory: GetHackerNewsStoryInteractor,
    private readonly navigation: NavigationService,
  ) {
  }

  public async ngOnInit(): Promise<void> {
    const id = Number(this.route.snapshot.paramMap.get('id') ?? NaN);
    if (isNaN(id)) {
      // TODO: handle invalid id
      throw new Error(`Invalid ID: ${id}`);
    }

    await this.onActionReload(id);
  }

  public async onActionReload(id: number): Promise<void> {
    this.viewState = new StoryLoadingViewState();

    try {
      const story = await this.getStory.execute(id);
      this.viewState = new StoryLoadedViewState(story);
    } catch {
      this.viewState = new StoryErrorViewState(id);
    }
    this.cdr.markForCheck();
  }

  public onActionBack(): void {
    this.navigation.goToLatestAskStories();
  }
}
