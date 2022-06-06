import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GetHackerNewsStoryInteractor } from '../../../domain/interactors/get-hacker-news-story.interactor';
import { HackerNewsStory } from '../../../domain/models/hacker-news-story.model';
import { DefaultNavigationService } from '../../services/navigation.service';
import { DefaultShowStoryPresenter, ShowStoryPresenter } from './show-story.presenter';

export interface ShowStoryView {
  onDisplayLoading(display: boolean): void;
  onDisplayError(display: boolean): void;
  onDisplayStory(story: HackerNewsStory): void;
}

@Component({
  selector: 'app-show-story',
  templateUrl: './show-story.component.html',
  styleUrls: ['./show-story.component.scss'],
  providers: [{
    provide: ShowStoryPresenter,
    deps: [GetHackerNewsStoryInteractor, DefaultNavigationService],
    useFactory: (getStory: GetHackerNewsStoryInteractor, navigation: DefaultNavigationService) =>
      new DefaultShowStoryPresenter(getStory, navigation)
  }]
})
export class ShowStoryComponent implements ShowStoryView, OnInit {
  public isLoading = true;
  public showError = false;
  public story!: HackerNewsStory;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly cdr: ChangeDetectorRef,
    public readonly presenter: ShowStoryPresenter,
  ) {
    this.presenter.attachView(this);
  }

  public ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id') ?? NaN);
    this.presenter.onViewInit(id);
  }

  public onDisplayLoading(display: boolean): void {
    this.isLoading = display;
    this.cdr.markForCheck();
  }

  public onDisplayError(display: boolean): void {
    this.showError = display;
    this.cdr.markForCheck();
  }

  public onDisplayStory(story: HackerNewsStory): void {
    this.story = story;
    this.cdr.markForCheck();
  }
}
