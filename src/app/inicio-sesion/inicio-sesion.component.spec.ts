import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { InicioSesionComponent } from './inicio-sesion.component';
import { LoginService } from '../api/login.service';
import { AuthService } from '../api/Auth.service';
import { AutenticacionService } from '../api/autenticacion.service';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { provideRouter, Router } from '@angular/router';
import { provideLocationMocks } from '@angular/common/testing';
import { inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

describe('InicioSesionComponent', () => {
  let component: InicioSesionComponent;
  let fixture: ComponentFixture<InicioSesionComponent>;
  let loginServiceSpy: jasmine.SpyObj<LoginService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let autenticacionServiceSpy: jasmine.SpyObj<AutenticacionService>;
  let router: Router;

  beforeEach(async () => {
    loginServiceSpy = jasmine.createSpyObj('LoginService', ['login']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['setUserId']);
    autenticacionServiceSpy = jasmine.createSpyObj('AutenticacionService', ['getUserInformation']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, InicioSesionComponent],
      providers: [
        provideRouter([]),
        provideLocationMocks(),
        { provide: LoginService, useValue: loginServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: AutenticacionService, useValue: autenticacionServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {},
            params: of({}),
            queryParams: of({}),
            data: of({})
          },
        }
      ]
    }).compileComponents();

    router = TestBed.inject(Router); // 👈 Inyectamos Router real
    spyOn(router, 'navigateByUrl'); // 👈 Espiamos el método real

    fixture = TestBed.createComponent(InicioSesionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería hacer login exitoso y redirigir según el rol', fakeAsync(() => {
    component.loginForm.setValue({ mail: 'test@mail.com', password: '123456' });

    const mockLoginResponse = {
      result: true,
      message: 'Login exitoso',
      usuarioId: 'abc123',
      userRol: 'Administrador'
    };

    const mockUserResponse = {
      data: {
        nombre: 'Juan',
        apellido: 'Pérez',
        mail: 'juan@mail.com'
      },
      message: 'Usuario obtenido correctamente'
    };

    loginServiceSpy.login.and.resolveTo(of(mockLoginResponse));
    autenticacionServiceSpy.getUserInformation.and.returnValue(of(mockUserResponse));

    component.onSubmit();
    tick();

    expect(component.inicioExitoso).toBeTrue();
    expect(authServiceSpy.setUserId).toHaveBeenCalledWith('abc123');
    expect(autenticacionServiceSpy.getUserInformation).toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/admin');
  }));

  it('debería manejar login fallido (result false)', fakeAsync(() => {
    component.loginForm.setValue({ mail: 'bad@mail.com', password: 'wrongpass' });

    const failedLoginResponse = {
      result: false,
      message: 'Credenciales incorrectas',
      usuarioId: '',
      userRol: ''
    };

    loginServiceSpy.login.and.resolveTo(of(failedLoginResponse));

    component.onSubmit();
    tick();

    expect(component.loginSuccesful).toBeFalse();
  }));

  it('debería manejar error en el login', fakeAsync(() => {
    component.loginForm.setValue({ mail: 'error@mail.com', password: '123456' });

    loginServiceSpy.login.and.resolveTo(throwError(() => new Error('Error de red')));

    component.onSubmit();
    tick();

    expect(component.loginSuccesful).toBeFalse();
  }));
});
