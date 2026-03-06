import { Component, HostListener, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AccountService } from '../../services/account-service';
import { catchError, EMPTY } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit {
  accountService = inject(AccountService);
  displayName = signal<string | undefined>(undefined);

  isShowing = signal(true);
  isOpen = signal(false);
  router = inject(Router);

  loading = signal(true);
  error = signal(false);

  reload() {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigateByUrl(currentUrl);
    });
  }

  toggle() {
    this.isOpen.update((value) => !value);
  }

  ngOnInit(): void {
    if (this.accountService.isAuthenticated()) {
      this.accountService
        .getUserDetails()
        .pipe(
          catchError((err) => {
            this.error.set(true);
            return EMPTY;
          }),
        )
        .subscribe((userDetails) => {
          this.displayName.set(userDetails.displayName);
          this.loading.set(false);
        });
    }
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!(event.target as HTMLElement).closest('.profile')) {
      this.isOpen.set(false);
    }
  }
}
