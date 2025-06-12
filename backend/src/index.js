const express = require('express');
const app = express();
const path = require('path');
const imagenRoutes = require('./routes/imagenRoutes');

// Middlewares y rutas
app.use('/api/imagenes', imagenRoutes);
app.use('/imagenes', express.static(path.join(__dirname, '../public/imagenes')));

// Middleware 404 (debe ir al final)
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Ruta no encontrada', message: `La ruta ${req.method} ${req.originalUrl} no existe` });
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
}); 