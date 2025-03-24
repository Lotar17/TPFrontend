import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudDevolucionComponent } from './solicitud-devolucion.component';

describe('SolicitudDevolucionComponent', () => {
  let component: SolicitudDevolucionComponent;
  let fixture: ComponentFixture<SolicitudDevolucionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitudDevolucionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitudDevolucionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
