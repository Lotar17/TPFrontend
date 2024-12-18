import { CanActivateChildFn } from '@angular/router';
import { AutenticacionService } from '../api/autenticacion.service.js';
import { inject } from '@angular/core';

export const checkRolGuard: CanActivateChildFn = async (childRoute, state) => {
  const autenticacion = inject(AutenticacionService);
  if ((await autenticacion.getRolByCookie()) === 'Administrador') {
    return true;
  }
  return false;
};
