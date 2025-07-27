import { createClient } from '@supabase/supabase-js';
import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';
import url from 'url';
import fetch from 'node-fetch'; // Usamos node-fetch para la solicitud manual

// Configurar Supabase
const supabaseUrl = 'https://zcoekpdxfbnooopsrrec.supabase.co';  // Reemplaza con tu URL de Supabase
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpjb2VrcGR4ZmJub29vcHNycmVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3Njc5MTQsImV4cCI6MjA2NzM0MzkxNH0.8UgV94AW1qep1u__RtWSPJnenmXL2JJ92wJuXQJETVs';  // Reemplaza con tu clave de Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

// Obtener la ruta del directorio actual (usando import.meta.url)
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

// Función para generar y subir códigos QR
const generateAndUploadQRs = async () => {
  const qrs = []; // Para almacenar los datos de los QR generados
  for (let i = 1; i <= 100; i++) {
    const qrText = `codigo-${i}`;
    
    // Generar el código QR
    const qrImage = await QRCode.toDataURL(qrText);

    // Subir la imagen QR a Supabase Storage
    const fileName = `qr-codigo-${i}.png`;
    const filePath = path.join(__dirname, fileName); // Ruta temporal para guardar la imagen localmente

    // Guardar la imagen QR localmente
    const base64Data = qrImage.split(',')[1];
    fs.writeFileSync(filePath, base64Data, 'base64');

    // Subir la imagen a Supabase usando fetch
    const fileStream = fs.createReadStream(filePath);
    
    // Construir la URL de destino para la carga
    const uploadUrl = `${supabaseUrl}/storage/v1/object/public/qr-codes/qrs/${fileName}`;

    // Hacer la solicitud usando fetch
    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/octet-stream',
      },
      body: fileStream,
    });

    if (!response.ok) {
      console.error(`Error al subir el código QR ${i}:`, response.statusText);
      continue;
    }

    // URL del archivo subido
    const qrUrl = response.url;

    // Guardar el código QR en la tabla AdministrarQR
    const { error: dbError } = await supabase
      .from('AdministrarQR')
      .insert([
        {
          qr_code: qrText,
          qr_url: qrUrl, // URL del código QR
          usuario_id: null, // Inicialmente no está asignado a ningún usuario
        },
      ]);

    if (dbError) {
      console.error(`Error al insertar el código QR ${i} en la base de datos:`, dbError.message);
      continue;
    }

    qrs.push({ qrText, qrUrl }); // Almacenar el código QR y la URL
  }

  console.log(`Generados y subidos 100 códigos QR.`);
};

generateAndUploadQRs().catch((err) => console.error('Error generando los códigos QR:', err));
