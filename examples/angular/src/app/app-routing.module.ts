import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShowStoryComponent } from './story/show-story/story.component';
import { LatestAskStoriesComponent } from './story/latest-ask-stories/latest-ask-stories.component';

const routes: Routes = [
  {
    path: '',
    component: LatestAskStoriesComponent,
  },
  {
    path: 'story/:id',
    component: ShowStoryComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
