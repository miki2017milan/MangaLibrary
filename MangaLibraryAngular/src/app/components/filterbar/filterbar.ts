import { Component, computed, HostListener, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { mangaGenres } from '../../models/mangagenres';
import { mangaTags } from '../../models/mangatags';
import { mangaFormats } from '../../models/mangaformats';
import { mangaCountryOfOrigin } from '../../models/mangacountryoforigin';
import { Subject } from 'rxjs/internal/Subject';
import { debounceTime } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MangaQueryParams } from '../../models/mangaqueryparams';
import { Multisearchdropdown } from '../multisearchdropdown/multisearchdropdown';
import { Singledropdown } from '../singledropdown/singledropdown';
import { Toggledropdown } from '../toggledropdown/toggledropdown';

@Component({
  selector: 'app-filterbar',
  imports: [Multisearchdropdown, Singledropdown, Toggledropdown],
  templateUrl: './filterbar.html',
  styleUrl: './filterbar.scss',
})
export class Filterbar {
  router = inject(Router);
  query = input.required<MangaQueryParams>();
  isMobile = signal(window.innerWidth <= 1024);

  searchSubject = new Subject<string>();
  possibleGenres = mangaGenres;
  possibleTags = mangaTags;
  possibleFormats = mangaFormats;
  possibleCountryOfOrigin = mangaCountryOfOrigin;

  isExtended = signal(false);

  toggleExtended() {
    this.isExtended.update((prev) => !prev);
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!(event.target as HTMLElement).closest('.config') && !this.isMobile()) {
      this.isExtended.set(false);
    }
  }

  @HostListener('window:resize')
  onResize() {
    this.isMobile.set(window.innerWidth <= 1024);
  }

  constructor() {
    // takeUntilDestroyed to unsubscribe from the searchSubject whenever the component gets destoryed to prevent memoryleak
    this.searchSubject.pipe(debounceTime(300), takeUntilDestroyed()).subscribe((query) => {
      this.search(query);
    });
  }

  navigate(params: Record<string, unknown>) {
    this.router.navigate(['/search'], {
      queryParams: params,
      queryParamsHandling: 'merge',
    });
  }

  onSearch(value: string) {
    this.searchSubject.next(value);
  }

  search(query: string) {
    this.navigate({ title: query != '' ? query : null });
  }

  hasAny = computed(() => {
    return (
      this.query().title ||
      this.query().genres.length != 0 ||
      this.query().tags.length != 0 ||
      this.query().format ||
      this.query().countryOfOrigin ||
      this.query().includesAdultContent
    );
  });

  removeAll() {
    this.router.navigate(['/search']);
  }

  // arrow functions are need so that the this. contet is retained even when passing into a child component
  onSelectGenre = (genre: string) => {
    if (this.query().genres.includes(genre)) {
      this.removeGenre(genre);
      return;
    }

    this.navigate({ genres: [...this.query().genres, genre] });
  };

  removeGenre = (genre: string) => {
    this.navigate({ genres: this.query().genres.filter((value) => value !== genre) });
  };

  clearGenres = () => {
    this.navigate({ genres: [] });
  };

  onSelectTag = (tag: string) => {
    if (this.query().tags.includes(tag)) {
      this.removeTag(tag);
      return;
    }

    this.navigate({ tags: [...this.query().tags, tag] });
  };

  removeTag = (tag: string) => {
    this.navigate({ tags: this.query().tags.filter((value) => value !== tag) });
  };

  clearTags = () => {
    this.navigate({ tags: [] });
  };

  onSelectFormat = (format: string) => {
    if (this.query().format === format) {
      this.clearFormat();
      return;
    }

    this.navigate({ format });
  };

  clearFormat = () => {
    this.navigate({ format: null });
  };

  onSelectCountryOfOrigin = (countryOfOrigin: string) => {
    if (this.query().countryOfOrigin === countryOfOrigin) {
      this.clearCountryOfOrigin();
      return;
    }

    this.navigate({ countryOfOrigin });
  };

  clearCountryOfOrigin = () => {
    this.navigate({ countryOfOrigin: null });
  };

  onSelectInculdesAdultContent = (includesAdultContent: boolean) => {
    this.navigate({ includesAdultContent: includesAdultContent || null });
  };

  clearIncludesAdultContent = () => {
    this.navigate({ includesAdultContent: null });
  };
}
