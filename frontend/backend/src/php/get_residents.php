<?php
include 'db.php';

$sql = "SELECT r.id, CONCAT(r.nombre, ' ', r.apellido1, ' ', r.apellido2) AS nombre_completo,
              u.status, s.n_residencia
        FROM residentes r
        LEFT JOIN usuarios u ON u.residente = r.id
        LEFT JOIN residencias s ON s.usuario = u.id";

$result = $conn->query($sql);

$residentes = [];

while ($row = $result->fetch_assoc()) {
  $residentes[] = [
    "id" => $row['id'],
    "name" => $row['nombre_completo'],
    "houseNumber" => '#' . ($row['n_residencia'] ?? 'Sin asignar'),
    "status" => $row['status'] ?? 'Inactivo'
  ];
}

echo json_encode($residentes);
?>
