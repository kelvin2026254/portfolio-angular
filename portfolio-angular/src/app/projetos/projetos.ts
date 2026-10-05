import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ProjetoService, Projeto } from '../projeto.service';

@Component({
  selector: 'app-projetos',
  standalone: true,
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './projetos.html',
  styleUrl: './projetos.css'
})
export class Projetos implements OnInit {
  private service = inject(ProjetoService);
  private cdr = inject(ChangeDetectorRef);

  projetos: Projeto[] = [];
  carregando = true;
  erro = '';

  ngOnInit() {
    this.carregar();
  }

  carregar() {
    this.carregando = true;
    this.erro = '';

    this.service.listar().subscribe({
      next: (lista) => {
        this.projetos = lista;
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.erro = 'Falha ao carregar os projetos.';
        this.carregando = false;
        this.cdr.detectChanges();
      }
    });
  }
}