<?php
header("Content-Type: application/json");
require_once '../config/Database.php';

$email = $_GET['email'] ?? '';

try {
    $db = (new Database())->getConnection();
    $stmt = $db->prepare("SELECT id FROM utilisateurs WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        echo json_encode(["success" => true, "id" => $user['id']]);
    } else {
        // Si l'utilisateur n'existe pas encore en BDD (mais existe en local)
        // On peut choisir de le créer ici dynamiquement pour dépanner l'ECF
        echo json_encode(["success" => false, "message" => "Non trouvé"]);
    }
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
