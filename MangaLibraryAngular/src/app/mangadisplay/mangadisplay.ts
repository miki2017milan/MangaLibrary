import { Component, HostListener, inject, OnInit, signal } from '@angular/core';
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
import { Mangadescription } from '../components/mangadescription/mangadescription';

@Component({
  selector: 'app-mangadisplay',
  imports: [Readingstatus, Ratingchart, Addtolibrary, Addrating, Mangadescription],
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

  tagsExpanded = signal(false);

  isMobile = signal(window.innerWidth <= 900);
  @HostListener('window:resize')
  onResize() {
    this.isMobile.set(window.innerWidth <= 900);
  }

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
      });

    // Get Usermanga and distribute to addlibrary component and addrating component
    if (this.accountService.isAuthenticated()) {
      this.mangaService.getUserMangaForUser(this.id).subscribe((value) => {
        if (value != null) {
          this.userManga.set(value);
        }
      });
    }
  }
}
