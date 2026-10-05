import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { TecnologiaService, Tecnologia } from '../tecnologia.service';

@Component({
  selector: 'app-catalogo',
  imports: [MatCardModule],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.css'
})
export class Catalogo implements OnInit {
  private catalogo = inject(TecnologiaService);
  private cdr = inject(ChangeDetectorRef);

  tecnologias: Tecnologia[] = [];
  carregando = true;
  erro = '';

  ngOnInit() {
    this.carregar();
  }

  carregar() {
    this.carregando = true;
    this.erro = '';

    this.catalogo.listar().subscribe({
      next: (lista) => {
        this.tecnologias = lista;
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.erro = 'Falha ao carregar o catalogo.';
        this.carregando = false;
        this.cdr.detectChanges();
      }
    });
  }
}