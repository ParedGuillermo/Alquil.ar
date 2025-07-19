import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthContext";
import { useParams, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

const EditarPropiedad = () => {
  const { user } = useAuth();
  const { id } = useParams(); // id propiedad desde URL
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    tipo_propiedad: "departamento",
    ubicacion: "",
    precio: "",
  });

  const [imagenesExistentes, setImagenesExistentes] = useState([]); // URLs ya subidas
  const [imagenesNuevas, setImagenesNuevas] = useState([]); // Archivos nuevos para subir

  const [loading, setLoading] = useState(true);
  const [subiendo, setSubiendo] = useState(false);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const fetchPropiedad = async () => {
      const { data: propiedad, error } = await supabase
        .from("propiedades")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !propiedad) {
        setMensaje("No se encontró la propiedad");
        setLoading(false);
        return;
      }

      if (propiedad.usuario_id !== user.id) {
        setMensaje("No tienes permiso para editar esta propiedad");
        setLoading(false);
        return;
      }

      setFormData({
        titulo: propiedad.titulo,
        descripcion: propiedad.descripcion,
        tipo_propiedad: propiedad.tipo,
        ubicacion: propiedad.direccion,
        precio: propiedad.precio,
      });

      // Cargar imágenes existentes
      const { data: imgs, error: errImgs } = await supabase
        .from("imagenes_propiedad")
        .select("id, url")
        .eq("propiedad_id", id);

      if (!errImgs && imgs) {
        setImagenesExistentes(imgs);
      }

      setLoading(false);
    };

    fetchPropiedad();
  }, [id, user.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + imagenesExistentes.length + imagenesNuevas.length > 5) {
      alert("Máximo 5 imágenes por propiedad.");
      return;
    }
    setImagenesNuevas((prev) => [...prev, ...files]);
  };

  const eliminarImagenExistente = async (idImg) => {
    if (!confirm("¿Querés eliminar esta imagen?")) return;

    // Borrar de tabla y storage
    const img = imagenesExistentes.find((i) => i.id === idImg);
    if (!img) return;

    // Extraer el path del URL para borrar del storage
    const urlPath = img.url.split("/").slice(-1)[0];

    const { error: errDeleteStorage } = await supabase.storage
      .from("images")
      .remove([urlPath]);

    if (errDeleteStorage) {
      alert("Error al eliminar la imagen del storage");
      return;
    }

    const { error } = await supabase
      .from("imagenes_propiedad")
      .delete()
      .eq("id", idImg);

    if (error) {
      alert("Error al eliminar la imagen de la base de datos");
      return;
    }

    setImagenesExistentes((prev) => prev.filter((img) => img.id !== idImg));
  };

  const subirImagenesNuevas = async (propId) => {
    const urls = [];

    for (let img of imagenesNuevas) {
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
          propiedad_id: propId,
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

    const { error } = await supabase
      .from("propiedades")
      .update({
        titulo: formData.titulo,
        descripcion: formData.descripcion,
        tipo: formData.tipo_propiedad,
        direccion: formData.ubicacion,
        precio: parseFloat(formData.precio),
      })
      .eq("id", id);

    if (error) {
      setMensaje("Error al actualizar la propiedad");
      setSubiendo(false);
      return;
    }

    await subirImagenesNuevas(id);
    setMensaje("Propiedad actualizada correctamente");
    setSubiendo(false);
    navigate(`/propiedad/${id}`);
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <div className="max-w-xl p-4 mx-auto">
      <h2 className="mb-4 text-xl font-bold">Editar propiedad</h2>

      {mensaje && <p className="mb-2 text-center">{mensaje}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="titulo"
          placeholder="Título"
          value={formData.titulo}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          name="descripcion"
          placeholder="Descripción"
          value={formData.descripcion}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <select
          name="tipo_propiedad"
          value={formData.tipo_propiedad}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="departamento">Departamento</option>
          <option value="casa">Casa</option>
          <option value="habitacion">Habitación</option>
        </select>
        <input
          name="ubicacion"
          placeholder="Ubicación"
          value={formData.ubicacion}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="number"
          name="precio"
          placeholder="Precio"
          value={formData.precio}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <div>
          <p>Imágenes existentes:</p>
          <div className="flex py-2 space-x-2 overflow-x-auto">
            {imagenesExistentes.map((img) => (
              <div key={img.id} className="relative">
                <img src={img.url} alt="Propiedad" className="object-cover w-20 h-20 rounded" />
                <button
                  type="button"
                  onClick={() => eliminarImagenExistente(img.id)}
                  className="absolute top-0 right-0 flex items-center justify-center w-6 h-6 text-white bg-red-600 rounded-full"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block mb-1">Agregar imágenes nuevas (máx 5 total):</label>
          <input type="file" multiple accept="image/*" onChange={handleImageChange} />
        </div>

        <button
          type="submit"
          disabled={subiendo}
          className="px-4 py-2 text-white bg-blue-600 rounded"
        >
          {subiendo ? "Actualizando..." : "Actualizar propiedad"}
        </button>
      </form>
    </div>
  );
};

export default EditarPropiedad;
