<?php
header("Content-Type: application/json");
require_once "../config/Database.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data["order_id"])) {
    echo json_encode(["success" => false, "message" => "Données invalides"]);
    exit;
}

try {
    $db = (new Database())->getConnection();

    $stmt = $db->prepare("
        UPDATE orders 
        SET statut = 'Livrée' 
        WHERE id = ?
    ");
    $stmt->execute([$data["order_id"]]);

    echo json_encode(["success" => true]);

} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}