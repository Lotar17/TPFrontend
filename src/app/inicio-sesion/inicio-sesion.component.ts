import { Component } from '@angular/core';
import { LoginService } from '../api/login.service.js';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../api/Auth.service.js';
import { AutenticacionService } from '../api/autenticacion.service.js';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inicio-sesion',
  standalone: true,
  imports: [ReactiveFormsModule,RouterLink,CommonModule],
  templateUrl: './inicio-sesion.component.html',
  styleUrl: './inicio-sesion.component.css',
})
export class InicioSesionComponent {
  loginSuccesful: boolean | undefined;
inicioExitoso:boolean=false
  loginForm = new FormGroup({
    mail: new FormControl(),
    password: new FormControl(),
  });

  constructor(private loginService: LoginService,private authService:AuthService, private router: Router,
    private autenticacionService:AutenticacionService
  ) {}

  async onSubmit() {
    const credentials = {
      mail: this.loginForm.value.mail ?? '',
      password: this.loginForm.value.password ?? '',
    };try {
      (await this.loginService.login(credentials)).subscribe({
        next: (response) => {
          this.inicioExitoso=true
          if (response.result) {
            console.log(response.message);
            
            // Seteamos el ID del usuario en el servicio
            this.authService.setUserId(response.usuarioId);
    
            // Ahora llamamos a getUserInformation para asegurarnos de que los datos del usuario estén actualizados
            this.autenticacionService.getUserInformation().subscribe({
              next: (userResponse) => {
              
               
                if (response.userRol === "Administrador") {
                  this.router.navigateByUrl('/admin');
                } else if (response.userRol.toLowerCase() === "usuario") {
                  this.router.navigateByUrl('/productos');
                } else {
                  this.router.navigateByUrl('panelSeguimientoEmpleado');
                }
              },
              error: (error) => {
                console.error('Error al obtener la información del usuario', error);
              }
            });
    
          } else {
            this.loginSuccesful = false;
            // Aquí puedes manejar el caso en que el login no sea exitoso
          }
        },
        error: (error) => {
          console.error('Error en la autenticación', error);
          this.loginSuccesful = false;
        }
      });
    } catch (error) {
      console.error('Error al intentar loguearse', error);
      this.loginSuccesful = false;
    }
    

}}
