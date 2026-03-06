import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Mangadescription } from './mangadescription';

describe('Mangadescription', () => {
  let component: Mangadescription;
  let fixture: ComponentFixture<Mangadescription>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Mangadescription],
    }).compileComponents();

    fixture = TestBed.createComponent(Mangadescription);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
