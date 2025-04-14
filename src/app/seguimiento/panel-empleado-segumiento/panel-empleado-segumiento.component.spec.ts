import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelEmpleadoSegumientoComponent } from './panel-empleado-segumiento.component';

describe('PanelEmpleadoSegumientoComponent', () => {
  let component: PanelEmpleadoSegumientoComponent;
  let fixture: ComponentFixture<PanelEmpleadoSegumientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanelEmpleadoSegumientoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PanelEmpleadoSegumientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
