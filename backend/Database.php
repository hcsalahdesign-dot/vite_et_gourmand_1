<?php
class Database {
    // On utilise l'IP que le docker inspect vient de nous donner
    private $host = "host.docker.internal";
    private $db_name = "vite_et_gourmand";
    private $username = "root";
    private $password = "root";
    public $conn;

    public function getConnection() {
        $this->conn = null;
        try {
            // On force la connexion sur l'IP
            $this->conn = new PDO("mysql:host=" . $this->host . ";port=3306;dbname=" . $this->db_name, $this->username, $this->password);
            $this->conn->exec("set names utf8");
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch(PDOException $exception) {
            header("Content-Type: application/json");
            echo json_encode(["success" => false, "message" => "Erreur de connexion : " . $exception->getMessage()]);
            exit;
        }
        return $this->conn;
    }
}