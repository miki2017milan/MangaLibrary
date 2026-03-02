import { Component, HostListener, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AccountService } from '../../services/account-service';
import { catchError } from 'rxjs';

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

  toggle() {
    this.isOpen.update((value) => !value);
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!(event.target as HTMLElement).closest('.profile')) {
      this.isOpen.set(false);
    }
  }

  ngOnInit(): void {
    this.accountService
      .getUserDetails()
      .pipe(
        catchError((err) => {
          throw err;
        }),
      )
      .subscribe((userDetails) => {
        this.displayName.set(userDetails.displayName);
      });

    console.log('hey', this.accountService.userId);
  }
}
