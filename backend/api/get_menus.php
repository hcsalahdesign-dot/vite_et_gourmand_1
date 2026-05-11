<?php
header("Content-Type: application/json; charset=utf-8");
require_once '../config/Database.php';

try {
    $db = (new Database())->getConnection();

    $stmt = $db->query("
        SELECT m.id, m.titre, m.prix, m.description, m.stock,
               c.id as categorie_id, c.nom as categorie_nom
        FROM menus m
        JOIN categories c ON m.categorie_id = c.id
        ORDER BY c.id, m.id
    ");

    $menus = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Grouper par catégorie
    $categories = [];
    foreach ($menus as $menu) {
        $catId = $menu['categorie_id'];
        if (!isset($categories[$catId])) {
            $categories[$catId] = [
                'id' => $catId,
                'nom' => $menu['categorie_nom'],
                'menus' => []
            ];
        }
        $categories[$catId]['menus'][] = [
            'id' => $menu['id'],
            'titre' => $menu['titre'],
            'prix' => $menu['prix'],
            'stock' => $menu['stock']
        ];
    }

    echo json_encode([
        "success" => true,
        "categories" => array_values($categories)
    ]);

} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}