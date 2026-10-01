// api-node/server.js - a API do Portfolio em Node (Aula 21)
const express = require('express');
const cors = require('cors');
const pool = require('./db');
const app = express();
const PORTA = 3000;
app.use(cors());

app.get('/', (req, res) => {
  res.send('API do Portfolio em Node: no ar');
});

// O mesmo SELECT do api/projetos.php: só os publicados, do mais novo ao mais
app.get('/api/projetos', async (req, res) => {
    try {
        const sql = "SELECT id, nome, descricao, tecnologias, link_github, ano FROM projetos";
        const [projetos] = await pool.query(sql);
        res.json(projetos);
    } catch (erro) {
        res.status(500).json({ erro: 'Falha no servidor: ' + erro.message });
    }
});

// O catalogo, com o SELECT do api/tecnologias.php.
app.get('/api/tecnologias', async (req, res) => {
    try {
        const sql = "SELECT id, nome, categoria, descricao, ano_criacao FROM tecnologias";
        const [tecnologias] = await pool.query(sql);
        res.json(tecnologias);
    } catch (erro) {
        res.status(500).json({ erro: 'Falha no servidor: ' + erro.message });
    }
});

app.listen(PORTA, '0.0.0.0', () => {
    console.log('API no ar em http://localhost:' + PORTA);
});