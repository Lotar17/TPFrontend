import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OlvidaPasswordComponent } from './olvida-password.component';

describe('OlvidaPasswordComponent', () => {
  let component: OlvidaPasswordComponent;
  let fixture: ComponentFixture<OlvidaPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OlvidaPasswordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OlvidaPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
