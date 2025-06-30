// src/components/ModuloDashboard/Dashboard.tsx
import '../Css/Dashboard.css';
// src/components/ModuloDashboard/Dashboard.tsx
import React from 'react';
import { Table, Button, Input, Card } from 'antd';
import { ClockCircleOutlined, SearchOutlined } from '@ant-design/icons';


const Dashboard: React.FC = () => {
  // Simulación de datos para mostrar
  const entradas = [
    { nombre: 'Juan Palcio Gutierrez', hora: '13:00 pm' },
    { nombre: 'Roberto Martinez Nuñez', hora: '15:00 pm' },
    { nombre: 'Jose Maria Perez Quiñones', hora: '22:00 pm' },
    { nombre: 'Bernardo Gomez Hernandez', hora: '19:00 pm' },
  ];

  const salidas = [
    { nombre: 'Juan Palcio Gutierrez', hora: '5:00 am' },
    { nombre: 'Roberto Martinez Nuñez', hora: '6:00 am' },
    { nombre: 'Jose Maria Perez Quiñones', hora: '7:00 am' },
    { nombre: 'Bernardo Gomez Hernandez', hora: '9:00 am' },
  ];

  const humedad = [
    { area: 'Parque infantil', valor: '20%' },
    { area: 'Zona de picknick', valor: '77%' },
    { area: 'Campo Deportivo', valor: '99%' },
    { area: 'Áreas Verdes', valor: '79%' },
  ];

  const temperatura = [
    { area: 'Parque infantil', valor: '20°C' },
    { area: 'Juegos Infantiles', valor: '10°C' },
    { area: 'Campo Deportivo', valor: '18°C' },
    { area: 'Áreas Verdes', valor: '27°C' },
  ];

  const filtraciones = [
    { casa: '#129', nombre: 'Juan', apellidos: 'Palcio Gutierrez', correo: 'PalcioGutierrez@email.com', telefono: '6182123344' },
    { casa: '#128', nombre: 'Roberto', apellidos: 'Martinez Nuñez', correo: 'MartinezNuñez@email.com', telefono: '6182123455' },
    { casa: '#127', nombre: 'Jose Maria', apellidos: 'Perez Quiñones', correo: 'PerezQuiñones@email.com', telefono: '6182123566' },
    { casa: '#126', nombre: 'Bernardo', apellidos: 'Gomez Hernandez', correo: 'GomezHernandez@email.com', telefono: '6182123677' },
  ];

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-grid">
        <Card title="Entradas de Residentes" className="dashboard-card" extra={
          <div className="filter-buttons">
            <Button size="small">Hoy</Button>
            <Button size="small">Semana</Button>
            <Button size="small">Mes</Button>
          </div>
        }>
          <Table
            size="small"
            pagination={false}
            dataSource={entradas}
            columns={[
              { title: 'Nombre del residente', dataIndex: 'nombre', key: 'nombre' },
              {
                title: 'Hora de entrada',
                dataIndex: 'hora',
                key: 'hora',
                render: hora => <span><ClockCircleOutlined /> {hora}</span>
              },
            ]}
            rowKey="nombre"
          />
        </Card>

        <Card title="Salida de Residentes" className="dashboard-card" extra={
          <div className="filter-buttons">
            <Button size="small">Hoy</Button>
            <Button size="small">Semana</Button>
            <Button size="small">Mes</Button>
          </div>
        }>
          <Table
            size="small"
            pagination={false}
            dataSource={salidas}
            columns={[
              { title: 'Nombre del residente', dataIndex: 'nombre', key: 'nombre' },
              {
                title: 'Hora de salida',
                dataIndex: 'hora',
                key: 'hora',
                render: hora => <span><ClockCircleOutlined /> {hora}</span>
              },
            ]}
            rowKey="nombre"
          />
        </Card>

        <Card title="Humedad" className="dashboard-card">
          <Table
            size="small"
            pagination={false}
            dataSource={humedad}
            columns={[
              { title: 'Área', dataIndex: 'area', key: 'area' },
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
              { title: 'Área', dataIndex: 'area', key: 'area' },
              { title: 'Temperatura', dataIndex: 'valor', key: 'valor' },
            ]}
            rowKey="area"
          />
        </Card>

        <div className="search-bar">
          <Input placeholder="Buscar" prefix={<SearchOutlined />} />
          <Button type="primary">Filtrar</Button>
        </div>

        <Card title="Filtraciones de Residente" className="dashboard-card full-width">
          <Table
            size="small"
            pagination={false}
            dataSource={filtraciones}
            columns={[
              { title: 'Número de casa', dataIndex: 'casa', key: 'casa' },
              { title: 'Nombre', dataIndex: 'nombre', key: 'nombre' },
              { title: 'Apellidos', dataIndex: 'apellidos', key: 'apellidos' },
              { title: 'Correo', dataIndex: 'correo', key: 'correo' },
              { title: 'Teléfono', dataIndex: 'telefono', key: 'telefono' },
            ]}
            rowKey="casa"
          />
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
