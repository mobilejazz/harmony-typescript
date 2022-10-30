import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { HackerNewsStory } from '../../../business-logic/domain/models/hacker-news-story.model';
import {
  LatestAskStoriesErrorViewState, LatestAskStoriesLoadedViewState,
  LatestAskStoriesLoadingViewState,
  LatestAskStoriesViewState
} from "./latest-ask-stories.view-state";
import {
  GetHackerNewsLatestAskStoriesInteractor
} from "../../../business-logic/domain/interactors/get-hacker-news-latest-ask-stories.interactor";
import { NavigationService } from "../../services/navigation.service";

@Component({
  selector: 'app-latest-ask-stories',
  templateUrl: './latest-ask-stories.component.html',
  styleUrls: ['./latest-ask-stories.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LatestAskStoriesComponent implements OnInit {
  public viewState!: LatestAskStoriesViewState;

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly getLatestAskStories: GetHackerNewsLatestAskStoriesInteractor,
    private readonly navigation: NavigationService,
  ) {
  }

  public async ngOnInit(): Promise<void> {
    await this.onActionReload();
  }

  public async onActionReload(): Promise<void> {
    this.viewState = new LatestAskStoriesLoadingViewState();

    try {
      const stories = await this.getLatestAskStories.execute();
      this.viewState = new LatestAskStoriesLoadedViewState(stories);
    } catch {
      this.viewState = new LatestAskStoriesErrorViewState();
    }
    this.cdr.markForCheck();
  }

  public onActionViewStory(story: HackerNewsStory): void {
    this.navigation.goToStory(story.id);
  }
}
