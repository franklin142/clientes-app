import { Component } from '@angular/core';

@Component({
  selector: 'app-directiva',
  templateUrl: './directiva.component.html',
})
export class DirectivaComponent{
  public listaCurso:string[] = ['Tyscript', 'java','otro'];
  habilitar:boolean = true;
  togglePanel() : void {
    this.habilitar = this.habilitar == true ? false : true;
  }
  constructor() { }
}
