import { Component, inject, OnInit, signal } from '@angular/core';
import { MangaService } from '../services/manga.service';
import { catchError } from 'rxjs';
import { LibraryManga } from '../models/librarymanga';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-library',
  imports: [RouterLink],
  templateUrl: './library.html',
  styleUrl: './library.scss',
})
export class Library implements OnInit {
  mangaService = inject(MangaService);

  loading = signal(true);
  error = signal(false);

  completed = signal<LibraryManga[]>([]);
  reading = signal<LibraryManga[]>([]);
  planning = signal<LibraryManga[]>([]);
  dropped = signal<LibraryManga[]>([]);
  paused = signal<LibraryManga[]>([]);

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
        for (const manga of mangas) {
          if (manga.status === 'completed') {
            this.completed.update((prev) => [...prev, manga]);
          } else if (manga.status === 'reading') {
            this.reading.update((prev) => [...prev, manga]);
          } else if (manga.status === 'planning') {
            this.planning.update((prev) => [...prev, manga]);
          } else if (manga.status === 'dropped') {
            this.dropped.update((prev) => [...prev, manga]);
          } else if (manga.status === 'paused') {
            this.paused.update((prev) => [...prev, manga]);
          }
        }
      });
  }
}
