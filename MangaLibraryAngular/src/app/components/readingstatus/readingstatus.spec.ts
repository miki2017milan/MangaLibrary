import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Readingstatus } from './readingstatus';

describe('Readingstatus', () => {
  let component: Readingstatus;
  let fixture: ComponentFixture<Readingstatus>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Readingstatus],
    }).compileComponents();

    fixture = TestBed.createComponent(Readingstatus);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
