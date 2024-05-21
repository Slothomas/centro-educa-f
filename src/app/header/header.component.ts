import { Component } from '@angular/core';
import { RouterOutlet, RouterLinkActive, RouterLink } from '@angular/router';



@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterOutlet, RouterLinkActive,RouterLink],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

}
