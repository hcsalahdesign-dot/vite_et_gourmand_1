<?php
header("Content-Type: application/json");
require_once "../config/Database.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode([
        "success" => false,
        "message" => "Données invalides"
    ]);
    exit;
}

try {
    $db = (new Database())->getConnection();
    $db->beginTransaction();

    // 1. Insertion dans orders
    $stmt = $db->prepare("INSERT INTO orders (user_id, total, statut) VALUES (?, ?, 'En préparation')");
    $stmt->execute([$data['user_id'], $data['total']]);
    $orderId = $db->lastInsertId();

    // 2. Insertion dans order_items
    $stmtItem = $db->prepare("INSERT INTO order_items (order_id, menu_id, quantite) VALUES (?, ?, ?)");

    foreach ($data['items'] as $item) {
        $stmtItem->execute([
            $orderId,
            $item['id'],
            $item['quantite']
        ]);
    }

    $db->commit();

    echo json_encode([
        "success" => true,
        "order_id" => $orderId
    ]);

} catch (Exception $e) {
    if (isset($db)) {
        $db->rollBack();
    }

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}
