import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { GetHackerNewsLatestAskStoriesInteractor } from '../../../domain/interactors/get-hacker-news-latest-ask-stories.interactor';
import { HackerNewsStory } from '../../../domain/models/hacker-news-story.model';
import { DefaultNavigationService } from '../../services/navigation.service';
import { DefaultLatestAskStoriesPresenter, LatestAskStoriesPresenter } from './latest-ask-stories.presenter';

export interface LatestAskStoriesView {
  onDisplayLoading(display: boolean): void;
  onDisplayError(display: boolean): void;
  onDisplayStories(stories: HackerNewsStory[]): void;
}

@Component({
  selector: 'app-latest-ask-stories',
  templateUrl: './latest-ask-stories.component.html',
  styleUrls: ['./latest-ask-stories.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: LatestAskStoriesPresenter,
    deps: [GetHackerNewsLatestAskStoriesInteractor, DefaultNavigationService],
    useFactory: (getLatestAskStories: GetHackerNewsLatestAskStoriesInteractor, navigation: DefaultNavigationService) =>
      new DefaultLatestAskStoriesPresenter(getLatestAskStories, navigation)
  }],
})
export class LatestAskStoriesComponent implements LatestAskStoriesView, OnInit {
  public isLoading = true;
  public showError = false;
  public stories!: HackerNewsStory[];

  constructor(
    private readonly cdr: ChangeDetectorRef,
    public readonly presenter: LatestAskStoriesPresenter,
  ) {
    this.presenter.attachView(this);
  }

  public ngOnInit(): void {
    this.presenter.onViewInit();
  }

  public onDisplayLoading(display: boolean): void {
    this.isLoading = display;
    this.cdr.markForCheck();
  }

  public onDisplayError(display: boolean): void {
    this.showError = display;
    this.cdr.markForCheck();
  }

  public onDisplayStories(stories: HackerNewsStory[]): void {
    this.stories = stories;
    this.cdr.markForCheck();
  }
}
