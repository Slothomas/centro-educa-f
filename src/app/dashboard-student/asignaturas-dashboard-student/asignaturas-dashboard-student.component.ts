import { Component, OnInit } from '@angular/core';
import { EstudiantesService } from '../../estudiantes.service';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/auth.service';
import { CarouselModule } from 'primeng/carousel';

@Component({
  selector: 'app-asignaturas-dashboard-student',
  standalone: true,
  providers: [EstudiantesService],
  imports: [CommonModule, CarouselModule],
  templateUrl: './asignaturas-dashboard-student.component.html',
  styleUrls: ['./asignaturas-dashboard-student.component.css']
})

export class AsignaturasDashboardStudentComponent  {
  asignaturas: any[] = [];
  responsiveOptions: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 3,
      numScroll: 3,
    },
    {
      breakpoint: '768px',
      numVisible: 2,
      numScroll: 2,
    },
  ];

}
