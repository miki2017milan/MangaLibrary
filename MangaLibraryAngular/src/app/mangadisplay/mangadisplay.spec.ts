import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Mangadisplay } from './mangadisplay';

describe('Mangadisplay', () => {
  let component: Mangadisplay;
  let fixture: ComponentFixture<Mangadisplay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Mangadisplay],
    }).compileComponents();

    fixture = TestBed.createComponent(Mangadisplay);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
