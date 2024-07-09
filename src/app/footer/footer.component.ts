import { Component } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [DialogModule, CommonModule, ToastModule],
  providers: [MessageService],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  display: boolean = false;
  selectedSection: string = '';
  dialogHeader: string = '';

  showDialog(section: string) {
    this.selectedSection = section;
    this.display = true;

    switch(section) {
      case 'Acerca de Nosotros':
        this.dialogHeader = 'Acerca de Nosotros';
        break;
      case 'Política de Privacidad':
        this.dialogHeader = 'Política de Privacidad';
        break;
      case 'Términos y Condiciones':
        this.dialogHeader = 'Términos y Condiciones';
        break;
      default:
        this.dialogHeader = '';
    }
  }
}
