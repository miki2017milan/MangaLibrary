import { Component, inject, OnInit, signal } from '@angular/core';
import { MangaService } from '../../services/manga.service';
import { ActivatedRoute } from '@angular/router';
import { catchError } from 'rxjs';
import { RatingHistogram } from '../../models/ratinghistrogram.type';
import { RedirectService } from '../../services/redirect-service';

@Component({
  selector: 'app-ratingchart',
  imports: [],
  templateUrl: './ratingchart.html',
  styleUrl: './ratingchart.scss',
})
export class Ratingchart implements OnInit {
  mangaService = inject(MangaService);
  route = inject(ActivatedRoute);
  id = this.route.snapshot.paramMap.get('id');

  loading = signal(true);
  error = signal(false);

  total = signal(1);
  ratingEntries = signal<{ key: string; value: number }[] | undefined>(undefined);

  ngOnInit(): void {
    this.mangaService
      .getRatingForManga(this.id)
      .pipe(
        catchError((err) => {
          this.loading.set(false);
          this.error.set(true);
          console.log(err);
          throw err;
        }),
      )
      .subscribe((rating) => {
        this.total.set(Object.values(rating).reduce((acc, val) => acc + val, 0));
        this.ratingEntries.set(
          Object.entries(rating).map(([key, value]) => ({
            key,
            value,
          })),
        );
      });
  }
}
