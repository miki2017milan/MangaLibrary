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

  mangas = signal<LibraryManga[]>([]);
  filterdMangas = signal<LibraryManga[]>([]);

  searchWord = signal<string>('');
  viewStyle = signal<string>('grid');

  filterMangas() {
    this.filterdMangas.set(
      this.mangas().filter((manga) =>
        manga.title.toLowerCase().includes(this.searchWord().toLowerCase()),
      ),
    );
    console.log(this.searchWord());
    console.log(
      'lol',
      this.filterdMangas(),
      this.mangas()[0].title.toLowerCase().includes(this.searchWord().toLowerCase()),
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
