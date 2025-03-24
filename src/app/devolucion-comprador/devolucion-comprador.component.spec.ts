import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevolucionCompradorComponent } from './devolucion-comprador.component';

describe('DevolucionCompradorComponent', () => {
  let component: DevolucionCompradorComponent;
  let fixture: ComponentFixture<DevolucionCompradorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DevolucionCompradorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DevolucionCompradorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
