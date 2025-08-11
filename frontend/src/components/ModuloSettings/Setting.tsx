// src/components/ModuloSettings/Settings.tsx

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  Form,
  Input,
  Button,
  Typography,
  Alert,
  message,
} from "antd";
import '../Css/Settings.css';

const { Title } = Typography;

interface UserData {
  nombre: string;
  correo: string;
  telefono: string;
}

interface FormValues {
  nombre: string;
  correo: string;
  telefono: string;
  contraseña?: string;
  confirmar?: string;
}

export default function Settings() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (!storedUserId) {
      message.error("No se encontró usuario logueado");
      setLoading(false);
      return;
    }

    setUserId(storedUserId);

    axios.get<UserData>(`http://localhost:3001/api/user/${storedUserId}`)
      .then((res) => {
        form.setFieldsValue({
          nombre: res.data.nombre,
          correo: res.data.correo,
          telefono: res.data.telefono,
          contraseña: "",
          confirmar: ""
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        message.error("Error al cargar los datos del usuario");
        setLoading(false);
      });
  }, [form]);

  const handleSave = () => {
    form.validateFields()
      .then(async (values: FormValues) => {
        if (!userId) {
          message.error("No se pudo actualizar: usuario no identificado");
          return;
        }

        if (values.contraseña && values.contraseña !== values.confirmar) {
          message.error("Las contraseñas no coinciden");
          return;
        }

        const payload: Partial<FormValues> = {
          nombre: values.nombre,
          correo: values.correo,
          telefono: values.telefono,
        };

        if (values.contraseña && values.contraseña.trim() !== "") {
          payload.contraseña = values.contraseña;
        }

        try {
          await axios.put(`http://localhost:3001/api/user/${userId}`, payload);
          setSuccess(true);

          // ✅ ACTUALIZA EL PERFIL EN TIEMPO REAL
          const usuarioGuardado = localStorage.getItem("usuario");
          if (usuarioGuardado) {
            const usuarioActualizado = {
              ...JSON.parse(usuarioGuardado),
              nombre: values.nombre,
              correo: values.correo,
              telefono: values.telefono,
            };
            localStorage.setItem("usuario", JSON.stringify(usuarioActualizado));
            window.dispatchEvent(new Event("storage"));
          }

          form.setFieldsValue({ contraseña: "", confirmar: "" });
          setTimeout(() => setSuccess(false), 3000);
        } catch (error) {
          console.error(error);
          message.error("Error al guardar cambios");
        }
      })
      .catch(() => {
        message.error("Por favor, complete todos los campos requeridos");
      });
  };

  if (loading) {
    return <div style={{ color: "white", textAlign: "center", marginTop: 50 }}>Cargando...</div>;
  }

  return (
    <div className="settings-wrapper" style={{ padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 600, margin: "auto" }}>
        <Title level={3} style={{ color: "white", textAlign: "center", marginBottom: 20 }}>
          Configuración del perfil
        </Title>

        <Card title="Datos personales" className="settings-card" bordered={false}>
          {success && (
            <Alert
              message="Cambios guardados con éxito"
              type="success"
              showIcon
              style={{ marginBottom: 20 }}
            />
          )}

          <Form layout="vertical" form={form}>
            <Form.Item
              label="Nombre completo"
              name="nombre"
              rules={[{ required: true, message: "Por favor ingrese su nombre" }]}
            >
              <Input placeholder="Juan Pérez" />
            </Form.Item>

            <Form.Item
              label="Correo electrónico"
              name="correo"
              rules={[
                { required: true, message: "Por favor ingrese su correo" },
                { type: "email", message: "Ingrese un correo válido" },
              ]}
            >
              <Input placeholder="usuario@correo.com" />
            </Form.Item>

            <Form.Item
              label="Teléfono"
              name="telefono"
              rules={[{ required: true, message: "Por favor ingrese su número de teléfono" }]}
            >
              <Input placeholder="6181234567" />
            </Form.Item>

            <Form.Item
              label="Contraseña"
              name="contraseña"
              extra="Si no deseas cambiarla, deja este campo vacío"
            >
              <Input.Password placeholder="••••••••" />
            </Form.Item>

            <Form.Item
              label="Confirmar contraseña"
              name="confirmar"
              dependencies={['contraseña']}
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!getFieldValue('contraseña') || getFieldValue('contraseña') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Las contraseñas no coinciden'));
                  },
                }),
              ]}
            >
              <Input.Password placeholder="••••••••" />
            </Form.Item>

            <Button type="primary" block onClick={handleSave}>
              Guardar cambios
            </Button>

            <p className="note" style={{ marginTop: 10 }}>
              No olvide guardar los cambios
            </p>
          </Form>
        </Card>
      </div>
    </div>
  );
}
