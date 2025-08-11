import React, { useEffect, useState } from 'react';
import {
  AppstoreOutlined,
  CloudOutlined,
  ShopOutlined,
  TeamOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Modal } from 'antd';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';

const { Content, Sider } = Layout;

const menuItems = [
  { label: 'Dashboard', key: '/menu/dashboard', icon: <AppstoreOutlined />, roles: ['admin', 'vigilancia'] },
  { label: 'Entradas Y Salidas', key: '/menu/resident', icon: <UserOutlined />, roles: ['admin', 'vigilancia'] },
  { label: 'Usuarios', key: '/menu/users', icon: <TeamOutlined />, roles: ['admin'] },
  { label: 'Riego', key: '/menu/irrigation', icon: <CloudOutlined />, roles: ['admin', 'mantenimiento'] },
  { label: 'Reservaciones', key: '/menu/reservacion', icon: <ShopOutlined />, roles: ['admin', 'vigilancia'] },
  { label: 'Registro de usuarios', key: '/menu/register', icon: <UserAddOutlined />, roles: ['admin'] },
];

const MenuSlider: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("usuario");
    return storedUser ? JSON.parse(storedUser) : {};
  });

  const tipoCuenta = user?.tipoCuenta || "";
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Actualiza el estado cuando el usuario cambia en localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const updatedUser = localStorage.getItem("usuario");
      if (updatedUser) {
        setUser(JSON.parse(updatedUser));
      }
    };

    handleStorageChange(); // Inicial
    window.addEventListener("storage", handleStorageChange);

    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Redirigir según tipo de cuenta
  useEffect(() => {
    if (location.pathname === '/menu') {
      if (tipoCuenta === 'admin' || tipoCuenta === 'vigilancia') {
        navigate('/menu/dashboard', { replace: true });
      } else if (tipoCuenta === 'mantenimiento') {
        navigate('/menu/irrigation', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [location.pathname, navigate, tipoCuenta]);

  const handleClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  const confirmLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setShowLogoutModal(false);
    navigate("/", { replace: true });
  };

  const filteredItems = menuItems
    .filter(item => item.roles.includes(tipoCuenta))
    .map(({ key, icon, label }) => ({ key, icon, label }));

  const currentTitle = (() => {
    const currentItem = menuItems.find(item => location.pathname.startsWith(item.key));
    return currentItem ? currentItem.label : '';
  })();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        width={200}
        style={{
          background: 'linear-gradient(to top, #0b0b0b, #0072E6)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ padding: 16, textAlign: 'center', color: '#fff' }}>
          <img
            src={user.avatar || '/src/assets/logo-real.jpg'}
            alt="Avatar"
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              marginBottom: 8,
              border: '2px solid white',
            }}
          />
          <div style={{ fontWeight: 'bold' }}>{user.nombre || 'Usuario'}</div>
          <div style={{ fontSize: 12, opacity: 0.8 }}>{user.correo}</div>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ flexGrow: 1, overflowY: 'auto' }}>
            <Menu
              theme="dark"
              mode="inline"
              selectedKeys={[location.pathname]}
              items={filteredItems}
              onClick={handleClick}
              style={{ background: 'transparent', border: 'none' }}
            />
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: 16,
              gap: 10,
              marginTop: 'auto',
              marginBottom: 80,
            }}
          >
            <div
              onClick={() => navigate('/menu/settings')}
              style={{
                display: 'flex',
                alignItems: 'center',
                color: 'white',
                cursor: 'pointer',
                gap: 8,
                padding: 8,
                borderRadius: 6,
                transition: 'background 0.3s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#1f1f1f')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <SettingOutlined />
              <span>Settings</span>
            </div>

            <div
              onClick={() => setShowLogoutModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                color: 'white',
                cursor: 'pointer',
                gap: 8,
                padding: 8,
                borderRadius: 6,
                transition: 'background 0.3s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#1f1f1f')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <LogoutOutlined />
              <span>Log out</span>
            </div>
          </div>
        </div>
      </Sider>

      <Layout style={{ display: 'flex', flexDirection: 'column', height: '100vh', flex: 1 }}>
        <header
          style={{
            backgroundColor: 'white',
            borderBottom: '6px solid white',
            height: 60,
            display: 'flex',
            alignItems: 'center',
            padding: '0 24px',
            boxSizing: 'border-box',
            flexShrink: 0,
          }}
        ></header>

        <div
          style={{
            backgroundColor: '#0072E6',
            color: 'white',
            textAlign: 'center',
            padding: '8px 16px',
            fontWeight: 'bold',
            fontSize: '1.25rem',
            flexShrink: 0,
            margin: 0,
          }}
        >
          {currentTitle}
        </div>

        <Content
          style={{
            flexGrow: 1,
            margin: 0,
            padding: 0,
            overflowY: 'auto',
            backgroundColor: '#fff',
          }}
        >
          <Outlet />
        </Content>

        <footer
          style={{
            backgroundColor: 'white',
            borderTop: '6px solid white',
            height: 60,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        ></footer>
      </Layout>

      {/* Modal de confirmación de logout */}
      <Modal
        title="Cerrar sesión"
        open={showLogoutModal}
        onOk={confirmLogout}
        onCancel={() => setShowLogoutModal(false)}
        okText="Cerrar sesión"
        cancelText="Cancelar"
      >
        <p>¿Estás seguro de que deseas cerrar sesión?</p>
      </Modal>
    </Layout>
  );
};

export default MenuSlider;
