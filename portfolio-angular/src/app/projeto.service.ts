import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, timeout } from 'rxjs';

export interface Projeto {
  id: number;
  nome: string;
  descricao: string;
  tecnologias: string;
  link_github: string;
  ano: number;
}

export type ProjetoDados = Omit<Projeto, 'id'>;

@Injectable({
  providedIn: 'root'
})
export class ProjetoService {
  private http = inject(HttpClient);

  private url =
    'https://reimagined-broccoli-r7rpr5x4wj64hxjw9-3000.app.github.dev/api/projetos';

  listar(): Observable<Projeto[]> {
    return this.http.get<Projeto[]>(this.url).pipe(
      timeout(10000)
    );
  }

  criar(projeto: ProjetoDados): Observable<{ id: number }> {
    return this.http.post<{ id: number }>(
      this.url,
      projeto
    ).pipe(
      timeout(10000)
    );
  }

  adicionar(projeto: ProjetoDados): Observable<{ id: number }> {
    return this.criar(projeto);
  }

  atualizar(
    id: number,
    projeto: ProjetoDados
  ): Observable<{ id?: number; mensagem?: string }> {
    return this.http.put<{ id?: number; mensagem?: string }>(
      `${this.url}/${id}`,
      projeto
    ).pipe(
      timeout(10000)
    );
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.url}/${id}`
    ).pipe(
      timeout(10000)
    );
  }
}