import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title: string = 'cliente-app';
  curso: string = 'desarrollo de apps angular con spring 5';
  profesor:string = 'Andrés Guzmán';
}
