import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificaProductoComponent } from './modifica-producto.component';

describe('ModificaProductoComponent', () => {
  let component: ModificaProductoComponent;
  let fixture: ComponentFixture<ModificaProductoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModificaProductoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModificaProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
