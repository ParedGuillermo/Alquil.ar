import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthContext";
import { v4 as uuidv4 } from "uuid";

const RegistrarPropiedad = () => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    tipo_propiedad: "departamento",
    ubicacion: "",
    precio: "",
  });

  const [imagenes, setImagenes] = useState([]);
  const [subiendo, setSubiendo] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + imagenes.length > 5) {
      alert("Máximo 5 imágenes por propiedad.");
      return;
    }
    setImagenes((prev) => [...prev, ...files]);
  };

  const subirImagenes = async (idPropiedad) => {
    const urls = [];

    for (let img of imagenes) {
      const nombreArchivo = `${uuidv4()}.${img.name.split(".").pop()}`;
      const { data, error } = await supabase.storage
        .from("images")
        .upload(nombreArchivo, img);

      if (error) {
        console.error("Error al subir imagen:", error.message);
        continue;
      }

      const urlPublica = supabase.storage.from("images").getPublicUrl(nombreArchivo).data.publicUrl;

      const { error: errorInsert } = await supabase
        .from("imagenes_propiedad")
        .insert({
          propiedad_id: idPropiedad,
          url: urlPublica,
        });

      if (!errorInsert) urls.push(urlPublica);
    }

    return urls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubiendo(true);
    setMensaje("");

    const { data, error } = await supabase
      .from("propiedades")
      .insert({
        ...formData,
        usuario_id: user.id,
        precio: parseFloat(formData.precio),
      })
      .select()
      .single();

    if (error) {
      console.error(error.message);
      setMensaje("Error al registrar la propiedad.");
      setSubiendo(false);
      return;
    }

    await subirImagenes(data.id);
    setMensaje("Propiedad registrada correctamente.");
    setFormData({ titulo: "", descripcion: "", tipo_propiedad: "departamento", ubicacion: "", precio: "" });
    setImagenes([]);
    setSubiendo(false);
  };

  return (
    <div className="max-w-xl p-4 mx-auto">
      <h2 className="mb-4 text-xl font-bold">Registrar nueva propiedad</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="titulo" placeholder="Título" value={formData.titulo} onChange={handleChange} className="w-full p-2 border rounded" required />
        <textarea name="descripcion" placeholder="Descripción" value={formData.descripcion} onChange={handleChange} className="w-full p-2 border rounded" required />
        <select name="tipo_propiedad" value={formData.tipo_propiedad} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="departamento">Departamento</option>
          <option value="casa">Casa</option>
          <option value="habitacion">Habitación</option>
        </select>
        <input name="ubicacion" placeholder="Ubicación" value={formData.ubicacion} onChange={handleChange} className="w-full p-2 border rounded" required />
        <input type="number" name="precio" placeholder="Precio" value={formData.precio} onChange={handleChange} className="w-full p-2 border rounded" required />
        
        <input type="file" accept="image/*" multiple onChange={handleImageChange} />
        <p className="text-sm text-gray-500">Máximo 5 imágenes</p>

        <button type="submit" disabled={subiendo} className="px-4 py-2 text-white bg-blue-600 rounded">
          {subiendo ? "Subiendo..." : "Registrar propiedad"}
        </button>
      </form>
      {mensaje && <p className="mt-4 text-center">{mensaje}</p>}
    </div>
  );
};

export default RegistrarPropiedad;
