<?php
header("Content-Type: application/json");
require_once '../Database.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["success" => false, "message" => "Données invalides"]);
    exit;
}

try {
    $db = (new Database())->getConnection();
    $db->beginTransaction();

    // 1. Insertion dans la table orders
    $stmt = $db->prepare("INSERT INTO orders (user_id, total_price, status) VALUES (?, ?, 'en_attente')");
    $stmt->execute([$data['user_id'], $data['total']]);
    $orderId = $db->lastInsertId();

    // 2. Insertion des articles dans order_items
    $stmtItem = $db->prepare("INSERT INTO order_items (order_id, menu_id, quantity, price) VALUES (?, ?, ?, ?)");
    
    foreach ($data['items'] as $item) {
        // Note : assure-toi que $item['id'] correspond bien à l'ID de ta table menus
        $stmtItem->execute([$orderId, $item['id'], $item['quantite'], $item['prix']]);
    }

    $db->commit();
    echo json_encode(["success" => true, "order_id" => $orderId]);

} catch (Exception $e) {
    if (isset($db)) $db->rollBack();
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}