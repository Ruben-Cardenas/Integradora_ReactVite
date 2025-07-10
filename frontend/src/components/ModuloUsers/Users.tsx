import React, { useState } from 'react';
import { Card, Table, Input, Button, Form, Modal } from 'antd';
import { SearchOutlined, UserAddOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import '../Css/Users.css';

type Resident = {
  name: string;
  houseNumber: string;
  status: 'Activo' | 'Inactivo';
};

const Usuarios: React.FC = () => {
  const [activeForm, setActiveForm] = useState<null | 'usuario' | 'residencia' | 'control'>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [residents, setResidents] = useState<Resident[]>([
    { name: 'Jose Maria Perez Quiñones', houseNumber: '#129', status: 'Activo' },
    { name: 'Roberto Martinez Nuñez', houseNumber: '#128', status: 'Inactivo' },
    { name: 'Bernardo Gomez Hernandez', houseNumber: '#127', status: 'Activo' },
  ]);

  // Estado para el modal de dar de baja
  const [deactivationModal, setDeactivationModal] = useState<{
    visible: boolean;
    resident: Resident | null;
  }>({
    visible: false,
    resident: null,
  });

  const showModal = (formType: 'usuario' | 'residencia' | 'control') => {
    setActiveForm(formType);
    setModalVisible(true);
  };

  const handleClose = () => {
    setModalVisible(false);
    setActiveForm(null);
  };

  const confirmDeactivation = (resident: Resident) => {
    setDeactivationModal({ visible: true, resident });
  };

  const handleConfirmDeactivate = () => {
    if (deactivationModal.resident) {
      setResidents(prev =>
        prev.map(r =>
          r.houseNumber === deactivationModal.resident!.houseNumber
            ? { ...r, status: 'Inactivo' }
            : r
        )
      );
    }
    setDeactivationModal({ visible: false, resident: null });
  };

  const handleCancelDeactivate = () => {
    setDeactivationModal({ visible: false, resident: null });
  };

  const columns: ColumnsType<Resident> = [
    {
      title: 'Nombre de residente',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Número de casa',
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
      render: (_, record) => (
        <div className="actions">
          <Button className="btn view" onClick={() => showModal('usuario')}>Asignar usuario</Button>
          <Button className="btn delete" onClick={() => showModal('residencia')}>Asignar residencia</Button>
          <Button className="btn edit" onClick={() => showModal('control')}>Controles</Button>
          {record.status === 'Activo' && (
            <Button className="btn danger" danger onClick={() => confirmDeactivation(record)}>
              Dar de baja
            </Button>
          )}
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

      {/* Modal para asignaciones */}
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

      {/* Modal de confirmación para dar de baja */}
      <Modal
        open={deactivationModal.visible}
        title="Confirmar baja de residente"
        onCancel={handleCancelDeactivate}
        onOk={handleConfirmDeactivate}
        okText="Sí, dar de baja"
        cancelText="Cancelar"
      >
        <p>¿Estás seguro que deseas dar de baja al residente <strong>{deactivationModal.resident?.name}</strong>?</p>
        <p>Esta acción lo marcará como <b>Inactivo</b> en el sistema.</p>
      </Modal>
    </div>
  );
};

export default Usuarios;
