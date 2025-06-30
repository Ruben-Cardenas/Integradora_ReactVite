import React from 'react';
import {
  AppstoreOutlined,
  BarChartOutlined,
  CloudOutlined,
  ShopOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { useNavigate, Routes, Route } from 'react-router-dom';

import Dashboard from '../ModuloDashboard/Dashboard';
import Irrigation from '../ModuloIrrigation/Irrigation';
import Resident from '../ModuloResident/Resident';
import Users from '../ModuloUsers/Users';
import Settings from '../ModuloSettings/Setting';
import Reservacion from '../ModuloReservacion/Reservacion';

const { Content, Sider,  } = Layout;

// Datos del usuario
const user = {
  name: 'Rubén Z.',
  email: 'ruben@example.com',
  avatar: 'https://i.pravatar.cc/100',
};

// Menú lateral
const menuItems = [
  { label: 'Dashboard', key: '1', icon: <AppstoreOutlined />, path: '/dashboard' },
  { label: 'Resident', key: '2', icon: <UserOutlined />, path: '/resident' },
  { label: 'Users', key: '3', icon: <TeamOutlined />, path: '/users' },
  { label: 'Settings', key: '4', icon: <BarChartOutlined />, path: '/settings' },
  { label: 'Irrigation', key: '5', icon: <CloudOutlined />, path: '/irrigation' },
  { label: 'Reservacion', key: '6', icon: <ShopOutlined />, path: '/reservacion' },
];

const MenuSlider: React.FC = () => {
  const navigate = useNavigate();

  // Acción al hacer clic en menú
  const handleClick = ({ key }: { key: string }) => {
    const selected = menuItems.find(item => item.key === key);
    if (selected) navigate(selected.path);
  };

  return (
    <Layout style={{ minHeight: '100vh', overflow: 'hidden' }}>
      {/* Menú lateral izquierdo */}
      <Sider
        width={200}
        style={{
          background: 'linear-gradient(to top, #0b0b0b, #0072E6)',
          overflow: 'hidden',
        }}
      >
        {/* Avatar y datos del usuario */}
        <div style={{ padding: '16px', textAlign: 'center', color: '#fff' }}>
          <img
            src={user.avatar}
            alt="Avatar"
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              marginBottom: 8,
              border: '2px solid white',
            }}
          />
          <div style={{ fontWeight: 'bold' }}>{user.name}</div>
          <div style={{ fontSize: '12px', opacity: 0.8 }}>{user.email}</div>
        </div>

        {/* Menú de navegación */}
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          items={menuItems.map(({ key, icon, label }) => ({ key, icon, label }))}
          onClick={handleClick}
        />
      </Sider>

      {/* Contenido del lado derecho (sin Header) */}
      <Layout style={{ overflow: 'hidden' }}>
        <Content
          style={{
            margin: 0,
            padding: 0,
            height: '100vh',
            overflow: 'hidden',
          }}
        >
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/resident" element={<Resident />} />
            <Route path="/users" element={<Users />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/irrigation" element={<Irrigation />} />
            <Route path="/reservacion" element={<Reservacion />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MenuSlider;
