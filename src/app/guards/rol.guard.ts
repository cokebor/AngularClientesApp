import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RolGuard implements CanActivate {

  constructor(private authService:AuthService, private router:Router){}


  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if(!this.authService.isAuthenticated()){
        this.router.navigate(['/login']);
        return false;
      }
      let rol= route.data['role'] as string;
      console.log(rol);
      if(this.authService.hasRole(rol)){
        return true;
      }
      Swal.fire('Acceso denegado',`Hola ${this.authService.usuario.username} no tienes acceso a este recurso`,'warning');
      this.router.navigate(['/clientes']);
      return false;
  }
  
}

