import { Component, inject, input } from '@angular/core';
import { UserManga } from '../../models/usermanga.type';
import { catchError } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { MangaService } from '../../services/manga.service';
import { RedirectService } from '../../services/redirect-service';

@Component({
  selector: 'app-addrating',
  imports: [],
  templateUrl: './addrating.html',
  styleUrl: './addrating.scss',
})
export class Addrating {
  userManga = input<UserManga>();
  mangaService = inject(MangaService);

  router = inject(Router);

  route = inject(ActivatedRoute);
  id = this.route.snapshot.paramMap.get('id');

  private reload() {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigateByUrl(currentUrl);
    });
  }

  addRating(value: string) {
    const ratingValue = Number.parseInt(value);

    if (isNaN(ratingValue)) return;
    if (ratingValue > 10 || ratingValue < 1) return;

    this.mangaService
      .addRating(this.id, ratingValue)
      .pipe(
        catchError((err) => {
          throw err;
        }),
      )
      .subscribe(() => {
        this.reload();
      });
  }

  removeRating() {
    this.mangaService.removeRating(this.id).subscribe(() => this.reload());
  }
}
