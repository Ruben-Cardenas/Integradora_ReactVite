import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Col, Row, Button, notification } from "antd";
import "../Css/Irrigation.css";

interface SensorApiData {
  _id: string;
  temperatura_ambiente: number;
  temperatura_suelo: number;
  fecha: string;
}

interface ZonaData {
  area: string;
  humedad: string;       // porcentaje como string con %
  temperatura: string;   // temperatura con °C
  imagen: string;
}

const areas = [
  { area: "Parque infantil", img: "/src/assets/parque-infantil.jpg" },
  { area: "Zona de picknick", img: "/src/assets/zona-picknick.jpg" },
  { area: "Campo Deportivo", img: "/src/assets/campo-deportivo.jpg" },
  { area: "Áreas Verdes", img: "/src/assets/areas-verdes.jpg" },
];

// Extraer número de string como "54%" o "24°C"
const extraerNumero = (valor: string): number => {
  const resultado = valor.match(/[\d.]+/);
  return resultado ? parseFloat(resultado[0]) : NaN;
};

const Irrigation: React.FC = () => {
  const [zonas, setZonas] = useState<ZonaData[]>([]);

  useEffect(() => {
    const fetchSensores = async () => {
      try {
        const res = await axios.get<SensorApiData[]>(
          "http://localhost:3001/api/sensores"
        );
        const sensores4 = res.data.slice(0, 4); // Los primeros 4 sensores

        const zonasData = sensores4.map((sensor, i) => ({
          area: areas[i]?.area || `Área ${i + 1}`,
          humedad: `${Math.round(sensor.temperatura_suelo)}%`,
          temperatura: `${Math.round(sensor.temperatura_ambiente)}°C`,
          imagen: areas[i]?.img || "",
        }));

        setZonas(zonasData);

        zonasData.forEach((zona) => {
          const humedadNum = extraerNumero(zona.humedad);
          const temperaturaNum = extraerNumero(zona.temperatura);

          if (humedadNum < 46 || temperaturaNum > 27) {
            notification.warning({
              message: "Alerta de zona crítica",
              description: `La zona "${zona.area}" tiene ${
                humedadNum < 46
                  ? `humedad baja (${zona.humedad})`
                  : `temperatura alta (${zona.temperatura})`
              }.`,
              placement: "topRight",
              duration: 5,
            });
          }
        });
      } catch (error) {
        console.error("Error al cargar datos de sensores:", error);
      }
    };

    fetchSensores();
  }, []);

  return (
    <div className="irrigation-wrapper">
      <Row gutter={[24, 24]} justify="center">
        {zonas.map((zona, index) => (
          <Col xs={24} sm={12} md={10} lg={8} key={index}>
            <Card
              headStyle={{ backgroundColor: "#0070f3", padding: "12px 16px" }}
              className="irrigation-card"
              title={
                <div
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    fontSize: 18,
                    textAlign: "center",
                  }}
                >
                  {zona.area}
                </div>
              }
              cover={
                <img
                  alt={zona.area}
                  src={zona.imagen}
                  className="zona-img"
                />
              }
            >
              <p>
                <strong>Humedad:</strong> {zona.humedad}
              </p>
              <p>
                <strong>Temperatura:</strong> {zona.temperatura}
              </p>
              <Button type="primary" className="btn-riego">
                Activar
              </Button>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Irrigation;
