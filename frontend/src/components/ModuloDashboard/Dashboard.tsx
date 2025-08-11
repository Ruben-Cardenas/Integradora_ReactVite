// src/components/ModuloDashboard/Dashboard.tsx

import '../Css/Dashboard.css';
import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Modal } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import axios from 'axios';

interface Registro {
  nombre: string;
  tipo: string;
  hora: string;
}

interface SensorData {
  temperatura_ambiente: number;
  temperatura_suelo: number;
  fecha: string;
}

const Dashboard: React.FC = () => {
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [sensores, setSensores] = useState<SensorData[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState<{ area: string; valor: string; img: string } | null>(null);

  const fetchRegistros = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/residentes-entrada');
      setRegistros(res.data);
    } catch (error) {
      console.error('Error al obtener registros:', error);
    }
  };

  const fetchSensores = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/sensores');
      setSensores(res.data);
    } catch (error) {
      console.error('Error al obtener sensores:', error);
    }
  };

  useEffect(() => {
    fetchRegistros();
    fetchSensores();
  }, []);

  const areas = [
    { area: 'Parque infantil', img: '/src/assets/parque-infantil.jpg' },
    { area: 'Zona de picknick', img: '/src/assets/zona-picknick.jpg' },
    { area: 'Campo Deportivo', img: '/src/assets/campo-deportivo.jpg' },
    { area: 'Áreas Verdes', img: '/src/assets/areas-verdes.jpg' },
  ];

  const humedad = sensores.slice(0, 4).map((sensor, i) => ({
    area: areas[i]?.area || `Área ${i + 1}`,
    valor: `${Math.round(sensor.temperatura_suelo)}%`,
    img: areas[i]?.img || '',
  }));

  const temperatura = sensores.slice(0, 4).map((sensor, i) => ({
    area: areas[i]?.area || `Área ${i + 1}`,
    valor: `${Math.round(sensor.temperatura_ambiente)}°C`,
    img: areas[i]?.img || '',
  }));

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-grid">
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
                  <a onClick={() => { setModalContent(record); setModalVisible(true); }} style={{ cursor: 'pointer' }}>
                    {text}
                  </a>
                ),
              },
              { title: 'Porcentaje', dataIndex: 'valor', key: 'valor' },
            ]}
            rowKey="area"
          />
        </Card>

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
                  <a onClick={() => { setModalContent(record); setModalVisible(true); }} style={{ cursor: 'pointer' }}>
                    {text}
                  </a>
                ),
              },
              { title: 'Temperatura', dataIndex: 'valor', key: 'valor' },
            ]}
            rowKey="area"
          />
        </Card>

        <Card
          title="Entradas y Salidas de Residentes"
          className="dashboard-card full-width"
          extra={
            <div className="filter-buttons">
              <Button size="small" onClick={fetchRegistros}>Hoy</Button>
              <Button size="small" onClick={fetchRegistros}>Semana</Button>
              <Button size="small" onClick={fetchRegistros}>Mes</Button>
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
                  <span><ClockCircleOutlined /> {hora}</span>
                ),
              },
            ]}
            rowKey={(record) => record.nombre + record.tipo + record.hora}
          />
        </Card>
      </div>

      <Modal open={modalVisible} footer={null} onCancel={() => setModalVisible(false)} centered>
        {modalContent && (
          <div style={{ textAlign: 'center' }}>
            <img
              src={modalContent.img}
              alt={modalContent.area}
              style={{ width: '100%', maxHeight: 300, objectFit: 'cover', borderRadius: 8 }}
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
