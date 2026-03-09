import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Toggledropdown } from './toggledropdown';

describe('Toggledropdown', () => {
  let component: Toggledropdown;
  let fixture: ComponentFixture<Toggledropdown>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Toggledropdown],
    }).compileComponents();

    fixture = TestBed.createComponent(Toggledropdown);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
