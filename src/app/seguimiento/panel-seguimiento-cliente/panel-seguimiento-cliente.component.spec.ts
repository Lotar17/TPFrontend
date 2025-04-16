import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelSeguimientoClienteComponent } from './panel-seguimiento-cliente.component';

describe('PanelSeguimientoClienteComponent', () => {
  let component: PanelSeguimientoClienteComponent;
  let fixture: ComponentFixture<PanelSeguimientoClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanelSeguimientoClienteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PanelSeguimientoClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
