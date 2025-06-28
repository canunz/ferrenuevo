import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const BannerPromocion = ({ mensaje = "¡10% de descuento con el cupón BIENVENIDO! Envío gratis sobre $50.000 🚚" }) => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 flex items-center bg-gradient-to-r from-pink-500 via-yellow-400 to-orange-400 text-white px-6 py-3 rounded-full shadow-lg animate-fade-in-down min-w-[320px] max-w-[90vw]">
      <span className="font-semibold text-base mr-4 truncate">{mensaje}</span>
      <button
        onClick={() => setVisible(false)}
        className="ml-2 p-1 rounded-full hover:bg-white/20 transition-colors"
        aria-label="Cerrar banner"
      >
        <XMarkIcon className="h-5 w-5 text-white" />
      </button>
    </div>
  );
};

export default BannerPromocion; 