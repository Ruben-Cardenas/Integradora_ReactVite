import { type JSX, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import "../css/Login.css";

export default function Login(): JSX.Element {
  const [mostrarPassword, setMostrarPassword] = useState(false);

  const togglePassword = () => {
    setMostrarPassword(prev => !prev);
  };

  return (
    <div className="login-wrapper">
      {/* Lado izquierdo con collage y logo letras */}
      <div className="login-left">
        <img src="/img/login-collage.png" alt="Fondo" className="collage-image" />
        <img src="/img/logo-letras.png" alt="Logo letras" className="logo-letras" />
      </div>

      {/* Lado derecho con formulario */}
      <div className="login-right">
        <img src="/img/logo-icono.png" alt="Logo Real Cantera" className="login-logo" />

        <form className="login-form">
          <h1 className="login-title">Bienvenido de vuelta</h1>

          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Ingresa tu email"
            className="login-input"
          />

          <label htmlFor="password">Contraseña</label>
          <div className="password-wrapper">
            <input
              id="password"
              type={mostrarPassword ? "text" : "password"}
              placeholder="Ingresa tu contraseña"
              className="login-input"
            />
            <button
              type="button"
              onClick={togglePassword}
              className="eye-btn"
            >
              {mostrarPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="forgot-password">¿Has olvidado tu contraseña?</div>

          <button type="submit" className="submit-btn">
            Iniciar sesión
          </button>

          <div className="register-link">
            ¿No tienes cuenta? <a href="#">Regístrate aquí</a>
          </div>
        </form>
      </div>
    </div>
  );
}
 