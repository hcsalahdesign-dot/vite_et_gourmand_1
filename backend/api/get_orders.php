<?php
header("Content-Type: application/json");
require_once "../config/Database.php";

try {
    $db = (new Database())->getConnection();

    $stmt = $db->prepare("
        SELECT 
            o.id AS order_id,
            o.user_id,
            o.total,
            o.statut,
            o.created_at,
            o.employee_id,
            u.nom AS client_nom
        FROM orders o
        JOIN utilisateurs u ON o.user_id = u.id
        WHERE o.statut = 'En préparation'
        ORDER BY o.created_at ASC
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