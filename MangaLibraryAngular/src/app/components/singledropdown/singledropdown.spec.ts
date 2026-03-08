import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Singledropdown } from './singledropdown';

describe('Singledropdown', () => {
  let component: Singledropdown;
  let fixture: ComponentFixture<Singledropdown>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Singledropdown],
    }).compileComponents();

    fixture = TestBed.createComponent(Singledropdown);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
