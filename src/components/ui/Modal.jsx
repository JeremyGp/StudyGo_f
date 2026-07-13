import React from "react";

function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-xl p-6 w-[90%] max-w-md shadow-lg">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        {children}
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}

export default Modal;