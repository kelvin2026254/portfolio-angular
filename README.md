# portfolio-angular

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