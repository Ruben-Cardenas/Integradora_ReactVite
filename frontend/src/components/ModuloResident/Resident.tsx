import { useState } from 'react';
import { Card, Input, Button, Table, Select, Row, Col } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import '../Css/Resident.css';

const { Option } = Select;

export default function Resident() {
  const [registros] = useState([
    {
      nombre: 'Camila García Torres',
      casa: '#129',
      telefono: '6182248877',
      fecha: '22/06/2025',
      hora: '15:00',
      tipo: 'Entrada',
    },
    {
      nombre: 'Juan Pérez Díaz',
      casa: '#128',
      telefono: '6182249955',
      fecha: '21/06/2025',
      hora: '09:15',
      tipo: 'Salida',
    },
    {
      nombre: 'María López Ramírez',
      casa: '#127',
      telefono: '6182243569',
      fecha: '20/06/2025',
      hora: '20:45',
      tipo: 'Entrada',
    },
  ]);

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-grid">
        <Card title="Registro de entradas y salidas" className="dashboard-card full-width">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}><Input placeholder="Nombre del residente" /></Col>
            <Col xs={24} sm={12} md={6}><Input placeholder="Teléfono" /></Col>
            <Col xs={24} sm={12} md={6}><Input placeholder="Número de casa" /></Col>
            <Col xs={24} sm={12} md={6}>
              <Select placeholder="Tipo de acceso" style={{ width: '100%' }}>
                <Option value="Entrada">Entrada</Option>
                <Option value="Salida">Salida</Option>
              </Select>
            </Col>
            <Col span={24}><Button type="primary" block>Registrar Acceso</Button></Col>
          </Row>
        </Card>

        <Card title="Entradas y salidas registradas" className="dashboard-card full-width">
          <div className="search-bar">
            <Input placeholder="Buscar" prefix={<SearchOutlined />} />
            <Button type="primary">Filtrar</Button>
            <Button>Historial</Button>
          </div>

          <Table
            size="small"
            pagination={false}
            dataSource={registros}
            columns={[
              { title: 'Nombre', dataIndex: 'nombre', key: 'nombre' },
              { title: 'Casa', dataIndex: 'casa', key: 'casa' },
              { title: 'Teléfono', dataIndex: 'telefono', key: 'telefono' },
              { title: 'Fecha', dataIndex: 'fecha', key: 'fecha' },
              { title: 'Hora', dataIndex: 'hora', key: 'hora' },
              { title: 'Tipo', dataIndex: 'tipo', key: 'tipo' },
            ]}
            rowKey="nombre"
          />
        </Card>
      </div>
    </div>
  );
}
