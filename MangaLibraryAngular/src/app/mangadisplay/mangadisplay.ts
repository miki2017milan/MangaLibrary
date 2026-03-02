import { Component, ElementRef, inject, OnInit, Signal, signal, ViewChild } from '@angular/core';
import { Manga } from '../models/manga.type';
import { MangaService } from '../services/manga.service';
import { catchError } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Readingstatus } from '../components/readingstatus/readingstatus';

@Component({
  selector: 'app-mangadisplay',
  imports: [Readingstatus],
  templateUrl: './mangadisplay.html',
  styleUrl: './mangadisplay.scss',
})
export class Mangadisplay implements OnInit {
  @ViewChild('myDiv', { static: false }) myDiv!: ElementRef;
  isDescriptionOverflowing = signal(false);

  route = inject(ActivatedRoute);
  id = this.route.snapshot.paramMap.get('id');

  mangaService = inject(MangaService);
  manga = signal<Manga | undefined>(undefined);
  loading = signal(true);
  error = signal(false);

  tagsExpanded = signal(false);

  ngOnInit(): void {
    this.mangaService
      .getMangaFromApi(this.id)
      .pipe(
        catchError((err) => {
          this.loading.set(false);
          this.error.set(true);
          console.log(err);
          throw err;
        }),
      )
      .subscribe((manga) => {
        this.loading.set(false);
        manga.tags.sort();
        this.manga.set(manga);
        setTimeout(() => {
          if (this.myDiv?.nativeElement) {
            const el = this.myDiv.nativeElement;
            this.isDescriptionOverflowing.set(el.scrollHeight > el.clientHeight);
          }
        });
      });
  }
}
