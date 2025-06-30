<?php
require_once 'db.php';

class ReservacionController {
    private $conn;

    public function __construct() {
        global $conn;  // Usar la conexión global
        $this->conn = $conn;
    }

    public function getReservaciones() {
        $sql = "SELECT * FROM reservaciones";
        $result = $this->conn->query($sql);

        $reservaciones = [];
        if ($result) {
            while ($row = $result->fetch_assoc()) {
                $reservaciones[] = $row;
            }
        }
        header('Content-Type: application/json');
        echo json_encode($reservaciones);
    }

    public function addReservacion($data) {
        $residente = $this->conn->real_escape_string($data['residente']);
        $fecha = $this->conn->real_escape_string($data['fecha']);
        $status = $this->conn->real_escape_string($data['status']);

        $sql = "INSERT INTO reservaciones (residente, fecha, status) VALUES ('$residente', '$fecha', '$status')";

        if ($this->conn->query($sql) === TRUE) {
            http_response_code(201);
            echo json_encode(['message' => 'Reservación creada']);
        } else {
            http_response_code(500);
            echo json_encode(['message' => 'Error al crear reservación']);
        }
    }
}
?>
