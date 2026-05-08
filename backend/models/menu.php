<?php
// backend/Models/Menu.php

class Menu {
    private $conn;
    private $table_name = "menus"; // Vérifie que c'est le nom dans ton init.sql

    public function __construct($db) {
        $this->conn = $db;
    }

    // Fonction pour lire tous les menus
    public function read() {
        $query = "SELECT id, titre, description, prix, image_url FROM " . $this->table_name;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }
}