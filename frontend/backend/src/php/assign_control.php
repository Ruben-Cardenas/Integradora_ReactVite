<?php
include 'db.php';

$data = json_decode(file_get_contents("php://input"));

$id_residencia = $data->id_residencia;
$control = $data->control;
$pin = $data->pin;
$topic = $data->topic;

$sql = "INSERT INTO controles (id_residencia, control, pin, topic)
        VALUES ($id_residencia, '$control', '$pin', '$topic')";

if ($conn->query($sql) === TRUE) {
  echo json_encode(["success" => true]);
} else {
  echo json_encode(["success" => false, "error" => $conn->error]);
}
?>
