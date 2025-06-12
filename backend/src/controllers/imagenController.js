const fs = require('fs').promises;
const path = require('path');

const imagenController = {
  // Obtener lista de imágenes disponibles
  obtenerImagenes: async (req, res) => {
    try {
      const directorioImagenes = path.join(__dirname, '../../fronted/src/assets/imagenes/productos');
      const archivos = await fs.readdir(directorioImagenes);
      const imagenes = archivos.filter(archivo => 
        /\.(jpg|jpeg|png|gif)$/i.test(archivo)
      );
      res.json(imagenes);
    } catch (error) {
      console.error('Error al obtener imágenes:', error);
      res.status(500).json({ mensaje: 'Error al obtener las imágenes' });
    }
  },

  // Servir una imagen específica
  servirImagen: async (req, res) => {
    try {
      const { nombre } = req.params;
      const rutaImagen = path.join(__dirname, '../../fronted/src/assets/imagenes/productos', nombre);
      
      // Verificar si la imagen existe
      try {
        await fs.access(rutaImagen);
      } catch {
        return res.status(404).json({ mensaje: 'Imagen no encontrada' });
      }

      res.sendFile(rutaImagen);
    } catch (error) {
      console.error('Error al servir imagen:', error);
      res.status(500).json({ mensaje: 'Error al servir la imagen' });
    }
  }
};

module.exports = imagenController; 