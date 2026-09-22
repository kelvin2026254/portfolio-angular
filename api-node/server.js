// api-node/server.js - a API do Portfolio em Node (Aula 21)
const express = require('express');
const cors = require('cors');

const app = express();
const PORTA = 3000;
app.use(cors());
// O mesmo contrato do api/projetos.php: a lista de projetos publicados.
// Por enquanto a lista mora aqui; na Aula 22 ela vem do MariaDB.
const projetos = [
  {
    id: 1,
    nome: 'Portfolio Angular',
    descricao: 'Meu portfolio com Angular e Angular Material.',
    tecnologias: 'Angular, TypeScript',
    link_github: 'https://github.com/kelvin2026254',
    ano: 2026
  },
  {
    id: 2,
    nome: 'API do Portfolio em PHP',
    descricao: 'Endpoints de projetos e catalogo com PDO e MariaDB.',
    tecnologias: 'PHP, MariaDB',
    link_github: null,
    ano: 2026
  },
  {
    id: 3,
    nome: 'Sistema de Cadastro v1',
    descricao: 'CRUD em PHP do 1o trimestre.',
    tecnologias: 'PHP, MariaDB, Bootstrap',
    link_github: null,
    ano: 2026
  }
];

app.get('/', (req, res) => {
  res.send('API do Portfolio em Node: no ar');
});

app.get('/api/projeto', (req, res) => {
  res.json(projetos);
});

app.listen(PORTA, () => {
  console.log('API no ar em http://localhost:' + PORTA);
  
});

app.get('/api/projetos', (req, res) => {
  res.json(projetos);
});