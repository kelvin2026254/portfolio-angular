import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ContatoService, NovoContato } from '../contato.service';
import { timeout } from 'rxjs'; // Importante!

@Component({
  selector: 'app-contato',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './contato.html',
  styleUrl: './contato.css'
})
export class Contato {
  private fb = inject(FormBuilder);
  private service = inject(ContatoService);
  enviando = false;
  sucesso = '';
  erro = '';

  form = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    mensagem: ['', [Validators.required, Validators.minLength(10)]],
  });

  onSubmit() {
    this.sucesso = '';
    this.erro = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.enviando = true;
    const dados = this.form.getRawValue() as NovoContato;

    this.service.enviar(dados)
      .pipe(timeout(8000)) // Cancela após 8 segundos e vai pro bloco error
      .subscribe({
        next: (resp) => {
          this.sucesso = resp.mensagem;
          this.form.reset();
          this.enviando = false;
        },
        error: (err) => {
          this.enviando = false;
          if (err.name === 'TimeoutError') {
            this.erro = 'O servidor demorou muito para responder. Verifique se a porta 8000 está pública.';
          } else if (err.error?.erros) {
            this.erro = err.error.erros.join(' ');
          } else {
            this.erro = 'Não foi possível conectar ao servidor backend.';
          }
        },
      });
  }
}