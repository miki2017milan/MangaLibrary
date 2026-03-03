import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RedirectService {
  private returnUrl: string = '/';

  set(url: string) {
    this.returnUrl = url;
  }
  get() {
    return this.returnUrl;
  }
  clear() {
    this.returnUrl = '/';
  }
}
