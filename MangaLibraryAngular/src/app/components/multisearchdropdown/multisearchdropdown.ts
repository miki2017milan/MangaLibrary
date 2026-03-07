import {
  Component,
  computed,
  ElementRef,
  HostListener,
  inject,
  input,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-multisearchdropdown',
  imports: [],
  templateUrl: './multisearchdropdown.html',
  styleUrl: './multisearchdropdown.scss',
})
export class Multisearchdropdown {
  selectedValues = input<string[]>();
  possibleValues = input<string[]>();
  onSelectValue = input<(value: string) => void>();
  clearSelectedValues = input<() => void>();
  heading = input<string>();

  isOpen = signal(false);
  searchWord = signal('');
  filteredPossibleValues = computed(() => {
    const searchWord = this.searchWord().toLowerCase();
    const temp = (this.possibleValues() ?? []).filter((value) =>
      value.toLowerCase().includes(searchWord),
    );
    return temp;
  });

  updateSearchWord(value: string) {
    this.searchWord.set(value);
  }

  selectValue(value: string) {
    this.onSelectValue()!(value);
    this.updateSearchWord('');
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
