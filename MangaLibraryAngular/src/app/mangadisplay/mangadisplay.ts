import { Component, ElementRef, inject, OnInit, Signal, signal, ViewChild } from '@angular/core';
import { Manga } from '../models/manga.type';
import { MangaService } from '../services/manga.service';
import { catchError } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Readingstatus } from '../components/readingstatus/readingstatus';
import { Ratingchart } from '../components/ratingchart/ratingchart';
import { Addtolibrary } from '../components/addtolibrary/addtolibrary';
import { AccountService } from '../services/account-service';
import { UserManga } from '../models/usermanga.type';
import { Addrating } from '../components/addrating/addrating';

@Component({
  selector: 'app-mangadisplay',
  imports: [Readingstatus, Ratingchart, Addtolibrary, Addrating],
  templateUrl: './mangadisplay.html',
  styleUrl: './mangadisplay.scss',
})
export class Mangadisplay implements OnInit {
  router = inject(Router);
  mangaService = inject(MangaService);
  accountService = inject(AccountService);

  route = inject(ActivatedRoute);
  id = this.route.snapshot.paramMap.get('id');

  userManga = signal<UserManga | undefined>(undefined);
  manga = signal<Manga | undefined>(undefined);
  loading = signal(true);
  error = signal(false);

  @ViewChild('description', { static: false }) description!: ElementRef;
  isDescriptionOverflowing = signal(false);

  tagsExpanded = signal(false);

  ngOnInit(): void {
    this.mangaService
      .getManga(this.id)
      .pipe(
        catchError((err) => {
          this.loading.set(false);
          this.error.set(true);
          throw err;
        }),
      )
      .subscribe((manga) => {
        this.loading.set(false);
        manga.tags.sort();
        this.manga.set(manga);
        setTimeout(() => {
          // setTimeout with no input, delays this call so that the dom has finished rendering so that the div has the correct height
          if (this.description?.nativeElement) {
            const el = this.description.nativeElement;
            this.isDescriptionOverflowing.set(el.scrollHeight > el.clientHeight);
          }
        });
      });

    // Gett Usermanga and distribute to addlibrary component and addrating component
    if (this.accountService.isAuthenticated()) {
      this.mangaService.getUserMangaForUser(this.id).subscribe((value) => {
        if (value != null) {
          this.userManga.set(value);
        }
      });
    }
  }
}
