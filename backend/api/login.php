<?php
header("Content-Type: application/json");

require_once "../config/Database.php";

$data = json_decode(file_get_contents("php://input"), true);

$email = $data["email"] ?? null;
$password = $data["password"] ?? null;

if (!$email || !$password) {
    echo json_encode(["success" => false, "message" => "Données manquantes"]);
    exit;
}

$database = new Database();
$pdo = $database->getConnection();

$stmt = $pdo->prepare("SELECT id, email, mot_de_passe, role FROM utilisateurs WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user || $user["mot_de_passe"] !== $password) {
    echo json_encode(["success" => false, "message" => "Identifiants incorrects"]);
    exit;
}

echo json_encode([
    "success" => true,
    "user" => [
        "id" => $user["id"],
        "email" => $user["email"],
        "role" => $user["role"]
    ]
]);
