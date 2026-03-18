import { Component, HostListener, inject, OnInit, signal } from '@angular/core';
import { MangaService } from '../services/manga.service';
import { catchError } from 'rxjs';
import { LibraryManga } from '../models/librarymanga';
import { RouterLink } from '@angular/router';
import { mangaGenres } from '../models/mangagenres';
import { Multisearchdropdown } from '../components/multisearchdropdown/multisearchdropdown';
import { Singledropdown } from '../components/singledropdown/singledropdown';
import { mangaFormats } from '../models/mangaformats';
import { mangaTags } from '../models/mangatags';
import { mangaCountryOfOrigin } from '../models/mangacountryoforigin';

@Component({
  selector: 'app-library',
  imports: [RouterLink, Multisearchdropdown, Singledropdown],
  templateUrl: './library.html',
  styleUrl: './library.scss',
})
export class Library implements OnInit {
  mangaService = inject(MangaService);

  loading = signal(true);
  error = signal(false);

  mangas = signal<LibraryManga[]>([]);
  filterdMangas = signal<LibraryManga[]>([]);

  searchWord = signal<string>('');
  viewStyle = signal<string>('grid');

  selectedGenres = signal<string[]>([]);
  possibleGenres = mangaGenres;

  selectedTags = signal<string[]>([]);
  possibleTags = mangaTags;

  selectedFormat = signal<string>('');
  possibleForamts = mangaFormats;

  selectedCountryOfOrigin = signal<string>('');
  possibleCountryOfOrigins = mangaCountryOfOrigin;

  isMobile = signal(window.innerWidth <= 750);
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
    this.isMobile.set(window.innerWidth <= 750);
  }

  onSelectGenre = (genre: string) => {
    if (this.selectedGenres().includes(genre)) {
      this.selectedGenres.update((prev) => prev.filter((g) => g !== genre));
    } else {
      this.selectedGenres.update((prev) => [...prev, genre]);
    }
    this.filterMangas();
  };

  clearGenres = () => {
    this.selectedGenres.set([]);
    this.filterMangas();
  };

  onSelectTags = (tag: string) => {
    if (this.selectedTags().includes(tag)) {
      this.selectedTags.update((prev) => prev.filter((t) => t !== tag));
    } else {
      this.selectedTags.update((prev) => [...prev, tag]);
    }
    this.filterMangas();
  };

  clearTags = () => {
    this.selectedTags.set([]);
    this.filterMangas();
  };

  onSelectFormat = (format: string) => {
    if (format === this.selectedFormat()) {
      this.clearFormat();
    } else {
      this.selectedFormat.set(format);
      this.filterMangas();
    }
  };

  clearFormat = () => {
    this.selectedFormat.set('');
    this.filterMangas();
  };

  onSelectCountryOfOrigin = (countryOfOrigin: string) => {
    if (countryOfOrigin === this.selectedCountryOfOrigin()) {
      this.clearCountryOfOrigin();
    } else {
      this.selectedCountryOfOrigin.set(countryOfOrigin);
      this.filterMangas();
    }
  };

  clearCountryOfOrigin = () => {
    this.selectedCountryOfOrigin.set('');
    this.filterMangas();
  };

  filterMangas() {
    console.log(this.selectedFormat());
    this.filterdMangas.set(
      this.mangas().filter((manga) => {
        return (
          manga.title.toLowerCase().includes(this.searchWord().toLowerCase()) &&
          this.selectedGenres().every((genre) => manga.genres.includes(genre)) &&
          this.selectedTags().every((tag) => manga.tags.includes(tag)) &&
          (this.selectedFormat() === '' || manga.format === this.selectedFormat()) &&
          (this.selectedCountryOfOrigin() === '' ||
            manga.countryOfOrigin === this.selectedCountryOfOrigin())
        );
      }),
    );
  }

  ngOnInit(): void {
    this.mangaService
      .getMangasByUser()
      .pipe(
        catchError((err) => {
          this.loading.set(false);
          this.error.set(true);
          throw err;
        }),
      )
      .subscribe((mangas) => {
        this.loading.set(false);
        this.mangas.set(mangas);
        this.filterdMangas.set(mangas);
      });
  }
}
