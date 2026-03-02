import { Component, HostListener, inject, OnInit, signal } from '@angular/core';
import { MangaService } from '../../services/manga.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../../services/account-service';

@Component({
  selector: 'app-addtolibrary',
  imports: [],
  templateUrl: './addtolibrary.html',
  styleUrl: './addtolibrary.scss',
})
export class Addtolibrary implements OnInit {
  mangaService = inject(MangaService);
  accountService = inject(AccountService);
  router = inject(Router);

  route = inject(ActivatedRoute);
  id = this.route.snapshot.paramMap.get('id');

  isOpen = signal(false);
  status = signal<string | undefined>(undefined);

  toggle() {
    this.isOpen.update((value) => !value);
  }

  add(value: string) {
    this.mangaService.addReadingStatus(this.id, value).subscribe((_) => {
      const currentUrl = this.router.url;
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigateByUrl(currentUrl);
      });
    });
  }

  ngOnInit(): void {
    if (!this.accountService.isAuthenticated()) return;

    this.mangaService.getReadingStatusForUser(this.id).subscribe((value) => {
      const capitilazed = value.status.charAt(0).toUpperCase() + value.status.slice(1);
      this.status.set(capitilazed);
    });
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!(event.target as HTMLElement).closest('.dropdown')) {
      this.isOpen.set(false);
    }
  }
}
