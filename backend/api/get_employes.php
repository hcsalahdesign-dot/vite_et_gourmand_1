<?php
header("Content-Type: application/json; charset=utf-8");
require_once '../config/Database.php';

try {
    $db = (new Database())->getConnection();
    $stmt = $db->query("SELECT id, nom, email, role FROM utilisateurs WHERE role = 'employe'");
    $employes = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["success" => true, "employes" => $employes]);

} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}