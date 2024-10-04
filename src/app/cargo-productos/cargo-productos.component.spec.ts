import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargoProductosComponent } from './cargo-productos.component';

describe('CargoProductosComponent', () => {
  let component: CargoProductosComponent;
  let fixture: ComponentFixture<CargoProductosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CargoProductosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CargoProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
