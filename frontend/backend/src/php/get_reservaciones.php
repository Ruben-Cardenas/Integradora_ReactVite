<?php
include 'db.php';

$sql = "SELECT id, residente, fecha, status FROM reservaciones ORDER BY fecha ASC";
$result = $conn->query($sql);

$reservas = [];

while ($row = $result->fetch_assoc()) {
  $reservas[] = $row;
}

echo json_encode($reservas);
?>
