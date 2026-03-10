import {
  Component,
  computed,
  ElementRef,
  inject,
  OnDestroy,
  signal,
  ViewChild,
} from '@angular/core';
import { MangaService } from '../services/manga.service';
import { Manga } from '../models/manga.type';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { catchError, EMPTY, exhaustMap, Subject, switchMap } from 'rxjs';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { MangaQueryParams } from '../models/mangaqueryparams';
import { Filterbar } from '../components/filterbar/filterbar';

@Component({
  selector: 'app-search',
  imports: [Filterbar, RouterLink],
  templateUrl: './search.html',
  styleUrl: './search.scss',
})
export class Search implements OnDestroy {
  @ViewChild('loadMore') loadMoreTrigger!: ElementRef;
  observer!: IntersectionObserver;
  router = inject(Router);
  mangaService = inject(MangaService);

  mangas = signal<Manga[]>([]);
  loading = signal(true);
  loadingMore = signal(false);
  error = signal(false);
  hasNext = signal<boolean>(false);
  currentPage = signal<number>(1);
  loadingSubject = new Subject<void>();

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
      page: 1,
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
        this.hasNext.set(result.hasNext);
        this.currentPage.set(result.page);
        this.loading.set(false);
      });

    this.loadingSubject
      .pipe(
        exhaustMap(() => {
          if (!this.hasNext() || this.currentPage() > 10) return EMPTY;
          return this.mangaService
            .queryMangas({ ...this.query(), page: this.currentPage() + 1 })
            .pipe(
              catchError(() => {
                this.error.set(true);
                return EMPTY;
              }),
            );
        }),
        takeUntilDestroyed(),
      )
      .subscribe((result) => {
        this.mangas.update((prev) => [...prev!, ...result.content]);
        this.hasNext.set(result.hasNext);
        this.currentPage.set(result.page);
        this.loadingMore.set(false);
      });
  }

  loadMore() {
    if (this.loading() || this.loadingMore() || !this.hasNext() || this.currentPage() > 10) {
      return;
    }
    this.loadingMore.set(true);
    this.loadingSubject.next();
  }

  ngAfterViewInit() {
    this.observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        this.loadMore();
      }
    });
    this.observer.observe(this.loadMoreTrigger.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer.disconnect();
  }
}
