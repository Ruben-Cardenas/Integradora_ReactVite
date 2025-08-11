// src/components/ConfirmModal.tsx

import { Modal } from "antd";
import React from "react";

interface ConfirmModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  tipo: 'cerrar' | 'eliminar';
  nombreResidente?: string; 
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  visible,
  onConfirm,
  onCancel,
  tipo,
  nombreResidente,
}) => {
  // Define mensajes según tipo
  const title = tipo === 'cerrar'
    ? "Cerrar sesión"
    : "Dar de baja al residente";

  const content = tipo === 'cerrar'
    ? "¿Estás seguro que deseas cerrar sesión?"
    : `¿Estás seguro de dar de baja al residente${nombreResidente ? ` ${nombreResidente}` : ''}? Esta acción lo marcará como inactivo en el sistema.`;

  return (
    <Modal
      title={title}
      open={visible}
      onOk={onConfirm}
      onCancel={onCancel}
      okText="Sí"
      cancelText="Cancelar"
      centered
    >
      <p>{content}</p>
    </Modal>
  );
};

export default ConfirmModal;
