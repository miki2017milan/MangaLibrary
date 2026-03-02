import { Component, ElementRef, inject, OnInit, Signal, signal, ViewChild } from '@angular/core';
import { Manga } from '../models/manga.type';
import { MangaService } from '../services/manga.service';
import { catchError } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Readingstatus } from '../components/readingstatus/readingstatus';
import { Ratingchart } from '../components/ratingchart/ratingchart';
import { Addtolibrary } from '../components/addtolibrary/addtolibrary';
import { AccountService } from '../services/account-service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-mangadisplay',
  imports: [Readingstatus, Ratingchart, Addtolibrary],
  templateUrl: './mangadisplay.html',
  styleUrl: './mangadisplay.scss',
})
export class Mangadisplay implements OnInit {
  @ViewChild('myDiv', { static: false }) myDiv!: ElementRef;
  isDescriptionOverflowing = signal(false);

  router = inject(Router);
  route = inject(ActivatedRoute);
  mangaService = inject(MangaService);
  accountService = inject(AccountService);
  id = this.route.snapshot.paramMap.get('id');

  manga = signal<Manga | undefined>(undefined);
  loading = signal(true);
  error = signal(false);

  tagsExpanded = signal(false);

  rating = signal<number | undefined>(undefined);
  hasManga = signal<boolean | undefined>(undefined);

  addRating(value: string) {
    console.log('hey');
    const ratingValue = Number.parseInt(value);

    if (isNaN(ratingValue)) return;
    if (ratingValue > 10 || ratingValue < 1) return;

    this.mangaService
      .addRating(this.id, ratingValue)
      .pipe(
        catchError((err) => {
          console.log(err);
          throw err;
        }),
      )
      .subscribe((value) => {
        const currentUrl = this.router.url;
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigateByUrl(currentUrl);
        });
      });
  }

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

    if (this.accountService.isAuthenticated()) {
      this.mangaService.getReadingStatusForUser(this.id).subscribe((value) => {
        console.log(value);
        if (value != null) {
          this.rating.set(value.rating);
          this.hasManga.set(!!value.status);
        }
      });
    }
  }
}
