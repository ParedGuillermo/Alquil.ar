import { supabase } from "../supabaseClient";

export async function obtenerPropiedades(filtros = {}) {
  let query = supabase.from("propiedades").select("*");

  if (filtros.ciudad) {
    query = query.ilike("ciudad", `%${filtros.ciudad}%`);
  }
  if (filtros.precioMax) {
    query = query.lte("precio_alquiler", filtros.precioMax);
  }
  if (filtros.tipoUsuario) {
    query = query.eq("tipo_usuario", filtros.tipoUsuario);
  }

  const { data, error } = await query.order("fecha_publicacion", { ascending: false });

  if (error) {
    throw error;
  }
  return data;
}

export async function crearPropiedad(propiedad) {
  const { data, error } = await supabase.from("propiedades").insert([propiedad]);
  if (error) throw error;
  return data;
}

export async function eliminarPropiedad(id) {
  const { data, error } = await supabase.from("propiedades").delete().eq("id", id);
  if (error) throw error;
  return data;
}

// Podés agregar más funciones según necesidad: actualizar, obtener mensajes, etc.
