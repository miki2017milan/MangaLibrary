import { Component, computed, inject, signal } from '@angular/core';
import { MangaService } from '../services/manga.service';
import { Manga } from '../models/manga.type';
import { mangaGenres } from '../models/mangagenres';
import { mangaTags } from '../models/mangatags';
import { mangaFormats } from '../models/mangaformats';
import { mangaCountryOfOrigin } from '../models/mangacountryoforigin';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, debounceTime, EMPTY, Subject, switchMap } from 'rxjs';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Multisearchdropdown } from '../components/multisearchdropdown/multisearchdropdown';
import { MangaQueryParams } from '../models/mangaqueryparams';
import { Singledropdown } from '../components/singledropdown/singledropdown';

@Component({
  selector: 'app-search',
  imports: [Multisearchdropdown, Singledropdown],
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
  searchSubject = new Subject<string>();
  possibleGenres = mangaGenres;
  possibleTags = mangaTags;
  possibleFormats = mangaFormats;
  possibleCountryOfOrigin = mangaCountryOfOrigin;

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
      pageSize: 18,
    };
  });

  constructor() {
    // takeUntilDestroyed to unsubscribe from the searchSubject whenever the component gets destoryed to prevent memoryleak
    this.searchSubject.pipe(debounceTime(300), takeUntilDestroyed()).subscribe((query) => {
      this.search(query);
    });

    toObservable(this.query) // Converto to observable meaning whenever this.query changes the new value gets push intu the switchMap
      .pipe(
        // switchMap atomaticly cancels old request that did not finish befor the next one was made
        switchMap((query) =>
          this.mangaService.queryMangas(query).pipe(
            catchError(() => {
              this.error.set(true);
              this.loading.set(false);
              return EMPTY;
            }),
          ),
        ),
        takeUntilDestroyed(), // unsubscribe from the obseravle whenever the comonent gets destroyed
      )
      .subscribe((result) => {
        this.mangas.set(result.content);
        this.totalPages.set(result.total);
        this.currentPage.set(result.page);
        this.loading.set(false);
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

  // arrow funtion because onSelectGenre gets passed into another component and would lose the
  // this. context when it is a class funtion
  onSelectGenre = (genre: string) => {
    if (this.query().genres.includes(genre)) {
      this.removeGenre(genre);
      return;
    }

    const newGenres = [...this.query().genres, genre];
    this.router.navigate(['/search'], {
      queryParams: { genres: newGenres },
      queryParamsHandling: 'merge',
    });
  };

  removeGenre = (genre: string) => {
    const newGenres = this.query().genres.filter((value) => value !== genre);

    this.router.navigate(['/search'], {
      queryParams: { genres: newGenres },
      queryParamsHandling: 'merge',
    });
  };

  clearGenres = () => {
    this.router.navigate(['/search'], {
      queryParams: { genres: [] },
      queryParamsHandling: 'merge',
    });
  };

  onSelectTag = (tag: string) => {
    if (this.query().tags.includes(tag)) {
      this.removeTag(tag);
      return;
    }

    const newTags = [...this.query().tags, tag];
    this.router.navigate(['/search'], {
      queryParams: { tags: newTags },
      queryParamsHandling: 'merge',
    });
  };

  removeTag = (tag: string) => {
    const newTags = this.query().tags.filter((value) => value !== tag);

    this.router.navigate(['/search'], {
      queryParams: { tags: newTags },
      queryParamsHandling: 'merge',
    });
  };

  clearTags = () => {
    this.router.navigate(['/search'], {
      queryParams: { tags: [] },
      queryParamsHandling: 'merge',
    });
  };

  onSelectFormat = (format: string) => {
    if (this.query().format === format) {
      this.clearFormat();
      return;
    }

    this.router.navigate(['/search'], {
      queryParams: { format: format },
      queryParamsHandling: 'merge',
    });
  };

  clearFormat = () => {
    this.router.navigate(['/search'], {
      queryParams: { format: null },
      queryParamsHandling: 'merge',
    });
  };

  onSelectCountryOfOrigin = (countryOfOrigin: string) => {
    if (this.query().countryOfOrigin === countryOfOrigin) {
      this.clearCountryOfOrigin();
      return;
    }

    this.router.navigate(['/search'], {
      queryParams: { countryOfOrigin: countryOfOrigin },
      queryParamsHandling: 'merge',
    });
  };

  clearCountryOfOrigin = () => {
    this.router.navigate(['/search'], {
      queryParams: { countryOfOrigin: null },
      queryParamsHandling: 'merge',
    });
  };

  hasAny() {
    return (
      this.query().title ||
      this.query().genres.length != 0 ||
      this.query().tags.length != 0 ||
      this.query().format ||
      this.query().countryOfOrigin
    );
  }

  removeAll() {
    this.router.navigate(['/search']);
  }
}
