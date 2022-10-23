import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs';
import { ClienteModel } from 'src/app/model/cliente.model';
import { AuthService } from 'src/app/services/auth.service';
import { ClienteService } from 'src/app/services/cliente.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
})
export class ClientesComponent implements OnInit {
  clientes: ClienteModel[];
  paginador:any;

  constructor(
    private clienteService: ClienteService,
    private activatedRoute: ActivatedRoute,
    public authService:AuthService
  ) {}

  ngOnInit(): void {
    //this.SinPaginacion();
    this.ConPaginacion();
  }

  SinPaginacion() {
    this.clienteService
      .getClientes()
      .pipe(
        tap((clientes) => {
          console.log('ClienteComponent: tap 3');
          clientes.forEach((cliente) => {
            console.log(cliente.nombre);
          });
        })
      )
      .subscribe((clientes) => {
        this.clientes = clientes;
      });
  }

  ConPaginacion() {
    
    this.activatedRoute.paramMap.subscribe((params) => {
      let page:number = +params.get('page');
      if(!page){
        page=0;
      }
      this.clienteService
        .getClientesConPaginacion(page)
        .pipe(
          tap((response) => {
            console.log('ClienteComponent: tap 3');
            (response.content as ClienteModel[]).forEach((cliente) => {
              console.log(cliente.nombre);
            });
          })
        )
        .subscribe((response) => {
          this.clientes = response.content as ClienteModel[];
          this.paginador=response;
        });
    });
  }

  delete(cliente: ClienteModel): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger',
      },
      buttonsStyling: false,
    });
    swalWithBootstrapButtons
      .fire({
        title: 'Esta seguro?',
        text: `Seguro que desea eliminar el cliente ${cliente.nombre} ${cliente.apellido}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si, eliminar',
        cancelButtonText: 'No, cancelar!',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.clienteService.delete(cliente.id).subscribe((response) => {
            this.clientes = this.clientes.filter((cli) => cli !== cliente);
            swalWithBootstrapButtons.fire(
              'Cliente Eliminado!',
              `Cliente ${cliente.nombre} eliminado con exito.`,
              'success'
            );
          });
        }
      });
  }
}
