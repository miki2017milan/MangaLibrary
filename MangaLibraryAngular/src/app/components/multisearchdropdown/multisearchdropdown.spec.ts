import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Multisearchdropdown } from './multisearchdropdown';

describe('Multisearchdropdown', () => {
  let component: Multisearchdropdown;
  let fixture: ComponentFixture<Multisearchdropdown>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Multisearchdropdown],
    }).compileComponents();

    fixture = TestBed.createComponent(Multisearchdropdown);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
