<?php

class Database {
    private $host;
    private $port;
    private $db_name;
    private $username;
    private $password;
    private $ca_path;
    public $conn;

    public function __construct() {
        $this->host     = getenv('DB_HOST') ?: "v_et_g_db";
        $this->port     = getenv('DB_PORT') ?: "3306";
        $this->username = getenv('DB_USER') ?: "salah_webdev";
        $this->password = getenv('DB_PASSWORD') ?: "h!&mHwY@_316";
        $this->db_name  = getenv('DB_NAME') ?: "vite_et_gourmand";
        $this->ca_path  = getenv('DB_CA_PATH') ?: null;
    }

    public function getConnection() {
        $this->conn = null;

        try {
            $dsn = "mysql:host={$this->host};port={$this->port};dbname={$this->db_name};charset=utf8mb4";

            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            ];

            if ($this->ca_path) {
                $options[PDO::MYSQL_ATTR_SSL_CA] = $this->ca_path;
            }

            $this->conn = new PDO(
                $dsn,
                $this->username,
                $this->password,
                $options
            );

        } catch (PDOException $exception) {
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
