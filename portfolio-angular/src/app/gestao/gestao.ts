import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProjetoService, Projeto } from '../projeto.service';

@Component({
  selector: 'app-gestao',
  imports: [ReactiveFormsModule],
  templateUrl: './gestao.html',
  styleUrl: './gestao.css'
})
export class Gestao implements OnInit {
  private service = inject(ProjetoService);

  projetos: Projeto[] = [];
  carregando = true;
  erro = '';
  editandoId: number | null = null;
  salvando = false;

  form = new FormGroup({
    nome: new FormControl('', [Validators.required, Validators.minLength(3)]),
    descricao: new FormControl(''),
    tecnologias: new FormControl(''),
    link_github: new FormControl(''),
    ano: new FormControl(2026, [Validators.required])
  });

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
      },
      error: () => {
        this.erro = 'Nao foi possivel carregar os projetos.';
        this.carregando = false;
      }
    });
  }

  editar(p: Projeto) {
    this.editandoId = p.id;

    this.form.patchValue({
      nome: p.nome,
      descricao: p.descricao,
      tecnologias: p.tecnologias,
      link_github: p.link_github,
      ano: p.ano
    });

    this.erro = '';
  }

  salvar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.salvando = true;
    this.erro = '';

    const dados = this.form.getRawValue() as Projeto;

    if (this.editandoId !== null) {
      this.service.atualizar(this.editandoId, dados).subscribe({
        next: () => {
          this.salvando = false;

          const projetoAtualizado: Projeto = {
            ...dados,
            id: this.editandoId!
          };

          this.projetos = this.projetos.map(p =>
            p.id === this.editandoId ? projetoAtualizado : p
          );

          this.form.reset({
            nome: '',
            descricao: '',
            tecnologias: '',
            link_github: '',
            ano: 2026
          });

          this.editandoId = null;
        },
        error: () => {
          this.salvando = false;
          this.erro = 'Nao foi possivel salvar. Tente de novo.';
        }
      });

    } else {
      this.service.criar(dados).subscribe({
        next: (resposta) => {
          this.salvando = false;

          const novoProjeto: Projeto = {
            ...dados,
            id: resposta.id
          };

          this.projetos = [novoProjeto, ...this.projetos];

          this.form.reset({
            nome: '',
            descricao: '',
            tecnologias: '',
            link_github: '',
            ano: 2026
          });
        },
        error: () => {
          this.salvando = false;
          this.erro = 'Nao foi possivel salvar. Tente de novo.';
        }
      });
    }
  }

  excluir(p: Projeto) {
    if (!p.id) {
      return;
    }

    if (!confirm(`Excluir o projeto "${p.nome}"? Esta acao nao pode ser desfeita.`)) {
      return;
    }

    this.erro = '';

    this.service.excluir(p.id).subscribe({
      next: () => {
        this.projetos = this.projetos.filter(x => x.id !== p.id);

        if (this.editandoId === p.id) {
          this.cancelarEdicao();
        }
      },
      error: () => {
        this.erro = 'Nao foi possivel excluir. Tente de novo.';
      }
    });
  }

  cancelarEdicao() {
    this.editandoId = null;
    this.erro = '';

    this.form.reset({
      nome: '',
      descricao: '',
      tecnologias: '',
      link_github: '',
      ano: 2026
    });
  }
}