import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const estados = ["disponible", "agotado", "descontinuado"];

export default function CargarProducto() {
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    categoria: "",
    estado: "disponible",
    foto: null,
    foto_url: null,
  });

  const [productos, setProductos] = useState([]);
  const [editando, setEditando] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const [busqueda, setBusqueda] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");

  const sanitizeFileName = (name) =>
    name.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9._-]/g, "");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "foto") {
      setForm((prev) => ({ ...prev, foto: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const fetchProductos = async () => {
    const { data, error } = await supabase
      .from("productos")
      .select("*")
      .order("id", { ascending: false });
    if (error) console.log("Error al cargar productos", error.message);
    else setProductos(data);
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);
    let foto_url = form.foto_url || null;

    try {
      if (form.foto) {
        setUploadingImage(true);
        const fileName = `${Date.now()}_${sanitizeFileName(form.foto.name)}`;
        const { error: uploadError } = await supabase.storage
          .from("productos")
          .upload(`fotos/${fileName}`, form.foto);

        setUploadingImage(false);

        if (uploadError) throw new Error("Error al subir imagen: " + uploadError.message);

        const { data } = supabase.storage
          .from("productos")
          .getPublicUrl(`fotos/${fileName}`);
        foto_url = data.publicUrl;
      }

      const precio = form.precio ? parseFloat(form.precio) : null;
      const stock = form.stock ? parseInt(form.stock) : 0;

      if (!form.nombre.trim()) throw new Error("El nombre es obligatorio.");
      if (precio != null && (isNaN(precio) || precio < 0)) throw new Error("Precio inválido.");
      if (isNaN(stock) || stock < 0) throw new Error("Stock inválido.");
      if (!estados.includes(form.estado)) throw new Error("Estado inválido.");

      const producto = {
        nombre: form.nombre.trim(),
        descripcion: form.descripcion.trim() || null,
        precio,
        stock,
        categoria: form.categoria.trim() || null,
        estado: form.estado,
        foto_url,
      };

      if (editando) {
        const { error: updateError } = await supabase
          .from("productos")
          .update(producto)
          .eq("id", editando);

        if (updateError) throw new Error("Error al actualizar: " + updateError.message);
        setSuccessMsg("Producto actualizado correctamente.");
      } else {
        const { error: insertError } = await supabase.from("productos").insert(producto);
        if (insertError) throw new Error("Error al guardar: " + insertError.message);
        setSuccessMsg("Producto creado correctamente.");
      }

      setForm({
        nombre: "",
        descripcion: "",
        precio: "",
        stock: "",
        categoria: "",
        estado: "disponible",
        foto: null,
        foto_url: null,
      });
      setEditando(null);
      fetchProductos();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setUploadingImage(false);
    }
  };

  const handleEdit = (producto) => {
    setEditando(producto.id);
    setForm({
      nombre: producto.nombre || "",
      descripcion: producto.descripcion || "",
      precio: producto.precio?.toString() || "",
      stock: producto.stock?.toString() || "",
      categoria: producto.categoria || "",
      estado: producto.estado || "disponible",
      foto: null,
      foto_url: producto.foto_url || null,
    });
  };

  const handleDelete = async (id) => {
    if (loading) return;
    if (confirm("¿Seguro que querés eliminar este producto?")) {
      const { error } = await supabase.from("productos").delete().eq("id", id);
      if (!error) fetchProductos();
      else alert("Error al borrar: " + error.message);
    }
  };

  const productosFiltrados = productos.filter((p) => {
    const coincideNombre = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria = filtroCategoria ? p.categoria === filtroCategoria : true;
    const coincideEstado = filtroEstado ? p.estado === filtroEstado : true;
    return coincideNombre && coincideCategoria && coincideEstado;
  });

  return (
    <div className="max-w-4xl p-6 mx-auto mt-6 bg-white rounded shadow">
      <h2 className="mb-4 text-2xl font-bold">
        {editando ? "Editar Producto" : "Cargar Producto"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="nombre"
          placeholder="Nombre *"
          value={form.nombre}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          name="descripcion"
          placeholder="Descripción"
          value={form.descripcion}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          name="precio"
          placeholder="Precio"
          value={form.precio}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          min="0"
          step="0.01"
        />
        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={form.stock}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          min="0"
        />
        <input
          type="text"
          name="categoria"
          placeholder="Categoría"
          value={form.categoria}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <select
          name="estado"
          value={form.estado}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          {estados.map((e) => (
            <option key={e} value={e}>
              {e.charAt(0).toUpperCase() + e.slice(1)}
            </option>
          ))}
        </select>

        {/* Campo oculto para mantener foto_url al editar sin cambiar foto */}
        <input type="hidden" name="foto_url" value={form.foto_url || ""} />

        <input
          type="file"
          name="foto"
          accept="image/*"
          onChange={handleChange}
          className="w-full"
        />

        {uploadingImage && <p className="text-blue-600">Subiendo imagen...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {successMsg && <p className="text-green-600">{successMsg}</p>}

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading || uploadingImage}
            className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            {loading ? "Guardando..." : editando ? "Actualizar" : "Guardar Producto"}
          </button>
          {editando && (
            <button
              type="button"
              onClick={() => {
                setEditando(null);
                setForm({
                  nombre: "",
                  descripcion: "",
                  precio: "",
                  stock: "",
                  categoria: "",
                  estado: "disponible",
                  foto: null,
                  foto_url: null,
                });
              }}
              className="px-4 py-2 text-white bg-gray-500 rounded hover:bg-gray-600"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <hr className="my-6" />

      <h3 className="mb-4 text-xl font-semibold">Productos existentes</h3>

      {/* Filtros */}
      <div className="flex flex-col gap-4 mb-6 md:flex-row">
        <input
          type="text"
          placeholder="🔍 Buscar por nombre..."
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full p-2 border rounded md:w-1/3"
        />
        <select
          onChange={(e) => setFiltroCategoria(e.target.value)}
          className="w-full p-2 border rounded md:w-1/3"
          value={filtroCategoria}
        >
          <option value="">Todas las categorías</option>
          {[...new Set(productos.map((p) => p.categoria).filter(Boolean))].map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <select
          onChange={(e) => setFiltroEstado(e.target.value)}
          className="w-full p-2 border rounded md:w-1/3"
          value={filtroEstado}
        >
          <option value="">Todos los estados</option>
          {estados.map((e) => (
            <option key={e} value={e}>
              {e.charAt(0).toUpperCase() + e.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4">
        {productosFiltrados.map((p) => (
          <div key={p.id} className="flex gap-4 p-4 border rounded">
            {p.foto_url && (
              <img
                src={p.foto_url}
                alt={p.nombre}
                className="object-cover w-24 h-24 rounded"
                loading="lazy"
              />
            )}
            <div className="flex-1">
              <h4 className="text-lg font-bold">{p.nombre}</h4>
              <p className="text-sm text-gray-600">{p.descripcion}</p>
              <p className="text-sm">💰 ${p.precio}</p>
              <p className="text-sm">📦 Stock: {p.stock}</p>
              <p className="text-sm">📂 Categoría: {p.categoria}</p>
              <p className="text-sm">📌 Estado: {p.estado}</p>

              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleEdit(p)}
                  className="px-3 py-1 text-white bg-yellow-500 rounded"
                  disabled={loading}
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="px-3 py-1 text-white bg-red-600 rounded"
                  disabled={loading}
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
        {productosFiltrados.length === 0 && (
          <p className="text-center text-gray-500">No hay productos que coincidan.</p>
        )}
      </div>
    </div>
  );
}
