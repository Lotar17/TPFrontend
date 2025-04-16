import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelVendedorComponent } from './panel-vendedor.component';

describe('PanelVendedorComponent', () => {
  let component: PanelVendedorComponent;
  let fixture: ComponentFixture<PanelVendedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanelVendedorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PanelVendedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
