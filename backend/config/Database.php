<?php
class Database {

    private $host = "v_et_g_db";
    private $db_name = "vite_et_gourmand";
    private $username = "root";
    private $password = "h!&mHY@_300";
    public $conn;

    public function getConnection() {
        $this->conn = null;

        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";port=3306;dbname=" . $this->db_name,
                $this->username,
                $this->password
            );

            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->exec("set names utf8");

        } catch(PDOException $exception) {
            header("Content-Type: application/json");
            echo json_encode([
                "success" => false,
                "message" => "Erreur de connexion : " . $exception->getMessage()
            ]);
            exit;
        }

        return $this->conn;
    }
}