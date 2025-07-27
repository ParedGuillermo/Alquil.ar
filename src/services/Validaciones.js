export function validarEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function validarTelefono(telefono) {
  // Valida números con 10-15 dígitos (incluye prefijos internacionales)
  const re = /^\+?\d{10,15}$/;
  return re.test(telefono);
}

export function validarDocumento(documento) {
  // Validación simple: solo números entre 6 y 9 dígitos
  const re = /^\d{6,9}$/;
  return re.test(documento);
}
