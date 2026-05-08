<?php
require_once '../backend/Database.php';

$database = new Database();
$db = $database->getConnection();

if($db) {
    echo "Bravo ! Le pont entre PHP et MySQL est opérationnel.";
} else {
    echo "Aïe, la connexion a échoué.";
}