import { type JSX, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import "../css/Login.css";

export default function Login(): JSX.Element {
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const togglePassword = () => {
    setMostrarPassword((prev) => !prev);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:3001/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, contraseña }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Error al iniciar sesión");
        return;
      }

      // Guarda token y usuario
      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", JSON.stringify(data.user));
      localStorage.setItem("userId", data.user.id); // <-- Aquí guardamos el userId

      // Redirige al menú
      navigate("/menu");
    } catch (err) {
      console.error("Error al conectar con el backend:", err);
      setError("Error al conectar con el servidor");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-left">
        <img src="/img/login-collage.png" alt="Fondo" className="collage-image" />
        <img src="/img/logo-letras.png" alt="Logo letras" className="logo-letras" />
      </div>

      <div className="login-right">
        <img src="/img/logo-icono.png" alt="Logo Real Cantera" className="login-logo" />

        <form className="login-form" onSubmit={handleLogin}>
          <h1 className="login-title">Bienvenido de vuelta</h1>

          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            placeholder="Ingresa tu email"
            className="login-input"
          />

          <label htmlFor="password">Contraseña</label>
          <div className="password-wrapper">
            <input
              id="password"
              type={mostrarPassword ? "text" : "password"}
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              placeholder="Ingresa tu contraseña"
              className="login-input"
            />
            <button type="button" onClick={togglePassword} className="eye-btn">
              {mostrarPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {error && <div className="error-message">{error}</div>}


          <button type="submit" className="submit-btn">
            Iniciar sesión
          </button>
        </form>
      </div>
    </div>
  );
}
