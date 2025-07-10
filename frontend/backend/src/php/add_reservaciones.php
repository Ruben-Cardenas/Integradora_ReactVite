<?php
include 'db.php';

$data = json_decode(file_get_contents("php://input"));

$residente = $data->residente;
$fecha = $data->fecha;

$sql = "INSERT INTO reservaciones (residente, fecha, status)
        VALUES ('$residente', '$fecha', 'reservada')";

if ($conn->query($sql) === TRUE) {
  echo json_encode(["success" => true]);
} else {
  echo json_encode(["success" => false, "error" => $conn->error]);
}
?>
