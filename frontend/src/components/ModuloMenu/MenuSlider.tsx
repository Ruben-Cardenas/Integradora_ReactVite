import React from 'react';
import {
  AppstoreOutlined,
  CloudOutlined,
  ShopOutlined,
  TeamOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { useNavigate, Outlet } from 'react-router-dom';

const { Content, Sider } = Layout;

const user = JSON.parse(localStorage.getItem("usuario") || "{}");
const tipoCuenta = user?.tipoCuenta || "";

const menuItems = [
  { label: 'Dashboard', key: '/menu/dashboard', icon: <AppstoreOutlined />, roles: ['admin', 'vigilancia'] },
  { label: 'Resident', key: '/menu/resident', icon: <UserOutlined />, roles: ['admin', 'vigilancia'] },
  { label: 'Users', key: '/menu/users', icon: <TeamOutlined />, roles: ['admin'] },
  { label: 'Irrigation', key: '/menu/irrigation', icon: <CloudOutlined />, roles: ['admin', 'mantenimiento'] },
  { label: 'Reservacion', key: '/menu/reservacion', icon: <ShopOutlined />, roles: ['admin', 'vigilancia'] },
];

const MenuSlider: React.FC = () => {
  const navigate = useNavigate();

  const handleClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/", { replace: true });
    window.location.reload();
  };

  const filteredItems = menuItems
    .filter(item => item.roles.includes(tipoCuenta))
    .map(({ key, icon, label }) => ({ key, icon, label }));

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
        {/* Usuario */}
        <div style={{ padding: '16px', textAlign: 'center', color: '#fff' }}>
          <img
            src={user.avatar || 'https://i.pravatar.cc/100'}
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
          <div style={{ fontSize: '12px', opacity: 0.8 }}>{user.correo}</div>
        </div>

        {/* Menú principal y botones abajo */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Menú principal */}
          <div style={{ flexGrow: 1, overflowY: 'auto' }}>
            <Menu
              theme="dark"
              mode="inline"
              defaultSelectedKeys={[window.location.pathname]}
              items={filteredItems}
              onClick={handleClick}
              style={{
                background: 'transparent',
                border: 'none',
              }}
            />
          </div>

          {/* Botones al fondo */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '16px',
              gap: '10px',
              marginTop: 'auto',
              marginBottom: '80px', // ⬅️ Aún más abajo
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
                padding: '8px',
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
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                color: 'white',
                cursor: 'pointer',
                gap: 8,
                padding: '8px',
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

      <Layout>
        <Content style={{ margin: 0, padding: 0 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MenuSlider;
