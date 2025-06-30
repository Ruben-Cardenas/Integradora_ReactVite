// src/components/ModuloSettings/Settings.tsx
import { Card, Form, Select, Switch, Button, Typography, Row, Col } from 'antd';
import '../Css/Settings.css';

const { Title } = Typography;
const { Option } = Select;

export default function Settings() {
  return (
    <div className="settings-wrapper">
      <Row justify="center">
        <Col xs={24} sm={20} md={16} lg={12}>
          <Card title="Configuración del sistema" className="settings-card">
            <div className="settings-section">
              <Title level={4}>Preferencias Generales</Title>
              <Form layout="vertical">
                <Form.Item label="Activar notificaciones">
                  <Switch />
                </Form.Item>
                <Form.Item label="Tema">
                  <Select defaultValue="Oscuro">
                    <Option value="Oscuro">Oscuro</Option>
                    <Option value="Claro">Claro</Option>
                  </Select>
                </Form.Item>
              </Form>
            </div>

            <div className="settings-section">
              <Title level={4}>Idioma</Title>
              <Form layout="vertical">
                <Form.Item label="Elegir idioma">
                  <Select defaultValue="Español">
                    <Option value="Español">Español</Option>
                    <Option value="Inglés">Inglés</Option>
                  </Select>
                </Form.Item>
              </Form>
            </div>

            <Button type="primary" block className="save-button">
              Guardar cambios
            </Button>
            <p className="note">No olvide guardar los cambios</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
