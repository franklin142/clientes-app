import { Cliente } from "src/app/clientes/cliente";
import { ItemFactura } from "./item-factura";

export class Factura {
    id!: number;
    descripcion!: string;
    observacion!: string;
    total!: number;
    createdAt!: Date;
    items: Array<ItemFactura> = [];
    cliente!:Cliente;
}

