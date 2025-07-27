import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function LoginRegister() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState("inquilino");
  const [error, setError] = useState("");
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setShowVerificationMessage(false);

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError(error.message);
      } else {
        navigate("/");
      }
    } else {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      const { user } = data;
      if (user) {
        const { error: insertError } = await supabase.from("usuarios").insert([
          {
            id: user.id,
            email,
            nombre,
            tipo,
          },
        ]);

        if (insertError) {
          setError(insertError.message);
          return;
        }
      }

      // Mostrar mensaje de verificación y bloquear registro hasta login
      setShowVerificationMessage(true);
      setIsLogin(true);
      setNombre("");
      setEmail("");
      setPassword("");
      setTipo("inquilino");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 text-white bg-gray-900">
      <div className="w-full max-w-md p-6 bg-gray-800 shadow-lg rounded-2xl">
        <h2 className="mb-6 text-2xl font-bold text-center">
          {isLogin ? "Iniciar Sesión" : "Registrarse"}
        </h2>

        {error && (
          <div className="px-4 py-2 mb-4 text-white bg-red-500 rounded">
            {error}
          </div>
        )}

        {showVerificationMessage && (
          <div className="px-4 py-3 mb-4 text-white bg-green-600 rounded">
            Registro exitoso. Por favor, verifica tu correo para activar tu cuenta antes de iniciar sesión.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && !showVerificationMessage && (
            <>
              <input
                type="text"
                placeholder="Nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                className="w-full px-4 py-2 text-white placeholder-gray-300 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                className="w-full px-4 py-2 text-white bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="inquilino">Inquilino</option>
                <option value="propietario">Propietario</option>
              </select>
            </>
          )}

          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 text-white placeholder-gray-300 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={showVerificationMessage}
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 text-white placeholder-gray-300 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={showVerificationMessage}
          />

          <button
            type="submit"
            className={`w-full py-2 rounded bg-blue-600 hover:bg-blue-700 transition duration-200 ${
              showVerificationMessage ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={showVerificationMessage}
          >
            {isLogin ? "Iniciar Sesión" : "Registrarse"}
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-300">
          {isLogin ? "¿No tenés cuenta?" : "¿Ya tenés cuenta?"}{" "}
          <button
            className="text-blue-400 hover:underline"
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
              setShowVerificationMessage(false);
            }}
          >
            {isLogin ? "Registrate" : "Iniciá sesión"}
          </button>
        </p>
      </div>
    </div>
  );
}
