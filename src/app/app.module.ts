import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { DirectivaComponent } from './components/directiva/directiva.component';
import { ClientesComponent } from './components/clientes/clientes.component';
import { ClienteService } from './services/cliente.service';
import { Routes, RouterModule } from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
import { FormclienteComponent } from './components/formcliente/formcliente.component'
import { FormsModule } from '@angular/forms';
import localeEs from '@angular/common/locales/es-AR';
import { registerLocaleData } from '@angular/common';
import { PaginatorComponent } from './components/paginator/paginator.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { LoginComponent } from './components/login/login.component';
import { DetalleComponent } from './components/detalle/detalle.component';
import { AuthGuard } from './guards/auth.guard';
import { RolGuard } from './guards/rol.guard';



registerLocaleData(localeEs,'es-AR');


const routes: Routes = [
  { path: '', redirectTo: '/clientes', pathMatch: 'full' },
  { path: 'directivas', component: DirectivaComponent },
  { path: 'clientes', component: ClientesComponent },
  { path: 'clientes/form', component: FormclienteComponent, canActivate:[AuthGuard,RolGuard],data:{role:'ROLE_ADMIN'} },
  { path: 'clientes/form/:id', component: FormclienteComponent, canActivate:[AuthGuard,RolGuard] ,data:{role:'ROLE_ADMIN'} },
  { path: 'clientes/ver/:id', component: DetalleComponent },
  { path: 'clientes/page/:page', component: ClientesComponent },
  { path: 'login', component: LoginComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    DirectivaComponent,
    ClientesComponent,
    FormclienteComponent,
    PaginatorComponent,
    LoginComponent,
    DetalleComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule, 
    RouterModule.forRoot(routes),
    FormsModule,
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatMomentDateModule
  ],
  providers: [ClienteService,{provide: LOCALE_ID, useValue: 'es-AR' }],
  bootstrap: [AppComponent],
  
})
export class AppModule {}
