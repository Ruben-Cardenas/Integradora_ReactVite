<?php
require_once 'ReservacionController.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$controller = new ReservacionController();

$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

if ($path === '/api/reservaciones') {
    if ($method === 'GET') {
        $controller->getReservaciones();
    } elseif ($method === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);
        if (!empty($data['residente']) && !empty($data['fecha']) && !empty($data['status'])) {
            $controller->addReservacion($data);
        } else {
            http_response_code(400);
            echo json_encode(['message' => 'Datos incompletos']);
        }
    } else {
        http_response_code(405);
        echo json_encode(['message' => 'Método no permitido']);
    }
} else {
    http_response_code(404);
    echo json_encode(['message' => 'Ruta no encontrada']);
}
