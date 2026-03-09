import { Component, ElementRef, HostListener, inject, input, signal } from '@angular/core';

@Component({
  selector: 'app-toggledropdown',
  imports: [],
  templateUrl: './toggledropdown.html',
  styleUrl: './toggledropdown.scss',
})
export class Toggledropdown {
  isTrue = input<boolean>();
  onSelectValue = input<(value: boolean) => void>();
  heading = input<string>();

  isOpen = signal(false);

  toggle() {
    this.isOpen.update((value) => !value);
  }

  elementRef = inject(ElementRef);
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!this.elementRef!.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }
}
