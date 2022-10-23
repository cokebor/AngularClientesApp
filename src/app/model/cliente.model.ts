import { RegionModel } from "./region.model";

export class ClienteModel {
    id:number;
    nombre:string='Jorge';
    apellido:string;
    createAt:string;
    email:string;
    foto:string;
    region:RegionModel;
}
