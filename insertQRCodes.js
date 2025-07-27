import { createClient } from '@supabase/supabase-js';

// Configura tu URL y la clave de Supabase
const supabaseUrl = 'https://zcoekpdxfbnooopsrrec.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpjb2VrcGR4ZmJub29vcHNycmVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3Njc5MTQsImV4cCI6MjA2NzM0MzkxNH0.8UgV94AW1qep1u__RtWSPJnenmXL2JJ92wJuXQJETVs';
const supabase = createClient(supabaseUrl, supabaseKey);

const fetchAndInsertQRs = async () => {
  try {
    // Obtener los archivos del bucket
    const { data, error } = await supabase
      .storage
      .from('qr-codes')  // El nombre de tu bucket
      .list('qrs', { limit: 100 });  // Lista los archivos dentro del directorio 'qrs' en el bucket

    if (error) {
      console.error('Error al cargar los códigos QR del bucket:', error.message);
      return;
    }

    // Iterar sobre los archivos para obtener las URLs públicas y agregarlas a la tabla
    const qrRecords = [];
    for (const file of data) {
      const { publicURL, error: urlError } = supabase
        .storage
        .from('qr-codes')  // El nombre de tu bucket
        .getPublicUrl(`qrs/${file.name}`); // Generar la URL pública del archivo

      if (urlError) {
        console.error('Error al obtener URL pública:', urlError.message);
        continue;
      }

      // Crear los registros para la tabla AdministrarQR
      qrRecords.push({
        codigo: `codigo-${file.name.split('.')[0]}`,  // Generar un código único basado en el nombre del archivo
        qr_url: publicURL,  // La URL pública del archivo
        asignado: false,  // Establecer asignado como falso por defecto
      });
    }

    // Insertar los registros en la tabla AdministrarQR
    const { error: insertError } = await supabase
      .from('AdministrarQR')
      .upsert(qrRecords);  // Usamos upsert para insertar o actualizar los registros

    if (insertError) {
      console.error('Error al insertar los códigos QR en la tabla:', insertError.message);
      return;
    }

    console.log(`Se han insertado ${qrRecords.length} códigos QR en la tabla AdministrarQR.`);
  } catch (err) {
    console.error('Error al cargar los códigos QR:', err.message);
  }
};

// Llamar a la función para insertar los códigos QR
fetchAndInsertQRs();
