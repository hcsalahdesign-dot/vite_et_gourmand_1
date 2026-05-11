<?php
header("Content-Type: application/json; charset=utf-8");
require_once '../config/Database.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['nom'], $data['email'], $data['mot_de_passe'], $data['telephone'], $data['numero_contrat'])) {
    echo json_encode(["success" => false, "message" => "Données manquantes"]);
    exit;
}

try {
    $db = (new Database())->getConnection();

    $motDePasseHash = password_hash($data['mot_de_passe'], PASSWORD_DEFAULT);

    $stmt = $db->prepare("
        INSERT INTO utilisateurs (nom, email, mot_de_passe, role, telephone, numero_contrat)
        VALUES (?, ?, ?, 'employe', ?, ?)
    ");

    $stmt->execute([
        $data['nom'],
        $data['email'],
        $motDePasseHash,
        $data['telephone'],
        $data['numero_contrat']
    ]);

    echo json_encode(["success" => true]);

} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}