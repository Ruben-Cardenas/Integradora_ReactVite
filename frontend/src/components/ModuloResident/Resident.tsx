import { useState, useEffect } from 'react';
import { Card, Input, Button, Table, Form, Row, Col, message, Modal } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import '../Css/Resident.css';

interface ResidentData {
  _id?: string;
  nombre: string;
  casa: string;
  telefono: string;
  fecha: string;
  hora: string;
  uid: string;
  tipo: string;
}

export default function Resident() {
  const [residentsEntrada, setResidentsEntrada] = useState<ResidentData[]>([]);
  const [residentsSalida, setResidentsSalida] = useState<ResidentData[]>([]);
  const [search, setSearch] = useState('');
  const [form] = Form.useForm();
  const [formSalida] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalSalidaVisible, setModalSalidaVisible] = useState(false);

  const fetchEntradas = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/residentes-entrada');
      setResidentsEntrada(response.data);
    } catch {
      message.error('Error al obtener entradas');
    }
  };

  const fetchSalidas = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/residentes-salida');
      setResidentsSalida(response.data);
    } catch {
      message.error('Error al obtener salidas');
    }
  };

  const handleRegisterEntrada = async (values: ResidentData) => {
    try {
      await axios.post('http://localhost:3001/api/residentes-entrada', {
        ...values,
        uid: values.uid.toUpperCase(),
        tipo: 'Entrada',
      });
      message.success('✅ Entrada registrada');
      form.resetFields();
      setModalVisible(false);
      fetchEntradas();
    } catch {
      message.error('❌ Error al registrar entrada');
    }
  };

  const handleRegisterSalida = async (values: ResidentData) => {
    try {
      await axios.post('http://localhost:3001/api/residentes-salida', {
        ...values,
        uid: values.uid.toUpperCase(),
        tipo: 'Salida',
      });
      message.success('✅ Salida registrada');
      formSalida.resetFields();
      setModalSalidaVisible(false);
      fetchSalidas();
    } catch {
      message.error('❌ Error al registrar salida');
    }
  };

  const filteredResidents = [...residentsEntrada, ...residentsSalida].filter((item) =>
    item.nombre.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { title: 'Nombre', dataIndex: 'nombre' },
    { title: 'Casa', dataIndex: 'casa' },
    { title: 'Teléfono', dataIndex: 'telefono' },
    { title: 'Fecha', dataIndex: 'fecha' },
    { title: 'Hora', dataIndex: 'hora' },
    { 
      title: 'Tarjeta', 
      dataIndex: 'uid',
      render: (uid: string) => (uid === 'AB3MBB23' ? '' : uid) // Aquí ocultamos el uid específico
    },
    { title: 'Tipo', dataIndex: 'tipo' },
  ];

  useEffect(() => {
    fetchEntradas();
    fetchSalidas();
  }, []);

  return (
    <div className="users-wrapper">
      <div className="table-container">
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <Button icon={<PlusOutlined />} onClick={() => setModalVisible(true)}>
            Agregar Entrada
          </Button>
          <Button icon={<PlusOutlined />} type="default" onClick={() => setModalSalidaVisible(true)}>
            Agregar Salida
          </Button>
        </div>

        <Card title="Lista de Entradas y Salidas" className="list-section">
          <div className="search-bar">
            <Input
              placeholder="Buscar por nombre"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              prefix={<SearchOutlined />}
            />
          </div>
          <Table
            columns={columns}
            dataSource={filteredResidents}
            rowKey="_id"
            pagination={{ pageSize: 6 }}
          />
        </Card>
      </div>

      {/* Modal ENTRADA */}
      <Modal
        title="Registrar Entrada"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleRegisterEntrada}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="nombre" label="Nombre" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="casa" label="Casa" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="telefono" label="Teléfono" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="fecha" label="Fecha" rules={[{ required: true }]}>
                <Input type="date" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="hora" label="Hora" rules={[{ required: true }]}>
                <Input type="time" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="uid" label="Tarjeta de visitante" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item>
                <Button type="primary" htmlType="submit" block>
                  Registrar Entrada
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* Modal SALIDA */}
      <Modal
        title="Registrar Salida"
        open={modalSalidaVisible}
        onCancel={() => setModalSalidaVisible(false)}
        footer={null}
      >
        <Form form={formSalida} layout="vertical" onFinish={handleRegisterSalida}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="nombre" label="Nombre" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="casa" label="Casa" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="telefono" label="Teléfono" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="fecha" label="Fecha" rules={[{ required: true }]}>
                <Input type="date" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="hora" label="Hora" rules={[{ required: true }]}>
                <Input type="time" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="uid" label="Tarjeta de visitante" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item>
                <Button type="primary" htmlType="submit" block>
                  Registrar Salida
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}
