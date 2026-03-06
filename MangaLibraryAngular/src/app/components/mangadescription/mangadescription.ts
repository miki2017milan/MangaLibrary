import {
  Component,
  computed,
  effect,
  ElementRef,
  input,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-mangadescription',
  imports: [],
  templateUrl: './mangadescription.html',
  styleUrl: './mangadescription.scss',
})
export class Mangadescription {
  @ViewChild('description', { static: false }) descriptionRef!: ElementRef;
  isDescriptionOverflowing = signal(false);

  description = input();

  constructor() {
    effect(() => {
      this.description();

      setTimeout(() => {
        if (this.descriptionRef?.nativeElement) {
          const el = this.descriptionRef.nativeElement;
          this.isDescriptionOverflowing.set(el.scrollHeight > el.clientHeight);
        }
      });
    });
  }
}
