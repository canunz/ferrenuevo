// ==========================================
// ARCHIVO: frontend/src/componentes/autenticacion/Registrarse.jsx
// ==========================================
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../contexto/ContextoAuth';
import { useNotificacion } from '../../contexto/ContextoNotificacion';
import Cargando from '../comun/Cargando';

const Registrarse = () => {
  const navigate = useNavigate();
  const { registrarse, cargando } = useAuth();
  const { error, exito } = useNotificacion();
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mostrarConfirmPassword, setMostrarConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const watchPassword = watch('password');

  const onSubmit = async (data) => {
    const resultado = await registrarse(data);
    if (resultado.exito) {
      exito('¡Cuenta creada exitosamente! Bienvenido a FERREMAS');
      navigate('/tablero');
    } else {
      error(resultado.mensaje || 'Error al crear la cuenta');
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
          Crear Cuenta
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Únete a FERREMAS hoy mismo
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
          {/* Campo Nombre */}
          <div className="space-y-1 mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Nombre Completo
            </label>
            <input
              {...register('nombre', {
                required: 'El nombre es requerido',
                minLength: {
                  value: 2,
                  message: 'El nombre debe tener al menos 2 caracteres',
                },
              })}
              type="text"
              className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              placeholder="Juan Pérez"
            />
            {errors.nombre && (
              <p className="text-red-600 text-xs mt-1">{errors.nombre.message}</p>
            )}
          </div>

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
              placeholder="juan@ejemplo.com"
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
                placeholder="••••••••"
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

          {/* Campo Confirmar Password */}
          <div className="space-y-1 mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Confirmar Contraseña
            </label>
            <div className="relative">
              <input
                {...register('confirmar_password', {
                  required: 'Confirma tu contraseña',
                  validate: value =>
                    value === watchPassword || 'Las contraseñas no coinciden',
                })}
                type={mostrarConfirmPassword ? 'text' : 'password'}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 pr-10"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setMostrarConfirmPassword(!mostrarConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {mostrarConfirmPassword ? (
                  <EyeSlashIcon className="w-5 h-5 text-gray-400" />
                ) : (
                  <EyeIcon className="w-5 h-5 text-gray-400" />
                )}
              </button>
            </div>
            {errors.confirmar_password && (
              <p className="text-red-600 text-xs mt-1">{errors.confirmar_password.message}</p>
            )}
          </div>

          {/* Términos y Condiciones */}
          <div className="flex items-center mb-6">
            <input
              {...register('terminos', {
                required: 'Debes aceptar los términos y condiciones',
              })}
              id="terminos"
              type="checkbox"
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="terminos" className="ml-2 text-sm text-gray-600 dark:text-gray-400">
              Acepto los{' '}
              <Link to="/terminos" className="text-blue-600 hover:text-blue-500">
                términos y condiciones
              </Link>{' '}
              y la{' '}
              <Link to="/privacidad" className="text-blue-600 hover:text-blue-500">
                política de privacidad
              </Link>
            </label>
          </div>
          {errors.terminos && (
            <p className="text-red-600 text-xs mt-1">{errors.terminos.message}</p>
          )}

          {/* Botón de Registro */}
          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            {cargando ? (
              <Cargando tamaño="sm" mensaje="Creando cuenta..." centrado={false} />
            ) : (
              'Crear Cuenta'
            )}
          </button>
        </div>
      </motion.form>

      {/* Enlace a login */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center mt-6"
      >
        <p className="text-gray-600 dark:text-gray-400">
          ¿Ya tienes una cuenta?{' '}
          <Link
            to="/iniciar-sesion"
            className="text-blue-600 hover:text-blue-500 dark:text-blue-400 font-medium"
          >
            Inicia sesión aquí
          </Link>
        </p>
      </motion.div>
    </motion.div>
  );
};

export default Registrarse;