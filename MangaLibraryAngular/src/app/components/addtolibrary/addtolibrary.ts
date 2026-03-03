import { Component, computed, HostListener, inject, input, OnInit, signal } from '@angular/core';
import { MangaService } from '../../services/manga.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../../services/account-service';
import { UserManga } from '../../models/usermanga.type';
import { RedirectService } from '../../services/redirect-service';

@Component({
  selector: 'app-addtolibrary',
  imports: [],
  templateUrl: './addtolibrary.html',
  styleUrl: './addtolibrary.scss',
})
export class Addtolibrary {
  mangaService = inject(MangaService);
  accountService = inject(AccountService);
  redireactService = inject(RedirectService);
  router = inject(Router);

  route = inject(ActivatedRoute);
  id = this.route.snapshot.paramMap.get('id');

  userManga = input<UserManga>();
  status = computed(() => {
    const s = this.userManga()?.status;
    if (!s) return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
  });

  private reload() {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigateByUrl(currentUrl);
    });
  }

  add(value: string) {
    if (!this.accountService.isAuthenticated()) {
      this.redireactService.set(this.router.url);
      console.log(this.router.url);
      this.router.navigateByUrl('/login');
      return;
    }

    this.mangaService.addReadingStatus(this.id, value).subscribe(() => {
      this.reload();
    });
  }

  remove() {
    this.mangaService.removeReadingStatus(this.id).subscribe(() => {
      this.reload();
    });
  }

  change(value: string) {
    this.mangaService.changeReadingStatus(this.id, value).subscribe(() => {
      this.reload();
    });
  }

  // Droppdown logic
  isOpen = signal(false);

  toggle() {
    this.isOpen.update((value) => !value);
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!(event.target as HTMLElement).closest('.dropdown')) {
      this.isOpen.set(false);
    }
  }
}
