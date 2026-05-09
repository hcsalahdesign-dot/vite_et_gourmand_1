<?php
header("Content-Type: application/json");
require_once "../config/Database.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data["order_id"], $data["employee_id"])) {
    echo json_encode([
        "success" => false,
        "message" => "Données invalides"
    ]);
    exit;
}

try {
    $db = (new Database())->getConnection();

    //  1. Vérifier que la commande est toujours libre
    $check = $db->prepare("
        SELECT employee_id 
        FROM orders 
        WHERE id = ?
    ");
    $check->execute([$data["order_id"]]);
    $order = $check->fetch(PDO::FETCH_ASSOC);

    if (!$order) {
        echo json_encode([
            "success" => false,
            "message" => "Commande introuvable"
        ]);
        exit;
    }

    if ($order["employee_id"] !== null) {
        echo json_encode([
            "success" => false,
            "message" => "Commande déjà prise"
        ]);
        exit;
    }

    //  2. Attribution de la commande
    $update = $db->prepare("
        UPDATE orders
        SET employee_id = ?, statut = 'en_preparation'
        WHERE id = ? AND employee_id IS NULL
    ");

    $update->execute([
        $data["employee_id"],
        $data["order_id"]
    ]);

    //  3. Vérifier si update OK
    if ($update->rowCount() === 0) {
        echo json_encode([
            "success" => false,
            "message" => "Commande déjà prise par un autre employé"
        ]);
        exit;
    }

    echo json_encode([
        "success" => true,
        "message" => "Commande attribuée avec succès"
    ]);

} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}