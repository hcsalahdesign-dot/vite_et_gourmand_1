<?php
header("Content-Type: application/json; charset=utf-8");
require_once '../config/Database.php';

$email = $_GET['email'] ?? '';

try {
    $db = (new Database())->getConnection();

    $stmt = $db->prepare("
        SELECT o.id, o.date_commande, o.statut, o.total,
            oi.nom_menu, oi.quantite
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        JOIN utilisateurs u ON o.user_id = u.id
        WHERE u.email = ?
        ORDER BY o.date_commande DESC
    ");

    $stmt->execute([$email]);
    $commandes = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["success" => true, "commandes" => $commandes]);

} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}