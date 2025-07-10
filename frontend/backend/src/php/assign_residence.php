<?php
include 'db.php';

$data = json_decode(file_get_contents("php://input"));

$usuario_id = $data->usuario_id;
$n_residencia = $data->n_residencia;

$sql = "INSERT INTO residencias (n_residencia, usuario) 
        VALUES ('$n_residencia', $usuario_id)";

if ($conn->query($sql) === TRUE) {
  echo json_encode(["success" => true]);
} else {
  echo json_encode(["success" => false, "error" => $conn->error]);
}
?>
