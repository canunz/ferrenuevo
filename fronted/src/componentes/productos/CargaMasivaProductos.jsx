import React, { useState } from 'react';
import axios from 'axios';

const CargaMasivaProductos = () => {
  const [archivo, setArchivo] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const handleArchivoChange = (e) => {
    setArchivo(e.target.files[0]);
    setResultado(null);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!archivo) {
      setError('Debes seleccionar un archivo CSV.');
      return;
    }
    setCargando(true);
    setResultado(null);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('archivo', archivo);
      const response = await axios.post(
        '/api/v1/productos/carga-masiva',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      setResultado(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cargar productos');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Carga Masiva de Productos</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept=".csv"
          onChange={handleArchivoChange}
          className="mb-4"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={cargando}
        >
          {cargando ? 'Cargando...' : 'Subir CSV'}
        </button>
      </form>
      {error && <div className="mt-4 text-red-600">{error}</div>}
      {resultado && (
        <div className="mt-4">
          <h3 className="font-semibold">Resultado:</h3>
          <p>Productos cargados: {resultado.cargados}</p>
          {resultado.errores && resultado.errores.length > 0 && (
            <div>
              <p className="text-red-600 font-semibold">Errores:</p>
              <ul className="list-disc ml-6">
                {resultado.errores.map((err, idx) => (
                  <li key={idx}>{err.producto}: {err.error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      <div className="mt-6 text-sm text-gray-500">
        <p><b>Formato CSV esperado:</b></p>
        <pre className="bg-gray-100 p-2 rounded">
{`nombre,codigo,categoria,marca,precio,stock,descripcion
Lijadora Orbital Makita,MAK-001,Herramientas Eléctricas,Makita,45990,10,Lijadora profesional
Martillo Stanley 16oz,STA-002,Herramientas Manuales,Stanley,15990,25,Martillo de acero
`}
        </pre>
      </div>
    </div>
  );
};

export default CargaMasivaProductos; 