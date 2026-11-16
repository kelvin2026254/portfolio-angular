# portfolio-angular

### Aula 27: Os projetos vêm da API

O front-end busca os projetos e o catálogo de tecnologias diretamente na API em Node.js, utilizando `fetch` dentro de `useEffect`.

O endereço da API fica centralizado no arquivo `portfolio-react/src/api.js`.

O arquivo `portfolio-react/src/projetos.js` foi removido, pois os dados dos projetos agora vêm do banco de dados por meio da API.

Para visualizar os dados, é necessário iniciar o MariaDB e o servidor Node.js. A porta 3000 da API deve estar configurada como **Public** no Codespace.

**Comandos para iniciar:**

```bash
sudo service mariadb start
cd api-node
export JWT_SECRET="teste"
node server.js
```

Com a API em execução, o front-end React consegue buscar e exibir os projetos e as tecnologias.

### Aula 26: estado, lista e formulário

Os projetos saíram do `App.jsx` e moram em `src/projetos.js`. A tela os desenha com `map`.

O formulário de contato (`src/Contato.jsx`) guarda o que a pessoa digita no estado, com `useState`.

Ele ainda não envia nada: apenas avisa e limpa os campos. O envio de verdade chega com a API.

### Aula 25: o Portfolio em React

O front novo nasce em `portfolio-react/` (Vite + React), ao lado do Angular. Para rodar:

```bash
cd portfolio-react
npm install
npm run dev
```

A tela abre na porta 5173. Por enquanto, os projetos são fixos no `src/App.jsx`; a Aula 27 os traz da API.

### Aula 24: autenticação com token

Quem escreve precisa de um token. Antes do primeiro uso, crie a tabela de usuários e o dono:

```bash
sudo mariadb dwii_db < sql/usuarios.sql
cd api-node
npm install
node criar-usuario.js dono@portfolio.dev portfolio2026
```

A API utiliza a variável de ambiente `JWT_SECRET`. Configure-a antes de iniciar o servidor:

```bash
export JWT_SECRET="sua-chave-secreta"
node server.js
```

O token é gerado no login e deve ser enviado no cabeçalho `Authorization: Bearer` para criar, atualizar e excluir projetos.

### Aula 23: operações da API

A API em uso é a de `api-node/`. Os arquivos `api/*.php` e `conexao.php` ficam no repositório como histórico do segundo trimestre.

As seis operações foram testadas com `curl -i`.

#### 1. Login — POST /api/login

Comando:

```bash
curl -i -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"dono@portfolio.dev","senha":"portfolio2026"}'
```

Resposta:

```http
HTTP/1.1 200 OK
```

```json
{
  "token": "[TOKEN GERADO PELA API]",
  "usuario": {
    "id": 1,
    "email": "dono@portfolio.dev"
  }
}
```

O token foi ocultado neste README. Para as próximas operações, utilize o token retornado pelo seu próprio login.

#### 2. Listar projetos — GET /api/projetos

Comando:

```bash
curl -i http://localhost:3000/api/projetos
```

Resposta:

```http
HTTP/1.1 200 OK
```

```json
[
  {
    "id": 2,
    "nome": "Sistema de Biblioteca",
    "descricao": "CRUD de acervo e emprestimos, com busca e relatorios.",
    "tecnologias": "PHP, MariaDB, Bootstrap",
    "link_github": "https://github.com/usuario/biblioteca",
    "ano": 2025
  },
  {
    "id": 4,
    "nome": "Loja Virtual (prototipo)",
    "descricao": "Catalogo de produtos com carrinho e checkout simulado.",
    "tecnologias": "PHP, MariaDB, JavaScript",
    "link_github": "https://github.com/usuario/loja",
    "ano": 2024
  },
  {
    "id": 5,
    "nome": "API de Clima",
    "descricao": "Microsservico que consome uma API publica e devolve a previsao em JSON.",
    "tecnologias": "PHP, REST",
    "link_github": "https://github.com/usuario/clima",
    "ano": 2026
  },
  {
    "id": 6,
    "nome": "Jogo da Velha (em construcao)",
    "descricao": "Jogo da velha local - ainda em desenvolvimento.",
    "tecnologias": "JavaScript, HTML",
    "link_github": null,
    "ano": 2026
  },
  {
    "id": 56,
    "nome": "Projeto com tranca",
    "descricao": "",
    "tecnologias": "",
    "link_github": "",
    "ano": 2026
  },
  {
    "id": 57,
    "nome": "Projeto com tranca",
    "descricao": "",
    "tecnologias": "",
    "link_github": "",
    "ano": 2026
  },
  {
    "id": 58,
    "nome": "Qualquer um cria",
    "descricao": "",
    "tecnologias": "",
    "link_github": "",
    "ano": 2026
  },
  {
    "id": 59,
    "nome": "Qualquer um cria",
    "descricao": "",
    "tecnologias": "",
    "link_github": "",
    "ano": 2026
  },
  {
    "id": 61,
    "nome": "Projeto README",
    "descricao": "",
    "tecnologias": "",
    "link_github": "",
    "ano": 2026
  }
]
```

#### 3. Buscar projeto por ID — GET /api/projetos/:id

Comando:

```bash
curl -i http://localhost:3000/api/projetos/5
```

Resposta:

```http
HTTP/1.1 200 OK
```

```json
{
  "id": 5,
  "nome": "API de Clima",
  "descricao": "Microsservico que consome uma API publica e devolve a previsao em JSON.",
  "tecnologias": "PHP, REST",
  "link_github": "https://github.com/usuario/clima",
  "ano": 2026
}
```

#### 4. Criar projeto — POST /api/projetos

Comando:

```bash
curl -i -X POST http://localhost:3000/api/projetos \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"nome":"Projeto README","ano":2026}'
```

Resposta:

```http
HTTP/1.1 201 Created
```

```json
{
  "id": 62
}
```

#### 5. Atualizar projeto — PUT /api/projetos/:id

Comando:

```bash
curl -i -X PUT http://localhost:3000/api/projetos/62 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"nome":"Projeto README atualizado","ano":2026}'
```

Resposta:

```http
HTTP/1.1 200 OK
```

```json
{
  "mensagem": "Projeto atualizado."
}
```

#### 6. Excluir projeto — DELETE /api/projetos/:id

Comando:

```bash
curl -i -X DELETE http://localhost:3000/api/projetos/62 \
  -H "Authorization: Bearer $TOKEN"
```

Resposta:

```http
HTTP/1.1 204 No Content
```

A resposta não possui corpo, pois o projeto foi excluído com sucesso.

### Aula 22: a API lê do banco

Antes de subir a API, o MariaDB precisa estar ligado:

```bash
sudo service mariadb start
cd api-node
export JWT_SECRET="sua-chave-secreta"
node server.js
```

Rotas que leem do banco `dwii_db`:

```bash
curl -i http://localhost:3000/api/projetos
curl -i http://localhost:3000/api/projetos/5
curl -i http://localhost:3000/api/tecnologias
```

### Configuração do banco de dados

O arquivo SQL disponível neste repositório é `sql/usuarios.sql`, utilizado para criar a tabela de usuários. Não há um arquivo `setup.sql` no projeto.

### Autoavaliação

Consegui implementar e testar as operações de login, listagem, busca, criação, atualização e exclusão de projetos, utilizando autenticação com JWT nas operações de escrita.