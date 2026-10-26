### Aula 25: o Portfolio em React

O front novo nasce em `portfolio-react/` (Vite + React), ao lado do Angular. Para rodar

cd portfolio-react
npm install
npm run dev

A tela abre na porta 5173. Por enquanto os projetos sao fixos no `src/App.jsx`; a Aula 27 os traz da API.



# portfolio-angular

### Aula 24: a tranca

Quem escreve precisa de um token. Antes do primeiro uso, crie a tabela e o dono:

```bash
sudo mariadb dwii_db < sql/usuarios.sql
cd api-node
npm install
node criar-usuario.js dono@portfolio.dev portfolio2026
```

**Login e escrita com o token:**

```bash
curl -i -X POST http://localhost:3000/api/login -H "Content-Type: application/json" -d '{"email":"dono@portfolio.dev","senha":"portfolio2026"}'

curl -i -X POST http://localhost:3000/api/projetos -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"nome":"Projeto com tranca","ano":2026}'

curl -i -X PUT http://localhost:3000/api/projetos/8 -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"nome":"Projeto com tranca (editado)","ano":2026}'
```

**Resultado esperado:** a prévia mostra a subseção com os dois blocos de comandos.

### Aula 22: a API le do banco

Antes de subir a API, o MariaDB precisa estar de pe:

    sudo service mariadb start
    cd api-node
    node server.js

Rotas que leem do `dwii_db`:

    curl -i http://localhost:3000/api/projetos
    curl -i http://localhost:3000/api/projetos/5
    curl -i http://localhost:3000/api/tecnologias

### Aula 23: a API cria, altera e apaga

A API em uso e a de `api-node/`. Os arquivos `api/*.php` e `conexao.php` ficam repositorio como historico do 2o trimestre.

    curl -i -X POST http://localhost:3000/api/projetos -H "Content-Type: appli
    curl -i -X PUT http://localhost:3000/api/projetos/7 -H "Content-Type: appli
    curl -i -X DELETE http://localhost:3000/api/projetos/7