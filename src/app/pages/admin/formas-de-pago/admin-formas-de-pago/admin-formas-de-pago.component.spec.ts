import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminFormasDePagoComponent } from './admin-formas-de-pago.component';

describe('AdminFormasDePagoComponent', () => {
  let component: AdminFormasDePagoComponent;
  let fixture: ComponentFixture<AdminFormasDePagoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminFormasDePagoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminFormasDePagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
