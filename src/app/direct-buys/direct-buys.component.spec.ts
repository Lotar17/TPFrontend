import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectBuysComponent } from './direct-buys.component';

describe('DirectBuysComponent', () => {
  let component: DirectBuysComponent;
  let fixture: ComponentFixture<DirectBuysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DirectBuysComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DirectBuysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
