import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { DirectivaComponent } from './directiva/directiva.component';
import { AppComponent } from './app.component';
import { ClientesComponent } from './clientes/clientes.component';
import { ClienteService } from './clientes/cliente.service';
import { PaginatorComponent } from './paginator/paginator.component';
import { FormComponent } from './clientes/form.component'; // permite la conexión entre los clientes y servidor
import { FormsModule } from '@angular/forms';

import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
// elementos necesarios para que funcionen las animaciones de material
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// Elementos necesarios para utilizar material datepiker
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { DetalleComponent } from './clientes/detalle/detalle.component';

registerLocaleData(localeEs, 'es');
const routes: Routes = [
  { path: '', redirectTo: '/clientes', pathMatch: 'full' },
  { path: 'clientes', component: ClientesComponent },
  { path: 'clientes/page/:page', component: ClientesComponent },
  { path: 'directivas', component: DirectivaComponent },
  { path: 'clientes/form', component: FormComponent },
  { path: 'clientes/form/:id', component: FormComponent }
  // para manejar la foto desde una ruta
  // { path: 'clientes/ver/:id', component: DetalleComponent }
];
@NgModule({
  declarations: [// aqui van todas las clases y componentes que pueden ser utilizados en app.component.html y app.component.ts
    AppComponent,
    HeaderComponent,
    FooterComponent,
    DirectivaComponent,
    ClientesComponent,
    FormComponent,
    PaginatorComponent,
    DetalleComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' }), // hace que las rutas funcionen en el componente principal app.component.html
    HttpClientModule, // Permite conectar con API Rest externas
    FormsModule, BrowserAnimationsModule,
    MatMomentDateModule,
    MatDatepickerModule
  ],
  providers: [ // aqui van los servicios que conecten a api rest externas
    ClienteService,
    { provide: LOCALE_ID, useValue: 'es' }, // para configurar el idioma general
    { provide: MAT_DATE_LOCALE, useValue: 'es' }, // Para configurar el idioma de la fecha de material
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }


