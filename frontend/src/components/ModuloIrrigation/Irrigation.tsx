// src/components/ModuloIrrigation/Irrigation.tsx
import React from "react";
import { Card, Col, Row, Button } from "antd";
import "../Css/Irrigation.css";

const zonas = [
  {
    nombre: "Áreas verdes",
    humedad: "45%",
    temperatura: "27°C",
    imagen: "/img/areas-verdes.jpg",
  },
  {
    nombre: "Áreas deportivas",
    humedad: "50%",
    temperatura: "26°C",
    imagen: "/img/areas-deportivas.jpg",
  },
  {
    nombre: "Jardines infantiles",
    humedad: "47%",
    temperatura: "28°C",
    imagen: "/img/jardines-infantiles.jpg",
  },
  {
    nombre: "Área de Picnic",
    humedad: "47%",
    temperatura: "28°C",
    imagen: "/img/jardines-infantiles.jpg",
  },
];

const Irrigation: React.FC = () => {
  return (
    <div className="irrigation-wrapper">
      <h1 className="title">Sistema de Riego</h1>
      <Row gutter={[24, 24]} justify="center">
        {zonas.map((zona, index) => (
          <Col xs={24} sm={12} md={10} lg={8} key={index}>
            <Card
              title={zona.nombre}
              cover={<img alt={zona.nombre} src={zona.imagen} className="zona-img" />}
              className="irrigation-card"
            >
              <p><strong>Humedad:</strong> {zona.humedad}</p>
              <p><strong>Temperatura:</strong> {zona.temperatura}</p>
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
