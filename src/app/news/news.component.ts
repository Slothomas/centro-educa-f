import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { GalleriaModule } from 'primeng/galleria';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-news',
  standalone: true,
  imports: [GalleriaModule, CommonModule, FormsModule],
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {

  images: any[] = []; // Inicializamos el arreglo aquí
  position: 'bottom' | 'top' | 'left' | 'right' | undefined = 'bottom'; // Asegura que position tenga uno de los valores aceptados

  responsiveOptions: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 5
    },
    {
      breakpoint: '768px',
      numVisible: 3
    },
    {
      breakpoint: '560px',
      numVisible: 1
    }
  ];

  ngOnInit() {
    this.images = [
      { itemImageSrc: '../../assets/img/noticias/imagen1.png', thumbnailImageSrc: '../../assets/img/noticias/imagen1.png' },
      { itemImageSrc: '../../assets/img/noticias/imagen2.png', thumbnailImageSrc: '../../assets/img/noticias/imagen2.png' },
      { itemImageSrc: '../../assets/img/noticias/imagen3.png', thumbnailImageSrc: '../../assets/img/noticias/imagen3.png' },
      { itemImageSrc: '../../assets/img/noticias/imagen4.png', thumbnailImageSrc: '../../assets/img/noticias/imagen4.png' }

      // Agrega más objetos de imágenes según sea necesario
    ];
  }
}
