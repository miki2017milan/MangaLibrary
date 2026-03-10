import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => {
      return import('./home/home').then((m) => m.Home);
    },
  },
  {
    path: 'search',
    loadComponent: () => {
      return import('./search/search').then((m) => m.Search);
    },
  },
  {
    path: 'library',
    loadComponent: () => {
      return import('./library/library').then((m) => m.Library);
    },
    canActivate: [authGuard],
  },
  {
    path: 'login',
    loadComponent: () => {
      return import('./login/login').then((m) => m.Login);
    },
  },
  {
    path: 'manga/:id',
    loadComponent: () => {
      return import('./mangadisplay/mangadisplay').then((m) => m.Mangadisplay);
    },
  },
];
