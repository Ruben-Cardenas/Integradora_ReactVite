// src/components/ModuloUsers/Users.tsx

import React, { useState } from 'react';
import { Card, Table, Input, Button, Form, Modal } from 'antd';
import { SearchOutlined, UserAddOutlined } from '@ant-design/icons';
import '../Css/Users.css';

type Resident = {
  name: string;
  houseNumber: string;
  status: 'Activo' | 'Inactivo';
};

const Usuarios: React.FC = () => {
  const [activeForm, setActiveForm] = useState<null | 'usuario' | 'residencia' | 'control'>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [residents] = useState<Resident[]>([
    { name: 'Jose Maria Perez Quiñones', houseNumber: '#129', status: 'Activo' },
    { name: 'Roberto Martinez Nuñez', houseNumber: '#128', status: 'Inactivo' },
    { name: 'Bernardo Gomez Hernandez', houseNumber: '#127', status: 'Activo' },
  ]);

  const showModal = (formType: 'usuario' | 'residencia' | 'control') => {
    setActiveForm(formType);
    setModalVisible(true);
  };

  const handleClose = () => {
    setModalVisible(false);
    setActiveForm(null);
  };

  const columns = [
    {
      title: 'Nombre de residente',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Numero de casa',
      dataIndex: 'houseNumber',
      key: 'houseNumber',
    },
    {
      title: 'Estado del residente',
      dataIndex: 'status',
      key: 'status',
      render: (status: Resident['status']) => (
        <span className={status === 'Activo' ? 'status-active' : 'status-inactive'}>{status}</span>
      ),
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: () => (
        <div className="actions">
          <Button className="btn view" onClick={() => showModal('usuario')}>Asignar usuario</Button>
          <Button className="btn delete" onClick={() => showModal('residencia')}>Asignar residencia</Button>
          <Button className="btn edit" onClick={() => showModal('control')}>Controles</Button>
        </div>
      ),
    },
  ];

  const renderModalForm = () => {
    switch (activeForm) {
      case 'usuario':
        return (
          <Form layout="vertical">
            <Form.Item label="Username">
              <Input />
            </Form.Item>
            <Form.Item label="Contraseña">
              <Input.Password />
            </Form.Item>
            <Button type="primary" htmlType="submit">Guardar usuario</Button>
          </Form>
        );
      case 'residencia':
        return (
          <Form layout="vertical">
            <Form.Item label="Número de residencia">
              <Input />
            </Form.Item>
            <Form.Item label="Nombre de usuario">
              <Input />
            </Form.Item>
            <Button type="primary" htmlType="submit">Asignar residencia</Button>
          </Form>
        );
      case 'control':
        return (
          <Form layout="vertical">
            <Form.Item label="ID de residencia">
              <Input />
            </Form.Item>
            <Form.Item label="Control">
              <Input />
            </Form.Item>
            <Form.Item label="Pin">
              <Input />
            </Form.Item>
            <Form.Item label="Topic">
              <Input />
            </Form.Item>
            <Button type="primary" htmlType="submit">Guardar controlador</Button>
          </Form>
        );
      default:
        return null;
    }
  };

  return (
    <div className="users-wrapper">
      <div className="form-container">
        <Card title="Registro de nuevos residentes" className="form-section">
          <Form layout="vertical">
            <Form.Item label="Nombre(s)">
              <Input />
            </Form.Item>
            <Form.Item label="Apellido paterno">
              <Input />
            </Form.Item>
            <Form.Item label="Apellido materno">
              <Input />
            </Form.Item>
            <Button type="primary" icon={<UserAddOutlined />} htmlType="submit">Agregar residente</Button>
          </Form>
        </Card>
      </div>

      <div className="table-container">
        <Card title="Lista de residentes" className="list-section">
          <div className="search-bar">
            <Input placeholder="Buscar" prefix={<SearchOutlined />} />
            <Button type="primary">Filtrar</Button>
          </div>
          <Table dataSource={residents} columns={columns} pagination={false} rowKey="houseNumber" />
        </Card>
      </div>

      <Modal
        open={modalVisible}
        title={
          activeForm === 'usuario'
            ? 'Asignar Usuario'
            : activeForm === 'residencia'
            ? 'Asignar Residencia'
            : activeForm === 'control'
            ? 'Asignar Controladores'
            : ''
        }
        onCancel={handleClose}
        footer={null}
      >
        {renderModalForm()}
      </Modal>
    </div>
  );
};

export default Usuarios;
