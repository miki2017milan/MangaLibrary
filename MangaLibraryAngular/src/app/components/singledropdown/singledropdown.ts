import { Component, ElementRef, HostListener, inject, input, signal } from '@angular/core';

@Component({
  selector: 'app-singledropdown',
  imports: [],
  templateUrl: './singledropdown.html',
  styleUrl: './singledropdown.scss',
})
export class Singledropdown {
  selectedValue = input<string>();
  possibleValues = input<string[]>();
  onSelectValue = input<(value: string) => void>();
  clearSelectedValues = input<() => void>();
  heading = input<string>();

  isOpen = signal(false);

  selectValue(value: string) {
    this.onSelectValue()!(value);
  }

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
