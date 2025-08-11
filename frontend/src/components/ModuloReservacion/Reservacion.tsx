import { useState, useEffect } from "react";
import { Table, Button, Card, Typography, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import axios from "axios";
import "../Css/Reservacion.css";

const { Title } = Typography;

type Reservacion = {
  id: number;
  residente: string;
  fecha: string;
  espacio: string;
  estado: "reservada" | "cancelada" | "realizada";
};

export default function Reservaciones() {
  const [reservaciones, setReservaciones] = useState<Reservacion[]>([]);

  useEffect(() => {
    fetchReservaciones();
  }, []);

  const fetchReservaciones = async () => {
    try {
      const response = await axios.get<Reservacion[]>("http://localhost:3001/api/reservaciones");
      setReservaciones(response.data);
    } catch {
      message.error("Error al cargar las reservaciones");
    }
  };

  const cancelarReservacion = async (id: number) => {
    try {
      await axios.put(`http://localhost:3001/api/reservaciones/${id}/cancelar`);
      message.success("Reservación cancelada");
      fetchReservaciones();
    } catch {
      message.error("Error al cancelar la reservación");
    }
  };

  const marcarComoRealizada = async (id: number) => {
    try {
      await axios.put(`http://localhost:3001/api/reservaciones/${id}/realizada`);
      message.success("Reservación marcada como realizada");
      fetchReservaciones();
    } catch {
      message.error("Error al marcar como realizada");
    }
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
      render: (estado: Reservacion["estado"]) => {
        if (estado === "reservada") return "Reservada";
        if (estado === "cancelada") return "Cancelada";
        return "Realizada";
      },
    },
    {
      title: "Acciones",
      key: "acciones",
      render: (_, reservacion) => {
        const hoy = new Date();
        const fechaRes = new Date(reservacion.fecha);
        const puedeMarcarRealizada = reservacion.estado === "reservada" && fechaRes < hoy;

        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <Button
              danger
              disabled={reservacion.estado !== "reservada"}
              onClick={() => cancelarReservacion(reservacion.id)}
            >
              Cancelar
            </Button>

            {puedeMarcarRealizada && (
              <Button
                type="primary"
                onClick={() => marcarComoRealizada(reservacion.id)}
              >
                Marcar como realizada
              </Button>
            )}
          </div>
        );
      },
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
          rowKey="id"
          pagination={false}
        />
      </Card>
    </div>
  );
}
