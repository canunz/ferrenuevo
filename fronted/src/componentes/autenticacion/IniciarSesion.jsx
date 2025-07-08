// ==========================================
// ARCHIVO: frontend/src/componentes/autenticacion/IniciarSesion.jsx
// ==========================================
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../contexto/ContextoAuth';
import { useNotificacion } from '../../contexto/ContextoNotificacion';
import Cargando from '../comun/Cargando';

const IniciarSesion = () => {
  const navigate = useNavigate();
  const { iniciarSesion, cargando, usuario } = useAuth();
  const { error, exito } = useNotificacion();
  const [mostrarPassword, setMostrarPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: 'admin@ferremas.cl',
      password: 'password123'
    }
  });

  const onSubmit = async (data) => {
    const resultado = await iniciarSesion(data);
    console.log('Resultado login:', resultado);
    if (resultado.exito) {
      exito('¡Bienvenido a FERREMAS!');
      // Redirigir según el rol
      const rol = (usuario?.rol || '').toLowerCase();
      if (rol === 'cliente') {
        navigate('/perfil');
      } else {
        navigate('/tablero');
      }
    } else {
      error(resultado.mensaje || resultado.error || 'Error al iniciar sesión');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      {/* Logo y Título */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4"
        >
          <span className="text-white font-bold text-2xl">F</span>
        </motion.div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Bienvenido
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Inicia sesión en tu cuenta de FERREMAS
        </p>
      </div>

      {/* Formulario */}
      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
          {/* Campo Email */}
          <div className="space-y-1 mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Correo Electrónico
            </label>
            <input
              {...register('email', {
                required: 'El email es requerido',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Email inválido',
                },
              })}
              type="email"
              className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              placeholder="admin@ferremas.cl"
            />
            {errors.email && (
              <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Campo Password */}
          <div className="space-y-1 mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Contraseña
            </label>
            <div className="relative">
              <input
                {...register('password', {
                  required: 'La contraseña es requerida',
                  minLength: {
                    value: 6,
                    message: 'La contraseña debe tener al menos 6 caracteres',
                  },
                })}
                type={mostrarPassword ? 'text' : 'password'}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 pr-10"
                placeholder="password123"
              />
              <button
                type="button"
                onClick={() => setMostrarPassword(!mostrarPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {mostrarPassword ? (
                  <EyeSlashIcon className="w-5 h-5 text-gray-400" />
                ) : (
                  <EyeIcon className="w-5 h-5 text-gray-400" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-600 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Recordar sesión */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <input
                id="recordar"
                type="checkbox"
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="recordar" className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                Recordar sesión
              </label>
            </div>
            <Link
              to="/recuperar-password"
              className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          {/* Credenciales de Demo */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-6">
            <p className="text-xs text-blue-800 dark:text-blue-200 font-medium mb-1">
              Credenciales de Demo:
            </p>
            <p className="text-xs text-blue-700 dark:text-blue-300">
              Email: admin@ferremas.cl<br />
              Contraseña: password123
            </p>
          </div>

          {/* Botón de Login */}
          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            {cargando ? (
              <Cargando tamaño="sm" mensaje="Iniciando sesión..." centrado={false} />
            ) : (
              'Iniciar Sesión'
            )}
          </button>
        </div>
      </motion.form>

      {/* Enlace a registro */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center mt-6"
      >
        <p className="text-gray-600 dark:text-gray-400">
          ¿No tienes una cuenta?{' '}
          <Link
            to="/registrarse"
            className="text-blue-600 hover:text-blue-500 dark:text-blue-400 font-medium"
          >
            Regístrate aquí
          </Link>
        </p>
      </motion.div>
    </motion.div>
  );
};

export default IniciarSesion;