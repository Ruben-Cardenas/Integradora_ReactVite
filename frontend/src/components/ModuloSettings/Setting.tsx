// src/components/ModuloSettings/Settings.tsx

import  { useState } from 'react';
import { Card, Form, Input, Button, Typography, Row, Col, message, Modal } from 'antd';
import '../Css/Settings.css';

const { Title } = Typography;

export default function Settings() {
  // Simula si el usuario es administrador o no
  const [isAdmin] = useState<boolean>(false); // Cambia a true para probar admin

  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);

  const handleSave = () => {
    form
      .validateFields()
      .then((values) => {
        console.log('Valores del formulario:', values);
        message.success('Cambios guardados correctamente');
      })
      .catch(() => {
        message.error('Por favor, complete todos los campos requeridos');
      });
  };

  const handleRequestEmailChange = () => {
    setModalVisible(true);
  };

  const handleSubmitRequest = () => {
    // Aquí pondrías lógica para enviar la solicitud al backend.
    message.success('Solicitud de cambio enviada al administrador.');
    setModalVisible(false);
  };

  return (
    <div className="settings-wrapper">
      <Row style={{ minHeight: '100vh', width: '100%' }}>
        <Col
          xs={24}
          sm={20}
          md={14}
          lg={10}
          style={{ marginLeft: 'auto', paddingRight: '80px' }}
        >
          <Card title="Configuración del perfil" className="settings-card" bordered={false}>
            <Form layout="vertical" form={form}>
              <Title level={5} style={{ marginBottom: '20px' }}>
                Datos del perfil
              </Title>

              <Form.Item
                label="Nombre completo"
                name="nombre"
                rules={[{ required: true, message: 'Por favor ingrese su nombre' }]}
              >
                <Input placeholder="Juan Pérez" />
              </Form.Item>

              <Form.Item
                label="Correo electrónico"
                name="correo"
                rules={[
                  { required: true, message: 'Por favor ingrese su correo' },
                  { type: 'email', message: 'Ingrese un correo válido' },
                ]}
              >
                <Input placeholder="usuario@correo.com" disabled={!isAdmin} />
              </Form.Item>

              {!isAdmin && (
                <Button type="link" onClick={handleRequestEmailChange} style={{ paddingLeft: 0 }}>
                  Solicitar cambio de correo
                </Button>
              )}

              <Form.Item
                label="Teléfono"
                name="telefono"
                rules={[{ required: true, message: 'Por favor ingrese su número de teléfono' }]}
              >
                <Input placeholder="6181234567" />
              </Form.Item>

              <Form.Item
                label="Contraseña"
                name="contraseña"
                rules={[{ required: true, message: 'Por favor ingrese su contraseña' }]}
              >
                <Input.Password placeholder="••••••••" />
              </Form.Item>

              <Button type="primary" block onClick={handleSave}>
                Guardar cambios
              </Button>
              <p className="note" style={{ textAlign: 'center', marginTop: '12px' }}>
                No olvide guardar los cambios
              </p>
            </Form>
          </Card>
        </Col>
      </Row>

      {/* Modal para solicitar cambio de correo */}
      <Modal
        title="Solicitar cambio de correo"
        visible={modalVisible}
        onOk={handleSubmitRequest}
        onCancel={() => setModalVisible(false)}
        okText="Enviar solicitud"
        cancelText="Cancelar"
      >
        <p>
          ¿Está seguro que desea solicitar un cambio de correo electrónico? Esta solicitud será revisada por el administrador.
        </p>
      </Modal>
    </div>
  );
}
