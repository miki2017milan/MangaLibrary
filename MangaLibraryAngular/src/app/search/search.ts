import { Component, computed, inject, signal } from '@angular/core';
import { MangaService } from '../services/manga.service';
import { Manga } from '../models/manga.type';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { catchError, EMPTY, switchMap } from 'rxjs';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { MangaQueryParams } from '../models/mangaqueryparams';
import { Filterbar } from '../components/filterbar/filterbar';

@Component({
  selector: 'app-search',
  imports: [Filterbar, RouterLink],
  templateUrl: './search.html',
  styleUrl: './search.scss',
})
export class Search {
  router = inject(Router);
  mangaService = inject(MangaService);

  mangas = signal<Manga[] | undefined>(undefined);
  loading = signal(true);
  error = signal(false);
  totalPages = signal<number>(1);
  currentPage = signal<number>(1);

  grid = signal(true);

  route = inject(ActivatedRoute);
  queryParams = toSignal(this.route.queryParams); // create signal from queryparams so that a new fetch will be made
  query = computed<MangaQueryParams>(() => {
    // changes when queryParmas changes and that will trigger effect in the constructor because effect reads this.query
    return {
      title: this.queryParams()?.['title'] ?? '',
      genres: [this.queryParams()?.['genres'] ?? []].flat(),
      tags: [this.queryParams()?.['tags'] ?? []].flat(),
      format: this.queryParams()?.['format'] ?? '',
      includesAdultContent: this.queryParams()?.['includesAdultContent'] === 'true' ? true : false,
      countryOfOrigin: this.queryParams()?.['countryOfOrigin'] ?? '',
      pageSize: 24,
    };
  });

  constructor() {
    toObservable(this.query) // Converto to observable meaning whenever this.query changes the new value gets push intu the switchMap
      .pipe(
        // switchMap atomaticly cancels old request that did not finish befor the next one was made
        switchMap((query) => {
          this.loading.set(true);
          this.error.set(false);
          return this.mangaService.queryMangas(query).pipe(
            catchError(() => {
              this.error.set(true);
              this.loading.set(false);
              return EMPTY;
            }),
          );
        }),
        takeUntilDestroyed(), // unsubscribe from the obseravle whenever the comonent gets destroyed
      )
      .subscribe((result) => {
        this.mangas.set(result.content);
        this.totalPages.set(result.total);
        this.currentPage.set(result.page);
        this.loading.set(false);
      });
  }
}
