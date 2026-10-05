<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['erro' => 'Use POST.']);
    exit;
}

$dados = json_decode(file_get_contents('php://input'), true);

$nome = trim($dados['nome'] ?? '');
$email = trim($dados['email'] ?? '');
$mensagem = trim($dados['mensagem'] ?? '');

if ($nome === '' || $email === '' || strlen($mensagem) < 10) {
    http_response_code(400);
    echo json_encode([
        'erros' => ['Preencha todos os campos corretamente.']
    ]);
    exit;
}

try {

    require __DIR__ . '/../conexao.php';

    $stmt = $pdo->prepare(
        'INSERT INTO contatos (nome, email, mensagem)
         VALUES (:nome, :email, :mensagem)'
    );

    $stmt->execute([
        ':nome' => $nome,
        ':email' => $email,
        ':mensagem' => $mensagem
    ]);

    echo json_encode([
        'sucesso' => true,
        'id' => (int) $pdo->lastInsertId(),
        'mensagem' => 'Contato recebido com sucesso!'
    ]);

} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([
        'sucesso' => false,
        'erro' => $e->getMessage()
    ]);
}