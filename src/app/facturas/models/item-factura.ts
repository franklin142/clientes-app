import { Producto } from "./producto";

export class ItemFactura {
    id!: number;
    cantidad: number = 1;
    producto!: Producto;
    // utilizamos el importe que viene del backend
    importe!: number;
    
    // podemos generar el total mediante un metodo de la clase
    // o utilizar el que viene del backend
    getImporte():number{
        if(this.producto){
            return this.cantidad * this.producto.precio;
        }else{
            return 0;
        }
    }

}
