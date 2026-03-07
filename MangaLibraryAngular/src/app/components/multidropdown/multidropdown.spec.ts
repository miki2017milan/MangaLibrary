import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Multidropdown } from './multidropdown';

describe('Multidropdown', () => {
  let component: Multidropdown;
  let fixture: ComponentFixture<Multidropdown>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Multidropdown],
    }).compileComponents();

    fixture = TestBed.createComponent(Multidropdown);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
