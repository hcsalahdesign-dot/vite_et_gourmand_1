<?php
header("Content-Type: application/json; charset=utf-8");
require_once '../config/Database.php';

try {
    $db = (new Database())->getConnection();
    $stmt = $db->query("
        SELECT o.id, o.date_commande, o.statut, o.total,
               u.nom as client_nom, u.email as client_email
        FROM orders o
        JOIN utilisateurs u ON o.user_id = u.id
        WHERE o.statut = 'Livré'
        ORDER BY o.date_commande DESC
    ");

    $commandes = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(["success" => true, "commandes" => $commandes]);

} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}