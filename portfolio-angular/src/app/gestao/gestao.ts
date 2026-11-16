import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { ProjetoService, Projeto } from '../projeto.service';

@Component({
  selector: 'app-gestao',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './gestao.html',
  styleUrls: ['./gestao.css']
})
export class Gestao implements OnInit {
  form: FormGroup;
  projetos: Projeto[] = [];

  salvando = false;
  erro = '';
  editandoId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private service: ProjetoService,
    private cdr: ChangeDetectorRef,
    private zone: NgZone
  ) {
    this.form = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      descricao: [''],
      tecnologias: [''],
      link_github: [''],
      ano: [
        new Date().getFullYear(),
        [Validators.required, Validators.min(1900)]
      ]
    });
  }

  ngOnInit(): void {
    this.carregarProjetos();
  }

  carregarProjetos(): void {
    this.erro = '';

    this.service.listar().subscribe({
      next: (dados: Projeto[]) => {
        this.zone.run(() => {
          this.projetos = [...dados];
          this.cdr.detectChanges();
        });
      },
      error: (erro: unknown) => {
        console.error('Erro ao carregar projetos:', erro);

        this.zone.run(() => {
          this.erro = 'Não foi possível carregar os projetos.';
          this.cdr.detectChanges();
        });
      }
    });
  }

  salvar(): void {
    if (this.form.invalid || this.salvando) {
      this.form.markAllAsTouched();
      return;
    }

    this.salvando = true;
    this.erro = '';

    const dados = this.form.getRawValue();

    const finalizar = (): void => {
      this.salvando = false;
      this.cancelarEdicao();
      this.carregarProjetos();
      this.cdr.detectChanges();
    };

    const falhar = (erro: unknown): void => {
      console.error('Erro ao salvar projeto:', erro);
      this.erro = 'Não foi possível salvar o projeto.';
      this.salvando = false;
      this.cdr.detectChanges();
    };

    if (this.editandoId !== null) {
      this.service.atualizar(this.editandoId, dados).subscribe({
        next: () => finalizar(),
        error: (erro: unknown) => falhar(erro)
      });
    } else {
      this.service.adicionar(dados).subscribe({
        next: () => finalizar(),
        error: (erro: unknown) => falhar(erro)
      });
    }
  }

  editar(p: Projeto): void {
    if (this.salvando) {
      return;
    }

    this.erro = '';
    this.editandoId = p.id;

    this.form.patchValue({
      nome: p.nome,
      descricao: p.descricao,
      tecnologias: p.tecnologias,
      link_github: p.link_github,
      ano: p.ano
    });

    this.cdr.detectChanges();
  }

  cancelarEdicao(): void {
    this.editandoId = null;

    this.form.reset({
      nome: '',
      descricao: '',
      tecnologias: '',
      link_github: '',
      ano: new Date().getFullYear()
    });

    this.cdr.detectChanges();
  }

  excluir(p: Projeto): void {
    if (p.id == null || this.salvando) {
      return;
    }

    const id = p.id;
    const projetosAnteriores = [...this.projetos];

    this.erro = '';

    this.projetos = this.projetos.filter(
      projeto => projeto.id !== id
    );

    if (this.editandoId === id) {
      this.cancelarEdicao();
    }

    this.cdr.detectChanges();

    this.service.excluir(id).subscribe({
      next: () => {
        this.carregarProjetos();
      },
      error: (erro: unknown) => {
        console.error('Erro ao excluir projeto:', erro);

        this.projetos = projetosAnteriores;
        this.erro = 'Não foi possível excluir o projeto.';
        this.cdr.detectChanges();
      }
    });
  }
}

