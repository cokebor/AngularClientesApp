import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { CLIENTES } from '../components/clientes/clientes.json';
import { ClienteModel } from '../model/cliente.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { formatDate,DatePipe } from '@angular/common';
import { RegionModel } from '../model/region.model';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private URL: string = 'http://localhost:8080/api/clientes';

  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient, private router:Router, private authService:AuthService) {}

  private agregarAuthorizationHeader(){
    let token=this.authService.token;
    if(token !=null){
      return this.httpHeaders.append('Authorization','Bearer ' + token);
    }
    return this.httpHeaders;
  }

  private isNoAutorizado(e):boolean{
    if(e.status==401){
      if(this.authService.isAuthenticated()){
        this.authService.logout();
      }
      this.router.navigate(['/login']);
      return true;
    }
    if(e.status==403){
      Swal.fire('Acceso denegado',`Hola ${this.authService.usuario.username} no tienes acceso a este recurso`,'warning');
      this.router.navigate(['/clientes']);
      return true;
    }
    return false;
  }

  getRegiones():Observable<RegionModel[]>{
    return this.http.get<RegionModel[]>(this.URL + '/regiones',{headers: this.agregarAuthorizationHeader()}).pipe(
      catchError(e=>{
        this.isNoAutorizado(e);
        return throwError(e);
      })
    );
  }

  //Sin Paginacion
  getClientes(): Observable<ClienteModel[]> {
    //return of(CLIENTES);
    //return this.http.get<ClienteModel[]>(this.URL);
    return this.http.get(this.URL).pipe(
      tap(response=>{
        let clientes=response as ClienteModel[];
        console.log('ClienteService: tap 1')
        clientes.forEach(
          cliente=>{
            console.log(cliente.nombre);
          }
        )
      }),
      map(response=>{
        let clientes=response as ClienteModel[];
        return clientes.map(cliente=>{
          cliente.nombre=cliente.nombre.toUpperCase();
          
          let datePipe=new DatePipe('es-AR');
          //Lo comento para hacer lo mismo con pipes en el html
          //cliente.createAt=datePipe.transform(cliente.createAt,'EEEE dd, MMMM yyyy')//formatDate(cliente.createAt,'dd-MM-yyyy','en-US');
          return cliente;
        });
      }),
      tap(response=>{
        console.log('ClienteService: tap 2')
        response.forEach(
          cliente=>{
            console.log(cliente.nombre);
          }
        )
      })
    );
  }


    //Con Paginacion
    getClientesConPaginacion(page:number): Observable<any> {
      //return of(CLIENTES);
      //return this.http.get<ClienteModel[]>(this.URL);
      return this.http.get(this.URL+'/page/'+page).pipe(
        tap((response:any)=>{
          console.log('ClienteService: tap 1');
          (response.content as ClienteModel[]).forEach(
            cliente=>{
              console.log(cliente.nombre);
            }
          )
        }),
        map((response:any)=>{
          (response.content as ClienteModel[]).map(cliente=>{
            cliente.nombre=cliente.nombre.toUpperCase();
            
           // let datePipe=new DatePipe('es-AR');
            //Lo comento para hacer lo mismo con pipes en el html
            //cliente.createAt=datePipe.transform(cliente.createAt,'EEEE dd, MMMM yyyy')//formatDate(cliente.createAt,'dd-MM-yyyy','en-US');
            return cliente;
          });
          return response;
        }),
        tap(response=>{
          console.log('ClienteService: tap 2');
          (response.content as ClienteModel[]).forEach(
            cliente=>{
              console.log(cliente.nombre);
            }
          )
        })
      );
    }
  //Aca recibimos un Observable<ClienteModel> se puede hacer de esta manera o como esta en update con any
  //Si lo hacemos de esta forma tenemos que convertir el tipo map recibido como en la linea map((responde.....
  create(cliente: ClienteModel): Observable<ClienteModel> {
    return this.http.post(this.URL, cliente, {
      headers: this.agregarAuthorizationHeader(),
    }).pipe(
      map((response:any)=>response.cliente as ClienteModel),
      catchError((e) => {
        if(this.isNoAutorizado(e)){
          return throwError(e);  
        }
        if(e.status==400){
          return throwError(e);  
        }
        console.error(e.error.mensaje);
        Swal.fire( e.error.mensaje, e.error.error,'error');
        return throwError(e);
      })
    );
  }

  getCliente(id: number): Observable<ClienteModel> {
    return this.http.get<ClienteModel>(`${this.URL}/${id}`,{headers: this.agregarAuthorizationHeader()}).pipe(
      catchError((e) => {
        //Este if es para las valicaciones en Spring
        if(this.isNoAutorizado(e)){
          return throwError(e);  
        }
        if(e.status==400){
          return throwError(e);  
        }
        this.router.navigate(['/clientes']);
        console.error(e.error.mensaje);
        Swal.fire('Error al editar', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }

  update(cliente: ClienteModel): Observable<any> {
    return this.http.put<any>(`${this.URL}/${cliente.id}`, cliente, {
      headers: this.agregarAuthorizationHeader(),
    }).pipe(
      catchError((e) => {
        if(this.isNoAutorizado(e)){
          return throwError(e);  
        }
        console.error(e.error.mensaje);
        Swal.fire( e.error.mensaje, e.error.error,'error');
        return throwError(e);
      })
    );
  }

  delete(id: number): Observable<ClienteModel> {
    return this.http.delete<ClienteModel>(`${this.URL}/${id}`, {
      headers: this.agregarAuthorizationHeader(),
    }).pipe(
      catchError((e) => {
        if(this.isNoAutorizado(e)){
          return throwError(e);  
        }
        console.error(e.error.mensaje);
        Swal.fire( e.error.mensaje, e.error.error,'error');
        return throwError(e);
      })
    );
  }

  subirFoto(archivo:File, id):Observable<ClienteModel>{
    let formData=new FormData();
    formData.append("archivo", archivo);
    formData.append("id", id);
    return this.http.post(`${this.URL}/upload/`,formData).pipe(
      map((response:any)=>response.cliente as ClienteModel),catchError(e=>{
        console.error(e.error.mensaje);
        Swal.fire( e.error.mensaje, e.error.error,'error');
        return throwError(e);
      })
    );
  }
  /*
  Agregar al metodo subirFoto

let httpHeaders=new HttpHeaders();
let token=this.authService.token;
if(token!=null){
  httpHeaders=httpHeaders.append('Authorization', 'Bearer ' + token);
}

const req=new HttpRequest('POST',`${this.urlEndPoint}/upload`, formData.......){

  headers: httpHeaders;
}

return this.http,request(req).pipe(
      catchError(e=>{
        this.isNoAutorizado(e);
        return throwError(e);
      })
    );
  */
}
