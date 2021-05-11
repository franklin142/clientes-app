//onChanges sirve para detectar cambios en un elemento
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'paginator-nav',
  templateUrl: './paginator.component.html'
})
export class PaginatorComponent implements OnInit, OnChanges {
  //@Input() es lo que nos permite inyectar desde el 
  //html una variable enviada desde un componente padre
  @Input() paginator: any;
  //El maximo numero de paginas que pueden verse en pantalla
  maxPages: number = 5;
  //Representa el numero menor del rango a mostrar en el paginador con relacion a la pagina actual
  desde: number = 0;
  //Representa el numero maximo a mostrar en la pagina segun la pagina actual
  hasta: number = 0;
  //Representa el numero de paginas en pantalla
  paginas: number[] = [];
  constructor() { }
  ngOnInit(): void {
    this.initPaginator();
  }
  ngOnChanges(changes: SimpleChanges): void {
    let newPaginator = changes['paginator'];
    if (newPaginator.previousValue){ //sirve para obtener el valor anterior del elemento que ha cambiado
      this.initPaginator();
    }
  }
  //metodo personalizado
  private initPaginator(){
    ///////////////////////////////////////////////////////////////////
    //Representa el minimo numero que va a ser mostrado en el paginador
    //si el maxPages es de 5 y estamos en la primer pagina de la tabla,
    //el MinNumberPage seria 0 - (5-1) = -6 por lo que la funcion 
    //detecterá al primer parametro que tiene 1 como el maximo valor y lo retornará.
    //Esto es asi porque el paginador debe mostrar a partir de 1
    //y cuando el paginado llege a 6 la minima pagina visible sea la 2. 6-(5-1)=2
    //en ese momento es cuando la pagina 1 desaparecerá del menu
    let MinNumberPage = Math.max(1, this.paginator.number - (this.maxPages - 1));

    //por documentar y analizar
    let totalPagesBack = this.paginator.totalPages - this.maxPages;

    //por documentar y analizar
    this.desde = Math.min(MinNumberPage, totalPagesBack);

    //////////////////////////////////////////////////////////
    //Representa el maximo numero que va a ser mostrado en el paginador
    //Si el total de paginas a partir de la actual mas otras 4 paginas es mayor
    //al total de paginas se mostrarian paginas que no existen
    //por ese motivo la ultima pagina no debe execer las paginas reales. 
    //la solucion es utilizar Math.min() que a pesar de que el segundo parametro sea 
    //mucho mayor a las paginas reales, la funcion me retornara totalPages como ultima pagina
    let MaxNumberPage = Math.min(this.paginator.totalPages, this.paginator.number + (this.maxPages - 1));
    
    //Al rango le debemos sumar una pagina más, con el objetivo de mostrar
    //La nueva pagina disponible para hacer clic, si no se sumase +1, el paginador 
    //mostraria 5 en vez de 6 como la ultima opcion al hacer clic en siguiente.   
    let newMaxPages =(this.maxPages + 1);

    //Obtenemos cual de las anteriores variables es la mayor newMaxNumberPage o newMaxPages
    this.hasta = Math.max(MaxNumberPage, newMaxPages);

    //Si el numero de paginas es mayor al maxPages se calcula el rango de paginas
    if (this.paginator.totalPages > this.maxPages) {
      this.paginas = new Array(this.hasta - this.desde + 1)
        .fill(0).map((_value, key) => key + this.desde);
    } else {
      //Si no es mayor al maxPages entonces imprimen todas las paginas en el index
      this.paginas = new Array(this.paginator.totalPages)
        .fill(0).map((_value, key) => key + 1);
    }
  }

}
