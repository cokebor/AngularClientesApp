import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  titulo:string='App Angular'

  constructor(public authService:AuthService, private router:Router) { } 

  ngOnInit(): void {
  }

  logout():void{
    let username=this.authService.usuario.username;
    this.authService.logout();
    Swal.fire('Logout', `Hola ${username}, has cerrado sesion con exito!`, 'success');
    this.router.navigate(['/login']);
  }
}
