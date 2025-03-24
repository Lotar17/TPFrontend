import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevolucionVendedorComponent } from './devolucion-vendedor.component';

describe('DevolucionVendedorComponent', () => {
  let component: DevolucionVendedorComponent;
  let fixture: ComponentFixture<DevolucionVendedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DevolucionVendedorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DevolucionVendedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
