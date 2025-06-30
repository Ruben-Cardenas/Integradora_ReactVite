import { useState } from "react";
import { Table, Button, Card, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import "../Css/Reservacion.css";

const { Title } = Typography;

type Reservacion = {
  residente: string;
  fecha: string;
  espacio: string;
  estado: "reservada" | "cancelada";
};

export default function Reservaciones() {
  const [reservaciones, setReservaciones] = useState<Reservacion[]>([
    {
      residente: "Carlos Gómez",
      fecha: "2025-06-30",
      espacio: "Área de asadores",
      estado: "reservada",
    },
    {
      residente: "Luisa Martínez",
      fecha: "2025-07-01",
      espacio: "Cancha de fútbol",
      estado: "reservada",
    },
    {
      residente: "Ana Torres",
      fecha: "2025-07-02",
      espacio: "Salón de eventos",
      estado: "reservada",
    },
  ]);

  const cancelarReservacion = (index: number) => {
    setReservaciones((prev) =>
      prev.map((res, i) =>
        i === index ? { ...res, estado: "cancelada" } : res
      )
    );
  };

  const columns: ColumnsType<Reservacion> = [
    {
      title: "Residente",
      dataIndex: "residente",
      key: "residente",
    },
    {
      title: "Fecha",
      dataIndex: "fecha",
      key: "fecha",
    },
    {
      title: "Espacio reservado",
      dataIndex: "espacio",
      key: "espacio",
    },
    {
      title: "Estado",
      dataIndex: "estado",
      key: "estado",
      render: (estado: Reservacion["estado"]) =>
        estado === "reservada" ? "Reservada" : "Cancelada",
    },
    {
      title: "Acciones",
      key: "acciones",
      render: (_, __, index) => (
        <Button
          danger
          disabled={reservaciones[index].estado === "cancelada"}
          onClick={() => cancelarReservacion(index)}
        >
          {reservaciones[index].estado === "reservada"
            ? "Cancelar"
            : "Cancelada"}
        </Button>
      ),
    },
  ];

  return (
    <div className="reserv-wrapper">
      <Card className="reserv-card">
        <Title level={3} className="reserv-title">
          Lista de Reservaciones
        </Title>
        <Table
          dataSource={reservaciones}
          columns={columns}
          rowKey={(record, index) => (index !== undefined ? index.toString() : record.residente + record.fecha + record.espacio)}
          pagination={false}
        />
      </Card>
    </div>
  );
}
