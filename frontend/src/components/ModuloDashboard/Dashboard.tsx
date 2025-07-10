// src/components/ModuloDashboard/Dashboard.tsx

import '../Css/Dashboard.css';
import React, { useState } from 'react';
import { Table, Button, Card, Modal } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';

const Dashboard: React.FC = () => {
  const registros = [
    { nombre: 'Juan Palcio Gutierrez', tipo: 'Entrada', hora: '13:00 pm' },
    { nombre: 'Juan Palcio Gutierrez', tipo: 'Salida', hora: '5:00 am' },
    { nombre: 'Roberto Martinez Nuñez', tipo: 'Entrada', hora: '15:00 pm' },
    { nombre: 'Roberto Martinez Nuñez', tipo: 'Salida', hora: '6:00 am' },
    { nombre: 'Jose Maria Perez Quiñones', tipo: 'Entrada', hora: '22:00 pm' },
    { nombre: 'Jose Maria Perez Quiñones', tipo: 'Salida', hora: '7:00 am' },
    { nombre: 'Bernardo Gomez Hernandez', tipo: 'Entrada', hora: '19:00 pm' },
    { nombre: 'Bernardo Gomez Hernandez', tipo: 'Salida', hora: '9:00 am' },
  ];

  const humedad = [
    { area: 'Parque infantil', valor: '20%', img: '/images/parque_infantil.jpg' },
    { area: 'Zona de picknick', valor: '77%', img: '/images/zona_picknick.jpg' },
    { area: 'Campo Deportivo', valor: '99%', img: '/images/campo_deportivo.jpg' },
    { area: 'Áreas Verdes', valor: '79%', img: '/images/areas_verdes.jpg' },
  ];

  const temperatura = [
    { area: 'Parque infantil', valor: '20°C', img: '/images/parque_infantil.jpg' },
    { area: 'Juegos Infantiles', valor: '10°C', img: '/images/juegos_infantiles.jpg' },
    { area: 'Campo Deportivo', valor: '18°C', img: '/images/campo_deportivo.jpg' },
    { area: 'Áreas Verdes', valor: '27°C', img: '/images/areas_verdes.jpg' },
  ];

  // Estado para manejar el modal
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState<{ area: string; valor: string; img: string } | null>(null);

  const openModal = (record: { area: string; valor: string; img: string }) => {
    setModalContent(record);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setModalContent(null);
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-grid">
        {/* Humedad */}
        <Card title="Humedad" className="dashboard-card">
          <Table
            size="small"
            pagination={false}
            dataSource={humedad}
            columns={[
              {
                title: 'Área',
                dataIndex: 'area',
                key: 'area',
                render: (text, record) => (
                  <a onClick={() => openModal(record)} style={{ cursor: 'pointer' }}>
                    {text}
                  </a>
                ),
              },
              { title: 'Porcentaje', dataIndex: 'valor', key: 'valor' },
            ]}
            rowKey="area"
          />
        </Card>

        {/* Temperatura */}
        <Card title="Temperatura" className="dashboard-card">
          <Table
            size="small"
            pagination={false}
            dataSource={temperatura}
            columns={[
              {
                title: 'Área',
                dataIndex: 'area',
                key: 'area',
                render: (text, record) => (
                  <a onClick={() => openModal(record)} style={{ cursor: 'pointer' }}>
                    {text}
                  </a>
                ),
              },
              { title: 'Temperatura', dataIndex: 'valor', key: 'valor' },
            ]}
            rowKey="area"
          />
        </Card>

        {/* Entradas/Salidas unificadas */}
        <Card
          title="Entradas y Salidas de Residentes"
          className="dashboard-card full-width"
          extra={
            <div className="filter-buttons">
              <Button size="small">Hoy</Button>
              <Button size="small">Semana</Button>
              <Button size="small">Mes</Button>
            </div>
          }
        >
          <Table
            size="small"
            pagination={false}
            dataSource={registros}
            columns={[
              { title: 'Nombre del residente', dataIndex: 'nombre', key: 'nombre' },
              { title: 'Tipo', dataIndex: 'tipo', key: 'tipo' },
              {
                title: 'Hora',
                dataIndex: 'hora',
                key: 'hora',
                render: (hora) => (
                  <span>
                    <ClockCircleOutlined /> {hora}
                  </span>
                ),
              },
            ]}
            rowKey={(record) => record.nombre + record.tipo + record.hora}
          />
        </Card>
      </div>

      <Modal visible={modalVisible} footer={null} onCancel={closeModal} centered>
        {modalContent && (
          <div style={{ textAlign: 'center' }}>
            <img
              src={modalContent.img}
              alt={modalContent.area}
              style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: 8 }}
            />
            <h3 style={{ marginTop: 16 }}>
              {modalContent.area} - {modalContent.valor}
            </h3>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Dashboard;
