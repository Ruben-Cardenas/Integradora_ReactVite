<?php
include 'db.php';

$data = json_decode(file_get_contents("php://input"));

$nombre = $data->nombre;
$apellido1 = $data->apellido1;
$apellido2 = $data->apellido2;

$sql = "INSERT INTO residentes (nombre, apellido1, apellido2) 
        VALUES ('$nombre', '$apellido1', '$apellido2')";

if ($conn->query($sql) === TRUE) {
  echo json_encode(["success" => true]);
} else {
  echo json_encode(["success" => false, "error" => $conn->error]);
}
?>
