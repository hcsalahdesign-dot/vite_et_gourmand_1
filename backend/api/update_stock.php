<?php
header("Content-Type: application/json; charset=utf-8");
require_once '../config/Database.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['menu_id']) || !isset($data['stock'])) {
    echo json_encode(["success" => false, "message" => "Données invalides"]);
    exit;
}

try {
    $db = (new Database())->getConnection();
    $stmt = $db->prepare("UPDATE menus SET stock = ? WHERE id = ?");
    $stmt->execute([$data['stock'], $data['menu_id']]);

    echo json_encode(["success" => true]);

} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}