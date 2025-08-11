import React, { useState, useEffect } from 'react';
import { Card, Table, Input, Button, Form, Modal, message, Tooltip } from 'antd';
import {
  SearchOutlined,
  UserAddOutlined,
  UserOutlined,
  HomeOutlined,
  SettingOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import axios from 'axios';
import '../Css/Users.css';

type Resident = {
  id: number;
  name: string;
  houseNumber: string;
  status: 'Activo' | 'Inactivo';
};

type ResidentFromAPI = {
  id: number;
  nombre_completo: string;
  n_residencia?: string;
  status: string;
};

const Usuarios: React.FC = () => {
  const [activeForm, setActiveForm] = useState<null | 'usuario' | 'residencia' | 'control'>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [residents, setResidents] = useState<Resident[]>([]);
  const [searchText, setSearchText] = useState('');
  const [deactivationModal, setDeactivationModal] = useState<{ visible: boolean; resident: Resident | null }>({ visible: false, resident: null });
  const [selectedResidentId, setSelectedResidentId] = useState<number | null>(null);

  // Modal para agregar nuevo residente
  const [addResidentModalVisible, setAddResidentModalVisible] = useState(false);
  const [residenteForm] = Form.useForm();

  const [usuarioForm] = Form.useForm();
  const [residenciaForm] = Form.useForm();
  const [controlForm] = Form.useForm();

  useEffect(() => {
    fetchResidentes();
  }, []);

  const fetchResidentes = async () => {
    try {
      const response = await axios.get<ResidentFromAPI[]>('http://localhost:3001/api/residentes');
      const data: Resident[] = response.data.map((res) => ({
        id: res.id,
        name: res.nombre_completo,
        houseNumber: res.n_residencia ?? 'N/A',
        status: res.status === 'Activo' ? 'Activo' : 'Inactivo',
      }));
      setResidents(data);
    } catch {
      message.error('Error al cargar residentes');
    }
  };

  const showModal = (formType: 'usuario' | 'residencia' | 'control', residentId: number) => {
    setActiveForm(formType);
    setSelectedResidentId(residentId);
    setModalVisible(true);

    // Resetea formulario antes de abrir
    if (formType === 'usuario') usuarioForm.resetFields();
    if (formType === 'residencia') residenciaForm.resetFields();
    if (formType === 'control') controlForm.resetFields();
  };

  const handleClose = () => {
    setModalVisible(false);
    setActiveForm(null);
    setSelectedResidentId(null);
    usuarioForm.resetFields();
    residenciaForm.resetFields();
    controlForm.resetFields();
  };

  const confirmDeactivation = (resident: Resident) => {
    setDeactivationModal({ visible: true, resident });
  };

  const handleConfirmDeactivate = async () => {
    if (deactivationModal.resident) {
      try {
        await axios.put(`http://localhost:3001/api/residentes/${deactivationModal.resident.id}/deactivate`);
        fetchResidentes();
        message.success('Residente dado de baja');
      } catch {
        message.error('Error al dar de baja al residente');
      }
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
          <Tooltip title="Asignar usuario">
            <button
              className="action-icon-btn"
              onClick={() => showModal('usuario', record.id)}
              aria-label="Asignar usuario"
            >
              <UserOutlined />
            </button>
          </Tooltip>
          <Tooltip title="Asignar residencia">
            <button
              className="action-icon-btn"
              onClick={() => showModal('residencia', record.id)}
              aria-label="Asignar residencia"
            >
              <HomeOutlined />
            </button>
          </Tooltip>
          <Tooltip title="Asignar controles">
            <button
              className="action-icon-btn"
              onClick={() => showModal('control', record.id)}
              aria-label="Asignar controles"
            >
              <SettingOutlined />
            </button>
          </Tooltip>
          {record.status === 'Activo' && (
            <Tooltip title="Dar de baja">
              <button
                className="action-icon-btn"
                style={{ color: 'red' }}
                onClick={() => confirmDeactivation(record)}
                aria-label="Dar de baja"
              >
                <DeleteOutlined />
              </button>
            </Tooltip>
          )}
        </div>
      ),
    },
  ];

  const renderModalForm = () => {
    if (!activeForm || selectedResidentId === null) return null;

    const formMap = {
      usuario: usuarioForm,
      residencia: residenciaForm,
      control: controlForm,
    };

    const handleSubmit = async (values: { [key: string]: string | number }) => {
      try {
        if (activeForm === 'usuario') {
          await axios.put(`http://localhost:3001/api/residentes/${selectedResidentId}/usuario`, {
            username: values.username,
            password: values.password,
          });
          message.success('Usuario asignado');
        } else if (activeForm === 'residencia') {
          await axios.put(`http://localhost:3001/api/residentes/${selectedResidentId}/residencia`, {
            numero: values.numero,
          });
          message.success('Residencia asignada');
        } else if (activeForm === 'control') {
          await axios.put(`http://localhost:3001/api/residentes/${selectedResidentId}/control`, {
            control: values.control,
            pin: values.pin,
            topic: values.topic,
          });
          message.success('Control asignado');
        }
        fetchResidentes();
        handleClose();
      } catch {
        message.error('Error al guardar');
      }
    };

    return (
      <Form layout="vertical" form={formMap[activeForm]} onFinish={handleSubmit}>
        {/* No necesitas campo id oculto ahora */}
        {activeForm === 'usuario' && (
          <>
            <Form.Item label="Username" name="username" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Contraseña" name="password" rules={[{ required: true }]}>
              <Input.Password />
            </Form.Item>
          </>
        )}

        {activeForm === 'residencia' && (
          <Form.Item label="Número de residencia" name="numero" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        )}

        {activeForm === 'control' && (
          <>
            <Form.Item label="Control" name="control" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Pin" name="pin" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Topic" name="topic" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </>
        )}

        <Button type="primary" htmlType="submit">Guardar</Button>
      </Form>
    );
  };

  const handleAddResidente = async (values: { nombre: string; apellido1: string; apellido2: string }) => {
    try {
      await axios.post('http://localhost:3001/api/residentes', {
        nombre: values.nombre,
        apellido1: values.apellido1,
        apellido2: values.apellido2,
      });
      message.success('Residente agregado');
      residenteForm.resetFields();
      fetchResidentes();
      setAddResidentModalVisible(false); // Cerrar modal al guardar
    } catch {
      message.error('Error al agregar residente');
    }
  };

  return (
    <div className="users-wrapper">
      <div className="table-container table-center">
        <Button
          type="primary"
          icon={<UserAddOutlined />}
          className="add-resident-btn"
          onClick={() => setAddResidentModalVisible(true)}
        >
          Agregar nuevo residente
        </Button>

        <Card title="Lista de residentes" className="list-section">
          <div className="search-bar">
            <Input
              placeholder="Buscar"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
          <Table
            dataSource={residents.filter(r => r.name.toLowerCase().includes(searchText.toLowerCase()))}
            columns={columns}
            pagination={false}
            rowKey="id"
          />
        </Card>
      </div>

      {/* Modal para asignar usuario, residencia, control */}
      <Modal
        open={modalVisible}
        title={
          activeForm === 'usuario'
            ? 'Asignar Usuario'
            : activeForm === 'residencia'
            ? 'Asignar Residencia'
            : 'Asignar Controladores'
        }
        onCancel={handleClose}
        footer={null}
      >
        {renderModalForm()}
      </Modal>

      {/* Modal para agregar residente */}
      <Modal
        open={addResidentModalVisible}
        title="Registro de nuevo residente"
        onCancel={() => setAddResidentModalVisible(false)}
        footer={null}
      >
        <Form layout="vertical" form={residenteForm} onFinish={handleAddResidente}>
          <Form.Item label="Nombre(s)" name="nombre" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Apellido paterno" name="apellido1" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Apellido materno" name="apellido2" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Button type="primary" icon={<UserAddOutlined />} htmlType="submit" block>
            Agregar residente
          </Button>
        </Form>
      </Modal>

      {/* Modal para confirmar baja */}
      <Modal
        open={deactivationModal.visible}
        title="Confirmar baja de residente"
        onCancel={handleCancelDeactivate}
        onOk={handleConfirmDeactivate}
        okText="Sí, dar de baja"
        cancelText="Cancelar"
      >
        <p>
          ¿Estás seguro que deseas dar de baja al residente <strong>{deactivationModal.resident?.name}</strong>?
        </p>
        <p>Esta acción lo marcará como <b>Inactivo</b> en el sistema.</p>
      </Modal>
    </div>
  );
};

export default Usuarios;
