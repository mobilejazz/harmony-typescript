import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

export abstract class NavigationService {
  abstract goToLatestAskStories(): void;
  abstract goToStory(id: number): void;
}

@Injectable({
  providedIn: 'root',
})
export class DefaultNavigationService implements NavigationService {
  constructor(
    private router: Router,
  ) { }

  public goToLatestAskStories(): void {
    this.router.navigate(['/']);
  }

  public goToStory(id: number): void {
    this.router.navigate(['/story/', id]);
  }
}
