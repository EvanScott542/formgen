import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  { path: '', redirectTo: 'prompt', pathMatch: 'full' },
  {
    path: 'prompt',
    loadComponent: () =>
      import('./views/prompt-view/prompt-view.component').then(m => m.PromptViewComponent),
  },
  {
    path: 'drafts',
    loadComponent: () =>
      import('./views/draft-list-view/draft-list-view.component').then(m => m.DraftListViewComponent),
  },
  {
    path: 'drafts/:id',
    loadComponent: () =>
      import('./views/draft-detail/draft-detail.component').then(m => m.DraftDetailComponent),
  },
];
