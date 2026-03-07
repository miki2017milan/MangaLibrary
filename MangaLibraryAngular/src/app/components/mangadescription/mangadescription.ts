import {
  afterRenderEffect,
  Component,
  effect,
  ElementRef,
  input,
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
    afterRenderEffect(() => {
      this.description();

      if (this.descriptionRef?.nativeElement) {
        const el = this.descriptionRef.nativeElement;
        this.isDescriptionOverflowing.set(el.scrollHeight > el.clientHeight);
      }
    });
  }
}
