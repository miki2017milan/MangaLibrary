import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Addrating } from './addrating';

describe('Addrating', () => {
  let component: Addrating;
  let fixture: ComponentFixture<Addrating>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Addrating],
    }).compileComponents();

    fixture = TestBed.createComponent(Addrating);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
