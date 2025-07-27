import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AdminBlog() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.email === "walterguillermopared@gmail.com";

  const [entradas, setEntradas] = useState([]);
  const [testimonios, setTestimonios] = useState([]);
  const [adopciones, setAdopciones] = useState([]); // Nuevo estado para adopciones
  const [editing, setEditing] = useState(null);
  const [newEntry, setNewEntry] = useState({
    titulo: "",
    categoria: "Entrenamiento",
    contenido: "",
    imagen_url: "",
    autor: user?.email || "Admin",
  });

  useEffect(() => {
    if (!isAdmin) return navigate("/");
    fetchEntradas();
    fetchTestimonios();
    fetchAdopciones(); // Cargar adopciones
  }, [user]);

  const fetchEntradas = async () => {
    const { data, error } = await supabase
      .from("entradas_blog")
      .select("*")
      .order("creado_en", { ascending: false });
    if (!error) setEntradas(data);
  };

  const fetchTestimonios = async () => {
    const { data, error } = await supabase
      .from("entradas_blog")
      .select("*")
      .eq("categoria", "Testimonios")
      .order("creado_en", { ascending: false });

    if (!error) setTestimonios(data);
  };

  const fetchAdopciones = async () => {
    const { data, error } = await supabase
      .from("entradas_blog")
      .select("*")
      .eq("categoria", "Adopciones")
      .order("creado_en", { ascending: false });

    if (!error) setAdopciones(data);
  };

  const handleSave = async () => {
    const { error } = await supabase.from("entradas_blog").insert([newEntry]);
    if (!error) {
      setNewEntry({
        titulo: "",
        categoria: "Entrenamiento",
        contenido: "",
        imagen_url: "",
        autor: user?.email,
      });
      fetchEntradas();
      fetchTestimonios();
      fetchAdopciones();
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar esta entrada?")) return;
    await supabase.from("entradas_blog").delete().eq("id", id);
    fetchEntradas();
    fetchTestimonios();
    fetchAdopciones();
  };

  const handleUpdate = async () => {
    const { id, ...rest } = editing;
    await supabase.from("entradas_blog").update(rest).eq("id", id);
    setEditing(null);
    fetchEntradas();
    fetchTestimonios();
    fetchAdopciones();
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="mb-4 text-3xl font-bold">📝 Administrar Blog Pet Society</h1>

      {/* Formulario para nueva entrada */}
      <section className="p-4 mb-6 bg-white rounded shadow">
        <h2 className="mb-3 text-xl font-semibold">➕ Nueva Entrada</h2>
        <input
          type="text"
          placeholder="Título"
          value={newEntry.titulo}
          onChange={(e) => setNewEntry({ ...newEntry, titulo: e.target.value })}
          className="w-full p-2 mb-2 border rounded"
        />
        <select
          value={newEntry.categoria}
          onChange={(e) =>
            setNewEntry({ ...newEntry, categoria: e.target.value })
          }
          className="w-full p-2 mb-2 border rounded"
        >
          <option>Entrenamiento</option>
          <option>Eventos</option>
          <option>Historias</option>
          <option>Recursos</option>
          <option>Salud</option>
          <option>Testimonios</option>
          <option>Adopciones</option> {/* Nueva categoría agregada */}
        </select>
        <textarea
          placeholder="Contenido"
          value={newEntry.contenido}
          onChange={(e) => setNewEntry({ ...newEntry, contenido: e.target.value })}
          className="w-full p-2 mb-2 border rounded"
          rows={5}
        />
        <input
          type="text"
          placeholder="URL de la imagen"
          value={newEntry.imagen_url}
          onChange={(e) => setNewEntry({ ...newEntry, imagen_url: e.target.value })}
          className="w-full p-2 mb-2 border rounded"
        />
        <button
          onClick={handleSave}
          className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          Publicar
        </button>
      </section>

      {/* Sección de testimonios */}
      <section className="mb-6 space-y-4">
        <h2 className="text-xl font-semibold">🗂 Testimonios</h2>
        {testimonios.map((testimonio) => (
          <div key={testimonio.id} className="p-4 bg-white rounded shadow">
            {editing?.id === testimonio.id ? (
              <>
                <input
                  type="text"
                  value={editing.titulo}
                  onChange={(e) => setEditing({ ...editing, titulo: e.target.value })}
                  className="w-full p-2 mb-2 border rounded"
                />
                <textarea
                  value={editing.contenido}
                  onChange={(e) => setEditing({ ...editing, contenido: e.target.value })}
                  className="w-full p-2 mb-2 border rounded"
                  rows={4}
                />
                <input
                  type="text"
                  value={editing.imagen_url}
                  onChange={(e) => setEditing({ ...editing, imagen_url: e.target.value })}
                  className="w-full p-2 mb-2 border rounded"
                />
                <div className="flex gap-2 mt-2">
                  <button onClick={handleUpdate} className="px-3 py-1 text-white bg-green-600 rounded">
                    Guardar
                  </button>
                  <button
                    onClick={() => setEditing(null)}
                    className="px-3 py-1 text-white bg-gray-400 rounded"
                  >
                    Cancelar
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-lg font-bold">{testimonio.titulo}</h3>
                <p className="text-sm text-gray-600">{testimonio.categoria}</p>
                <p className="mt-1 text-sm">{testimonio.contenido?.slice(0, 200)}...</p>
                {testimonio.imagen_url && (
                  <img
                    src={testimonio.imagen_url}
                    alt="Ilustración"
                    className="w-full mt-2 rounded"
                  />
                )}
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => setEditing(testimonio)}
                    className="text-sm text-blue-600"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(testimonio.id)}
                    className="text-sm text-red-600"
                  >
                    Eliminar
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </section>

      {/* Sección de adopciones */}
      <section className="mb-6 space-y-4">
        <h2 className="text-xl font-semibold">🐾 Adopciones</h2>
        {adopciones.map((adopcion) => (
          <div key={adopcion.id} className="p-4 bg-white rounded shadow">
            {editing?.id === adopcion.id ? (
              <>
                <input
                  type="text"
                  value={editing.titulo}
                  onChange={(e) => setEditing({ ...editing, titulo: e.target.value })}
                  className="w-full p-2 mb-2 border rounded"
                />
                <textarea
                  value={editing.contenido}
                  onChange={(e) => setEditing({ ...editing, contenido: e.target.value })}
                  className="w-full p-2 mb-2 border rounded"
                  rows={4}
                />
                <input
                  type="text"
                  value={editing.imagen_url}
                  onChange={(e) => setEditing({ ...editing, imagen_url: e.target.value })}
                  className="w-full p-2 mb-2 border rounded"
                />
                <div className="flex gap-2 mt-2">
                  <button onClick={handleUpdate} className="px-3 py-1 text-white bg-green-600 rounded">
                    Guardar
                  </button>
                  <button
                    onClick={() => setEditing(null)}
                    className="px-3 py-1 text-white bg-gray-400 rounded"
                  >
                    Cancelar
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-lg font-bold">{adopcion.titulo}</h3>
                <p className="text-sm text-gray-600">{adopcion.categoria}</p>
                <p className="mt-1 text-sm">{adopcion.contenido?.slice(0, 200)}...</p>
                {adopcion.imagen_url && (
                  <img
                    src={adopcion.imagen_url}
                    alt="Ilustración"
                    className="w-full mt-2 rounded"
                  />
                )}
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => setEditing(adopcion)}
                    className="text-sm text-blue-600"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(adopcion.id)}
                    className="text-sm text-red-600"
                  >
                    Eliminar
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </section>

      {/* Otras entradas */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">🗂 Otras Entradas</h2>
        {entradas.map((entrada) => (
          <div key={entrada.id} className="p-4 bg-white rounded shadow">
            {editing?.id === entrada.id ? (
              <>
                <input
                  type="text"
                  value={editing.titulo}
                  onChange={(e) => setEditing({ ...editing, titulo: e.target.value })}
                  className="w-full p-2 mb-2 border rounded"
                />
                <textarea
                  value={editing.contenido}
                  onChange={(e) => setEditing({ ...editing, contenido: e.target.value })}
                  className="w-full p-2 mb-2 border rounded"
                  rows={4}
                />
                <input
                  type="text"
                  value={editing.imagen_url}
                  onChange={(e) => setEditing({ ...editing, imagen_url: e.target.value })}
                  className="w-full p-2 mb-2 border rounded"
                />
                <div className="flex gap-2 mt-2">
                  <button onClick={handleUpdate} className="px-3 py-1 text-white bg-green-600 rounded">
                    Guardar
                  </button>
                  <button
                    onClick={() => setEditing(null)}
                    className="px-3 py-1 text-white bg-gray-400 rounded"
                  >
                    Cancelar
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-lg font-bold">{entrada.titulo}</h3>
                <p className="text-sm text-gray-600">{entrada.categoria}</p>
                <p className="mt-1 text-sm">{entrada.contenido?.slice(0, 200)}...</p>
                {entrada.imagen_url && (
                  <img
                    src={entrada.imagen_url}
                    alt="Ilustración"
                    className="w-full mt-2 rounded"
                  />
                )}
                <div className="flex gap-2 mt-3">
                  <button onClick={() => setEditing(entrada)} className="text-sm text-blue-600">
                    Editar
                  </button>
                  <button onClick={() => handleDelete(entrada.id)} className="text-sm text-red-600">
                    Eliminar
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </section>
    </div>
  );
}
