import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import {  useNavigate } from "react-router-dom";
import "../Css/Register.css";

export default function Register() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [tipoCuenta, setTipoCuenta] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [confirmarContraseña, setConfirmarContraseña] = useState("");
  const [telefono, setTelefono] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (contraseña !== confirmarContraseña) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          correo,
          tipoCuenta,
          contraseña,
          telefono,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Error al registrarse");
        return;
      }

      alert("Registro exitoso");
      navigate("/"); // redirige al login
    } catch (err) {
      console.error("Error de conexión:", err);
      setError("Error al conectar con el servidor");
    }
  };

  return (
    <div className="register-wrapper">
      <div className="image-back"></div>
      <div className="image-front"></div>

      <div className="register-left">
        <form className="register-form" onSubmit={handleRegister}>
          <h1 className="register-title">Registro</h1>

          <input
            type="text"
            placeholder="Nombre completo"
            className="register-input"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />

          <input
            type="email"
            placeholder="Correo electrónico"
            className="register-input"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />

          <div className="account-type">
            <label>Tipo de cuenta</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="tipo"
                  value="admin"
                  onChange={(e) => setTipoCuenta(e.target.value)}
                /> Administrador
              </label>
              <label>
                <input
                  type="radio"
                  name="tipo"
                  value="mantenimiento"
                  onChange={(e) => setTipoCuenta(e.target.value)}
                /> Mantenimiento
              </label>
              <label>
                <input
                  type="radio"
                  name="tipo"
                  value="vigilancia"
                  onChange={(e) => setTipoCuenta(e.target.value)}
                /> Vigilancia
              </label>
            </div>
          </div>

          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              className="register-input"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
            />
            <button
              type="button"
              className="eye-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="password-wrapper">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirmar contraseña"
              className="register-input"
              value={confirmarContraseña}
              onChange={(e) => setConfirmarContraseña(e.target.value)}
            />
            <button
              type="button"
              className="eye-btn"
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <input
            type="tel"
            placeholder="Teléfono"
            className="register-input"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="register-btn">
            Registrarse
          </button>

         
        </form>
      </div>
    </div>
  );
}
