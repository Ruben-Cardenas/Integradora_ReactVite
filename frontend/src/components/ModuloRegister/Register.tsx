import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import "../Css/Register.css";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="register-wrapper">
      {/* Fondo con dos capas */}
      <div className="image-back"></div>
      <div className="image-front"></div>

      {/* Formulario de registro */}
      <div className="register-left">
        <form className="register-form">
          <h1 className="register-title">Registro</h1>

          {/* Nombre completo */}
          <input
            type="text"
            placeholder="Nombre completo"
            className="register-input"
          />

          {/* Correo electrónico */}
          <input
            type="email"
            placeholder="Correo electrónico"
            className="register-input"
          />

          {/* Tipo de cuenta */}
          <div className="account-type">
            <label>Tipo de cuenta</label>
            <div className="radio-group">
              <label>
                <input type="radio" name="tipo" value="admin" /> Administrador
              </label>
              <label>
                <input type="radio" name="tipo" value="mantenimiento" /> Mantenimiento
              </label>
              <label>
                <input type="radio" name="tipo" value="vigilancia" /> Vigilancia
              </label>
            </div>
          </div>

          {/* Contraseña */}
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              className="register-input"
            />
            <button
              type="button"
              className="eye-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Confirmar contraseña */}
          <div className="password-wrapper">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirmar contraseña"
              className="register-input"
            />
            <button
              type="button"
              className="eye-btn"
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Teléfono */}
          <input
            type="tel"
            placeholder="Teléfono"
            className="register-input"
          />

          {/* Botón de registro */}
          <button type="submit" className="register-btn">
            Registrarse
          </button>

          {/* Enlace para iniciar sesión */}
          <div className="login-link">
            ¿Ya tienes cuenta? <a href="/login">Iniciar sesión</a>
          </div>
        </form>
      </div>
    </div>
  );
}
