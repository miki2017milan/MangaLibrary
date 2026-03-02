import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Addtolibrary } from './addtolibrary';

describe('Addtolibrary', () => {
  let component: Addtolibrary;
  let fixture: ComponentFixture<Addtolibrary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Addtolibrary],
    }).compileComponents();

    fixture = TestBed.createComponent(Addtolibrary);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
