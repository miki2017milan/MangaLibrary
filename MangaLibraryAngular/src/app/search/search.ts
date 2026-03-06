import { Component, computed, DestroyRef, effect, inject, OnInit, signal } from '@angular/core';
import { MangaService } from '../services/manga.service';
import { Manga } from '../models/manga.type';
import { ActivatedRoute, Router } from '@angular/router';
import { MangaQueryParams } from '../models/mangaqueryparams';
import { catchError, debounceTime, EMPTY, Subject } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-search',
  imports: [],
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
  searchSubject = new Subject<string>();
  grid = signal(true);

  route = inject(ActivatedRoute);
  queryParams = toSignal(this.route.queryParams);
  query = computed(() => {
    return {
      title: this.queryParams()?.['title'] ?? '',
      genres: this.queryParams()?.['genres'] ?? [],
      tags: this.queryParams()?.['tags'] ?? [],
      format: this.queryParams()?.['format'] ?? '',
      includesAdultContent: this.queryParams()?.['includesAdultContent'] === 'true' ? true : false,
      countryOfOrigin: this.queryParams()?.['countryOfOrigin'] ?? '',
    };
  });

  destroyRef = inject(DestroyRef);
  constructor() {
    this.searchSubject.pipe(debounceTime(300), takeUntilDestroyed()).subscribe((query) => {
      this.search(query);
    });

    effect((onCleanup) => {
      const sub = this.mangaService
        .queryMangas(this.query())
        .pipe(
          catchError(() => {
            this.error.set(true);
            this.loading.set(false);
            return EMPTY;
          }),
        )
        .subscribe((result) => {
          this.mangas.set(result.content);
          this.totalPages.set(result.total);
          this.currentPage.set(result.page);
          this.loading.set(false);
        });
      onCleanup(() => sub.unsubscribe());
    });
  }

  navigateToManga(id: string) {
    this.router.navigateByUrl('/manga/' + id);
  }

  onSearch(value: string) {
    this.searchSubject.next(value);
  }

  search(query: string) {
    this.router.navigate(['/search'], {
      queryParams: { title: query != '' ? query : null },
      queryParamsHandling: 'merge',
    });
  }
}
