<?php
include 'db.php';

$data = json_decode(file_get_contents("php://input"));

$username = $data->username;
$password = password_hash($data->password, PASSWORD_BCRYPT);
$residente_id = $data->residente_id;
$fecha = date("Y-m-d");

$sql = "INSERT INTO usuarios (username, password, residente, status, fecha_creacion) 
        VALUES ('$username', '$password', $residente_id, 'activo', '$fecha')";

if ($conn->query($sql) === TRUE) {
  echo json_encode(["success" => true]);
} else {
  echo json_encode(["success" => false, "error" => $conn->error]);
}
?>
