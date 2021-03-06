import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, DEFAULT_CURRENCY_CODE, NgModule } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { DirectivaComponent } from './directiva/directiva.component';
import { AppComponent } from './app.component';
import { ClientesComponent } from './clientes/clientes.component';
import { ClienteService } from './clientes/cliente.service';
import { PaginatorComponent } from './paginator/paginator.component';
import { FormComponent } from './clientes/form.component'; // permite la conexión entre los clientes y servidor
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
// elementos necesarios para que funcionen las animaciones de material
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Elementos necesarios para utilizar material datepiker
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
// Elements necesarios para que el auto complete funcione
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

import { DetalleComponent } from './clientes/detalle/detalle.component';
import { LoginComponent } from './usuarios/login.component';
import { AuthGuard } from './usuarios/guards/auth.guard';
import { RoleGuard } from './usuarios/guards/role.guard';
import { TokenInterceptor } from "./usuarios/interceptors/token.interceptor";
import { AuthInterceptor } from './usuarios/interceptors/auth.interceptor';
import { DetalleFacturaComponent } from './facturas/detalle-factura.component';
import { FacturasComponent } from './facturas/facturas.component';
registerLocaleData(localeEs, 'es');
const routes: Routes = [
  { path: '', redirectTo: '/clientes', pathMatch: 'full'},
  { path: 'clientes', component: ClientesComponent },
  { path: 'clientes/page/:page', component: ClientesComponent },
  { path: 'directivas', component: DirectivaComponent },
  { path: 'clientes/form', component: FormComponent, 
  //los guards se ejecutan en orden pero aunque uno devuelva false,
  // los demás siempre se ejecutarán. Si hay una validación en el primero,
  // tambien debe hacerse en el segundo 
      canActivate:[AuthGuard,RoleGuard],data:{role: 'ROLE_ADMIN'}},
  { path: 'clientes/form/:id', component: FormComponent, 
      canActivate:[AuthGuard,RoleGuard],data:{role: 'ROLE_ADMIN'}},
  { path: 'login', component: LoginComponent },
  // para manejar la foto y detalle de cliente desde una ruta
  // { path: 'clientes/ver/:id', component: DetalleComponent }
  {path: 'facturas/:id', component: DetalleFacturaComponent,
      canActivate:[AuthGuard,RoleGuard],data:{role: 'ROLE_SALES'}},
  {path: 'facturas/form/:clienteId', component: FacturasComponent,
  canActivate:[AuthGuard,RoleGuard],data:{role: 'ROLE_SALES'}}
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
    DetalleComponent,
    LoginComponent,
    DetalleFacturaComponent,
    FacturasComponent,
    
  ],
  imports: [// aqui van los modulos completos ya sean creados por nosotros o de otra procedencia
    BrowserModule,
    RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' }), // hace que las rutas funcionen en el componente principal app.component.html
    HttpClientModule, // Permite conectar con API Rest externas
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatMomentDateModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule
  ],
  providers: [ // aqui van los servicios que conecten a api rest externas
    ClienteService,
    { provide: LOCALE_ID, useValue: 'es' }, // para configurar el idioma general
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'USD'}, // configura la moneda por defecto del sistema
    { provide: MAT_DATE_LOCALE, useValue: 'es' }, // Para configurar el idioma de la fecha de material
    { provide: HTTP_INTERCEPTORS,useClass:TokenInterceptor, multi:true }, // para agregar el token al header http antes de enviar cualquierrequest
    { provide: HTTP_INTERCEPTORS,useClass:AuthInterceptor, multi:true } // para procesar errores antes de que lleguen a los services

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }


