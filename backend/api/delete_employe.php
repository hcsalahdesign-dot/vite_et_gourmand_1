<?php
header("Content-Type: application/json; charset=utf-8");
require_once '../config/Database.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id'])) {
    echo json_encode(["success" => false, "message" => "ID manquant"]);
    exit;
}

try {
    $db = (new Database())->getConnection();
    $stmt = $db->prepare("DELETE FROM utilisateurs WHERE id = ? AND role = 'employe'");
    $stmt->execute([$data['id']]);

    echo json_encode(["success" => true]);

} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}