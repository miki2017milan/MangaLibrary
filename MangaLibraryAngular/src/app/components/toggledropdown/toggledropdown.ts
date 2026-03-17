import { Component, ElementRef, HostListener, inject, input, signal } from '@angular/core';

@Component({
  selector: 'app-toggledropdown',
  imports: [],
  templateUrl: './toggledropdown.html',
  styleUrl: './toggledropdown.scss',
})
export class Toggledropdown {
  isTrue = input.required<boolean>();
  onSelectValue = input.required<(value: boolean) => void>();
  heading = input.required<string>();
}
