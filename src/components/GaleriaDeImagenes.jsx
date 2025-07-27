const GaleriaDeImagenes = ({ imagenes }) => {
  if (!imagenes || imagenes.length === 0) {
    return <p className="text-center text-gray-500">No hay imágenes disponibles</p>;
  }

  return (
    <div className="flex py-2 space-x-2 overflow-x-auto">
      {imagenes.map((img, idx) => (
        <img
          key={idx}
          src={img.url || img}
          alt={`Imagen ${idx + 1}`}
          className="flex-shrink-0 object-cover w-40 h-40 rounded"
          loading="lazy"
        />
      ))}
    </div>
  );
};

export default GaleriaDeImagenes;
