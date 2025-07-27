import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

export default function RegistrarOrganizacion() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    contacto: "",
    ubicacion: "",
    codigo_donacion: "",
    logo: null,
  });

  const [subiendo, setSubiendo] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "logo") {
      setForm({ ...form, logo: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubiendo(true);
    setMensaje("");

    let logo_url = null;

    // Subir el logo si hay archivo
    if (form.logo) {
      const fileExt = form.logo.name.split(".").pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `organizaciones/${fileName}`; // subcarpeta dentro del bucket "productos"

      const { error: uploadError } = await supabase.storage
        .from("productos")
        .upload(filePath, form.logo);

      if (uploadError) {
        setMensaje("❌ Error al subir el logo.");
        setSubiendo(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("productos")
        .getPublicUrl(filePath);

      logo_url = urlData.publicUrl;
    }

    // Insertar organización en la tabla
    const { error } = await supabase.from("organizaciones").insert([
      {
        nombre: form.nombre,
        descripcion: form.descripcion,
        contacto: form.contacto,
        ubicacion: form.ubicacion,
        codigo_donacion: form.codigo_donacion,
        logo_url,
      },
    ]);

    if (error) {
      setMensaje("❌ Hubo un error al registrar la organización.");
    } else {
      setMensaje("✅ Organización registrada con éxito.");
      setTimeout(() => navigate("/donaciones"), 1500);
    }

    setSubiendo(false);
  };

  return (
    <div className="p-4 pb-20">
      <h1 className="mb-4 text-2xl font-bold text-center">Registrar mi organización 🐾</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="nombre"
          type="text"
          required
          placeholder="Nombre de la organización"
          className="w-full p-2 border rounded"
          onChange={handleChange}
        />
        <textarea
          name="descripcion"
          required
          placeholder="Descripción"
          className="w-full p-2 border rounded"
          onChange={handleChange}
        />
        <input
          name="contacto"
          type="text"
          required
          placeholder="Teléfono, WhatsApp, redes sociales"
          className="w-full p-2 border rounded"
          onChange={handleChange}
        />
        <input
          name="ubicacion"
          type="text"
          required
          placeholder="Ubicación"
          className="w-full p-2 border rounded"
          onChange={handleChange}
        />
        <input
          name="codigo_donacion"
          type="text"
          placeholder="Alias, CBU o link de Mercado Pago"
          className="w-full p-2 border rounded"
          onChange={handleChange}
        />
        <div>
          <label className="block mb-1 font-medium">Logo (opcional):</label>
          <input
            type="file"
            name="logo"
            accept="image/*"
            onChange={handleChange}
            className="w-full"
          />
        </div>

        <button
          type="submit"
          disabled={subiendo}
          className="w-full py-2 text-white transition bg-green-600 rounded hover:bg-green-700"
        >
          {subiendo ? "Registrando..." : "Registrar organización"}
        </button>
      </form>

      {mensaje && (
        <p className="mt-4 text-sm text-center text-blue-600">{mensaje}</p>
      )}
    </div>
  );
}
