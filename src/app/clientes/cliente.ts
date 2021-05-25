import { Factura } from "../facturas/models/factura";
import { Region } from "./region";

export class Cliente {
  id!:number;
  nombre!:string;
  apellido!:string;
  createdAt!:string;
  email!:string;
  foto!:string;
  region!:Region;
  //se puede definir un array de ambas maneras
  //facturas:Factura[] = [];
  facturas:Array<Factura> = [];
}
