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

  getMangaFromApi(id: string | null) {
    const url = 'http://localhost:5050/api/mangas/' + id;
    return this.http.get<Manga>(url);
  }

  getReadingStatusFromApi(id: string | null) {
    const url = 'http://localhost:5050/api/status/' + id;
    return this.http.get<ReadingStatus>(url);
  }
}
