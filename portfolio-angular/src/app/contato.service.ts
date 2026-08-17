import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface NovoContato {
  nome: string;
  email: string;
  mensagem: string;
}

export interface RespostaContato {
  sucesso: boolean;
  id: number;
  mensagem: string;
  erros?: string[]; // Mapeia a lista de erros enviada pelo PHP no status 400
}

@Injectable({
  providedIn: 'root',
})
export class ContatoService {
  private http = inject(HttpClient);

  private url = 'https://reimagined-broccoli-r7rpr5x4wj64hxjw9-8000.app.github.dev/api/contato.php';

  enviar(dados: NovoContato): Observable<RespostaContato> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post<RespostaContato>(this.url, dados, { headers });
  }
}