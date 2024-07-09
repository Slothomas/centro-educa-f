import { Component, ViewChild } from '@angular/core';
import { EnviocorreoService } from '../enviocorreo.service';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-about-home',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastModule],
  providers: [MessageService],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutHomeComponent {
  mensaje: string = '';
  nombre: string = '';
  correo: string = '';

  @ViewChild('myForm') myForm!: NgForm;

  constructor(
    private envioCorreoService: EnviocorreoService,
    private messageService: MessageService
  ) {}

  enviarCorreo() {
    this.envioCorreoService.enviarCorreo(this.nombre, this.correo, this.mensaje)
      .subscribe(
        (response) => {
          console.log('Correo enviado correctamente', response);
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Correo enviado correctamente.' });
          // Restablecer el formulario
          this.resetForm();
        },
        (error) => {
          console.error('Error al enviar correo', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al enviar correo.' });
        }
      );
  }

  resetForm() {
    this.nombre = '';
    this.correo = '';
    this.mensaje = '';
    if (this.myForm) {
      this.myForm.reset();
    }
  }
}
