import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ratingchart } from './ratingchart';

describe('Ratingchart', () => {
  let component: Ratingchart;
  let fixture: ComponentFixture<Ratingchart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ratingchart],
    }).compileComponents();

    fixture = TestBed.createComponent(Ratingchart);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
