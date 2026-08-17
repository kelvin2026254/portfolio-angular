import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { TecnologiaService, Tecnologia } from '../tecnologia.service';

@Component({
  selector: 'app-catalogo',
  imports: [MatCardModule],
  templateUrl: './catalogo.html'
})
export class Catalogo implements OnInit {
  private catalogo = inject(TecnologiaService);
  tecnologias: Tecnologia[] = [];
  carregando = true;
  erro = '';

  ngOnInit() {
    this.catalogo.listar().subscribe({
      next: (lista) => { this.tecnologias = lista; this.carregando = false; },
      error: () => { this.erro = 'Falha ao carregar o catalogo.'; this.carregando = false; }
    });
  }
}