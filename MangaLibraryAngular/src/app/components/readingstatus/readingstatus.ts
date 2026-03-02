import { Component, inject, input, OnInit, signal } from '@angular/core';
import { MangaService } from '../../services/manga.service';
import { ActivatedRoute } from '@angular/router';
import { catchError } from 'rxjs';

@Component({
  selector: 'app-readingstatus',
  imports: [],
  templateUrl: './readingstatus.html',
  styleUrl: './readingstatus.scss',
})
export class Readingstatus implements OnInit {
  mangaService = inject(MangaService);
  route = inject(ActivatedRoute);
  id = this.route.snapshot.paramMap.get('id');

  loading = signal(true);
  error = signal(false);

  completed = signal(0);
  planning = signal(0);
  reading = signal(0);
  dropped = signal(0);
  paused = signal(0);

  ngOnInit(): void {
    this.mangaService
      .getReadingStatusForManga(this.id)
      .pipe(
        catchError((err) => {
          this.loading.set(false);
          this.error.set(true);
          console.log(err);
          throw err;
        }),
      )
      .subscribe((status) => {
        this.loading.set(false);
        this.completed.set(status.completed || 0);
        this.planning.set(status.planning || 0);
        this.reading.set(status.reading || 0);
        this.dropped.set(status.dropped || 0);
        this.paused.set(status.paused || 0);
      });
  }
}
