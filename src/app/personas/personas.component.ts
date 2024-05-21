import { Component, OnInit, inject } from '@angular/core';
import { ProfesoresService } from '../profesores.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-personas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './personas.component.html',
  styleUrls: ['./personas.component.css']
})
export class PersonasComponent implements OnInit {

  profesores: any[] = [];
  profesoresService = inject(ProfesoresService);

  ngOnInit(): void {
    this.getAllTeachers();
  }

  getAllTeachers() {
    this.profesoresService.getAllTeachers().subscribe(
      (data) => {
        const cantidadProfesores = 6; // Cantidad de profesores a mostrar
        for (let i = 0; i < cantidadProfesores; i++) {
          const indiceAleatorio = Math.floor(Math.random() * data.length);
          this.profesores.push(data[indiceAleatorio]);
          data.splice(indiceAleatorio, 1); // Remover el profesor seleccionado para evitar repetición
        }
        console.log(this.profesores); // Añade este log para verificar los datos
      },
      (error) => {
        console.error('Error al obtener los profesores', error);
      }
    );
  }
}
