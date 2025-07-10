<?php
$host = "localhost";
$user = "root";
$password = "";
$db = "u890664939_evohome";

$conn = new mysqli($host, $user, $password, $db);

if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
} else {
    echo "Conexión exitosa!";
}
?>
