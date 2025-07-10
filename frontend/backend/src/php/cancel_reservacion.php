<?php
include 'db.php';

$data = json_decode(file_get_contents("php://input"));
$id = $data->id;

$sql = "UPDATE reservaciones SET status = 'cancelada' WHERE id = $id";

if ($conn->query($sql) === TRUE) {
  echo json_encode(["success" => true]);
} else {
  echo json_encode(["success" => false, "error" => $conn->error]);
}
?>
