<?php
header("Content-Type: application/json");
require_once "../config/Database.php";

try {
    $db = (new Database())->getConnection();

    $stmt = $db->prepare("
        SELECT 
            id AS order_id,
            user_id,
            total,
            statut,
            created_at
        FROM orders
        WHERE statut = 'En préparation'
        ORDER BY created_at ASC
    ");

    $stmt->execute();
    $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "orders" => $orders
    ]);

} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}

