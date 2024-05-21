import { Component } from '@angular/core';
import { AboutComponent } from '../about/about.component';
import { EventosComponent } from '../eventos/eventos.component';
import { NewsComponent } from '../news/news.component';
import { PersonasComponent } from '../personas/personas.component';
import { EstablecimientoComponent } from '../establecimiento/establecimiento.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    AboutComponent, EventosComponent, NewsComponent,PersonasComponent, EstablecimientoComponent, HeaderComponent ],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {

}
