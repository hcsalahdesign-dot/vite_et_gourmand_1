<?php
header("Content-Type: application/json; charset=utf-8");
require_once '../config/Database.php';

try {
    $db = (new Database())->getConnection();
    $stmt = $db->query("
        SELECT o.id, o.date_commande, o.statut, o.total,
               u.nom as client_nom,
               e.nom as employe_nom
        FROM orders o
        JOIN utilisateurs u ON o.user_id = u.id
        LEFT JOIN utilisateurs e ON o.employee_id = e.id
        WHERE o.statut = 'En préparation'
        ORDER BY o.date_commande DESC
    ");

    $commandes = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(["success" => true, "commandes" => $commandes]);

} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}