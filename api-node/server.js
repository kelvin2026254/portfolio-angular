const express = require('express');
const cors = require('cors');
const pool = require('./db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORTA = 3000;
const SEGREDO = process.env.JWT_SECRET;

if (!SEGREDO) {
    throw new Error('Configure a variável de ambiente JWT_SECRET.');
}

app.use(cors());
app.use(express.json());

function autenticar(req, res, next) {
    const cabecalho = req.headers.authorization ?? '';
    const partes = cabecalho.split(' ');
    const token = partes[0] === 'Bearer' ? partes[1] : null;

    if (!token) {
        return res.status(401).json({ erro: 'Token ausente' });
    }

    try {
        req.usuario = jwt.verify(token, SEGREDO);
        next();
    } catch (erro) {
        return res.status(401).json({
            erro: 'Token inválido ou expirado'
        });
    }
}

app.get('/', (req, res) => {
    res.send('API do Portfolio em Node: no ar');
});

// Lista os projetos publicamente
app.get('/api/projetos', async (req, res) => {
    try {
        const sql = `
            SELECT id, nome, descricao, tecnologias, link_github, ano
            FROM projetos
        `;
        const [projetos] = await pool.query(sql);
        res.json(projetos);
    } catch (erro) {
        console.error('Erro ao listar projetos:', erro);
        res.status(500).json({ erro: 'Falha ao listar projetos.' });
    }
});

// Busca um projeto pelo ID
app.get('/api/projetos/:id', async (req, res) => {
    try {
        const sql = `
            SELECT id, nome, descricao, tecnologias, link_github, ano
            FROM projetos
            WHERE id = ?
        `;
        const [projetos] = await pool.execute(sql, [req.params.id]);

        if (projetos.length === 0) {
            return res.status(404).json({ erro: 'Projeto não encontrado.' });
        }

        res.json(projetos[0]);
    } catch (erro) {
        console.error('Erro ao buscar projeto:', erro);
        res.status(500).json({ erro: 'Falha ao buscar projeto.' });
    }
});

// Adiciona projeto: exige autenticação
app.post('/api/projetos', autenticar, async (req, res) => {
    try {
        const dados = req.body;

        if (!dados || typeof dados.nome !== 'string' || !dados.nome.trim()) {
            return res.status(400).json({
                erro: 'Informe pelo menos o nome do projeto.'
            });
        }

        const sql = `
            INSERT INTO projetos
            (nome, descricao, tecnologias, link_github, ano)
            VALUES (?, ?, ?, ?, ?)
        `;

        const [resultado] = await pool.execute(sql, [
            dados.nome.trim(),
            dados.descricao ?? '',
            dados.tecnologias ?? '',
            dados.link_github ?? '',
            dados.ano ?? new Date().getFullYear()
        ]);

        res.status(201).json({ id: resultado.insertId });
    } catch (erro) {
        console.error('Erro ao criar projeto:', erro);
        res.status(500).json({ erro: 'Falha ao criar projeto.' });
    }
});

// Edita projeto: exige autenticação
app.put('/api/projetos/:id', autenticar, async (req, res) => {
    try {
        const dados = req.body;

        if (!dados || typeof dados.nome !== 'string' || !dados.nome.trim()) {
            return res.status(400).json({
                erro: 'Informe pelo menos o nome do projeto.'
            });
        }

        const sql = `
            UPDATE projetos
            SET nome = ?, descricao = ?, tecnologias = ?, link_github = ?, ano = ?
            WHERE id = ?
        `;

        const [resultado] = await pool.execute(sql, [
            dados.nome.trim(),
            dados.descricao ?? '',
            dados.tecnologias ?? '',
            dados.link_github ?? '',
            dados.ano ?? new Date().getFullYear(),
            req.params.id
        ]);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ erro: 'Projeto não encontrado.' });
        }

        res.json({ mensagem: 'Projeto atualizado.' });
    } catch (erro) {
        console.error('Erro ao atualizar projeto:', erro);
        res.status(500).json({ erro: 'Falha ao atualizar projeto.' });
    }
});

// Exclui projeto: exige autenticação
app.delete('/api/projetos/:id', autenticar, async (req, res) => {
    try {
        const [resultado] = await pool.execute(
            'DELETE FROM projetos WHERE id = ?',
            [req.params.id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ erro: 'Projeto não encontrado.' });
        }

        res.status(204).end();
    } catch (erro) {
        console.error('Erro ao excluir projeto:', erro);
        res.status(500).json({ erro: 'Falha ao excluir projeto.' });
    }
});

// Lista tecnologias publicamente
app.get('/api/tecnologias', async (req, res) => {
    try {
        const sql = `
            SELECT id, nome, categoria, descricao, ano_criacao
            FROM tecnologias
        `;
        const [tecnologias] = await pool.query(sql);
        res.json(tecnologias);
    } catch (erro) {
        console.error('Erro ao listar tecnologias:', erro);
        res.status(500).json({ erro: 'Falha ao listar tecnologias.' });
    }
});

// Login: não exige token
app.post('/api/login', async (req, res) => {
    try {
        const dados = req.body;

        if (
            typeof dados?.email !== 'string' ||
            typeof dados?.senha !== 'string' ||
            !dados.email.trim() ||
            !dados.senha
        ) {
            return res.status(400).json({
                erro: 'Informe email e senha.'
            });
        }

        const [linhas] = await pool.execute(
            'SELECT id, email, senha_hash FROM usuarios WHERE email = ?',
            [dados.email.trim()]
        );

        const usuario = linhas[0];

        if (!usuario) {
            return res.status(401).json({
                erro: 'Email ou senha inválidos.'
            });
        }

        const confere = await bcrypt.compare(
            dados.senha,
            usuario.senha_hash
        );

        if (!confere) {
            return res.status(401).json({
                erro: 'Email ou senha inválidos.'
            });
        }

        const token = jwt.sign(
            { id: usuario.id, email: usuario.email },
            SEGREDO,
            { expiresIn: '2h' }
        );

        res.json({
            token,
            usuario: {
                id: usuario.id,
                email: usuario.email
            }
        });
    } catch (erro) {
        console.error('Erro no login:', erro);
        res.status(500).json({ erro: 'Falha ao realizar login.' });
    }
});

app.listen(PORTA, '0.0.0.0', () => {
    console.log(`API no ar na porta ${PORTA}`);
});