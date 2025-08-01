const CACHE_NAME = 'al-cache-v1';
const urlsToCache = [
  '/',                  // La página principal
  '/index.html',        // Asegúrate de que index.html esté disponible
  '/favicon.ico',       // Asegúrate de que favicon.ico esté disponible
  '/manifest.json',     // Asegúrate de que manifest.json esté disponible
  '/style.css',         // Asegúrate de que style.css esté disponible
  '/static/js/main.js', // Cambiar /app.js por /static/js/main.js o el archivo adecuado
  // Agrega más archivos si es necesario
];

// Instalación del Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache abierto');
        return cache.addAll(urlsToCache);  // Asegúrate de que todos los archivos estén disponibles
      })
      .catch((error) => {
        console.error('Error al cachear archivos:', error);  // Agregar manejo de errores
      })
  );
});

// Responder las solicitudes con los archivos cacheados o desde la red
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);  // Si no está en cache, lo busca en la red
    })
  );
});

// Activación del Service Worker
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);  // Elimina los caches antiguos
          }
        })
      );
    })
  );
});
