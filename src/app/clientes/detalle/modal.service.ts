import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
/**
 * Este ModalService se crea con ng g s clientes/detalle/modal
 * y sirve para controlar los estados del modal y poder abrir y cerrarlo
 * el codigo de este archivo no es autogenerado por lo que replicar este
 * metodo de trabajar implica adaptar los metodos
 */
export class ModalService {
  modal:boolean = false;
  constructor() { }
  openModal(){
    this.modal=true;
  }
  closeModal(){
    this.modal=false;
  }
}
