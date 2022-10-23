import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioModel } from 'src/app/model/usuario.model';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  titulo: string = 'Por favor Sign In!';
  usuario: UsuarioModel;

  constructor(private authService: AuthService, private router: Router) {
    this.usuario = new UsuarioModel();
  }

  ngOnInit(): void {
    if(this.authService.isAuthenticated()){
       Swal.fire('Login',`Hola ${this.authService.usuario.username} ya estas autenticado!`,'info');
      this.router.navigate(['/clientes']);
    }
  }

  login(): void {
    console.log(this.usuario);
    if (this.usuario.username == null || this.usuario.password == null) {
      Swal.fire('Error Login', 'Username o password vacias', 'error');
      return;
    }
    this.authService.login(this.usuario).subscribe((response) => {
      console.log(response);

      this.authService.guardarUsuario(response.access_token);
      this.authService.guardarToken(response.access_token);

      let usuario = this.authService.usuario;

      this.router.navigate(['/clientes']);
      Swal.fire(
        'Login',
        `Hola ${usuario.username}, has iniciado sesion con exito`,
        'success'
      );
    },err=>{
      if(err.status==400){
        Swal.fire('Error Login', 'Usuario o claves incorrectas!', 'error');
      }
    });
  }
}
