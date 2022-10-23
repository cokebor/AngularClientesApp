import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClienteModel } from 'src/app/model/cliente.model';
import { AuthService } from 'src/app/services/auth.service';
import { ClienteService } from 'src/app/services/cliente.service';

@Component({
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {

  titulo:string='Detalle del Cliente'

  cliente:ClienteModel;

  constructor(private clienteService:ClienteService, private activatedRote: ActivatedRoute, public authService:AuthService) { }

  ngOnInit(): void {
    this.activatedRote.paramMap.subscribe(params=>{
      let id:number= +params.get('id');
      if(id){
        this.clienteService.getCliente(id).subscribe(
          cliente=>{
            this.cliente=cliente;
          }
        )
      }
    })
      
  }

  seleccionarFoto(event){

  }
}
