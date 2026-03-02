import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Manga } from '../models/manga.type';
import { ReadingStatus } from '../models/readingstatus.type';

@Injectable({
  providedIn: 'root',
})
export class MangaService {
  http = inject(HttpClient);

  url = 'http://localhost:5050/api/mangas/';

  getMangaFromApi(id: string | null) {
    return this.http.get<Manga>(this.url + id);
  }

  getReadingStatusForManga(id: string | null) {
    return this.http.get<ReadingStatus>(this.url + id + '/reading-status');
  }

  getRatingFromApi(id: string | null) {
    return this.http.get<Record<number, number>>(this.url + id + '/rating');
  }

  getReadingStatusForUser(id: string | null) {
    return this.http.get<{ status: string; rating: number }>(
      'http://localhost:5050/api/users/manga/' + id,
    );
  }

  addReadingStatus(id: string | null, status: string) {
    return this.http.post('http://localhost:5050/api/users/manga/' + id, { status: status });
  }

  addRating(id: string | null, rating: number) {
    return this.http.put('http://localhost:5050/api/users/manga/' + id, { rating: rating });
  }
}
