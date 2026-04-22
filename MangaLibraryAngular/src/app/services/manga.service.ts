import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Manga } from '../models/manga.type';
import { ReadingStatusHistogram } from '../models/readingstatushistogram.type';
import { RatingHistogram } from '../models/ratinghistrogram.type';
import { UserManga } from '../models/usermanga.type';
import { MangaQueryParams } from '../models/mangaqueryparams';
import { PagedMangas } from '../models/pagedmangas.type';
import { LibraryManga } from '../models/librarymanga';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MangaService {
  http = inject(HttpClient);

  mangaUrl = environment.apiUrl + 'mangas/';
  userMangaUrl = environment.apiUrl + 'users/manga/';

  getManga(id: string | null) {
    return this.http.get<Manga>(this.mangaUrl + id);
  }

  queryMangas(queryParams: MangaQueryParams) {
    return this.http.get<PagedMangas>(this.mangaUrl + 'query', {
      params: queryParams,
    });
  }

  getReadingStatusForManga(id: string | null) {
    return this.http.get<ReadingStatusHistogram>(this.mangaUrl + id + '/reading-status');
  }

  getRatingForManga(id: string | null) {
    return this.http.get<RatingHistogram>(this.mangaUrl + id + '/rating');
  }

  getUserMangaForUser(id: string | null) {
    return this.http.get<UserManga>(this.userMangaUrl + id);
  }

  addReadingStatus(id: string | null, status: string) {
    return this.http.post(this.userMangaUrl + id, { status: status });
  }

  removeReadingStatus(id: string | null) {
    return this.http.delete(this.userMangaUrl + id);
  }

  changeReadingStatus(id: string | null, status: string) {
    return this.http.put(this.userMangaUrl + id, { status: status });
  }

  addRating(id: string | null, rating: number) {
    return this.http.put(this.userMangaUrl + id, { rating: rating });
  }

  removeRating(id: string | null) {
    return this.http.put(this.userMangaUrl + id, { rating: null });
  }

  getMangasByUser() {
    return this.http.get<LibraryManga[]>(this.userMangaUrl);
  }
}
