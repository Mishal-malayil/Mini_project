import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Coordinators } from './coordinators';

describe('Coordinators', () => {
  let component: Coordinators;
  let fixture: ComponentFixture<Coordinators>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Coordinators],
    }).compileComponents();

    fixture = TestBed.createComponent(Coordinators);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
