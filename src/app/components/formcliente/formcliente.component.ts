import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClienteModel } from 'src/app/model/cliente.model';
import { RegionModel } from 'src/app/model/region.model';
import { ClienteService } from 'src/app/services/cliente.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-formcliente',
  templateUrl: './formcliente.component.html',
  styleUrls: ['./formcliente.component.css'],
})
export class FormclienteComponent implements OnInit {
  cliente: ClienteModel = new ClienteModel();
  regiones:RegionModel[];
  titulo: string = 'Crear Cliente';
  errores:string[];

  constructor(private clienteService: ClienteService, private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.cargarCliente();
    this.clienteService.getRegiones().subscribe(regiones=>this.regiones=regiones)
  }

  cargarCliente():void{
    this.activatedRoute.params.subscribe(params=>{
      let id=params['id'];
      if(id){
        this.clienteService.getCliente(id).subscribe(
          (cliente)=> this.cliente=cliente
        ) 
      }
    })
  }

  public create(): void {
    console.log(this.cliente);
    this.clienteService.create(this.cliente).subscribe((cliente) => {
      this.router.navigate(['/clientes']);
      Swal.fire('Nuevo cliente',`El Cliente ${cliente.nombre} ha sido creado con exito`, 'success');
    },err=>{
      this.errores=err.error.errors as string[];
      console.error('Codigo del error desde el backend: ' +err.status);
      console.error(err.error.errors);
    });
  }

  public update():void{
    console.log(this.cliente);
    this.clienteService.update(this.cliente).subscribe(
      (json)=>{
        this.router.navigate(['/clientes']);
        //Swal.fire('Cliente Actualizado',`Cliente ${cliente.nombre} actualizado con exito!`, 'success');
        Swal.fire('Cliente Actualizado',`${json.mensaje} : ${json.cliente.nombre}`, 'success');
      },err=>{
        this.errores=err.error.errors as string[];
        console.error('Codigo del error desde el backend: ' +err.status);
        console.error(err.error.errors);
      }
    )
  }

  compararRegion(o1:RegionModel,o2:RegionModel):boolean{
    if(o1===undefined && o2===undefined){
      return true;
    }
    return o1===null || o2===null || o1===undefined || o2===undefined?false:o1.id==o2.id;
  }
}
