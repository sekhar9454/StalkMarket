import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { HiCheckCircle, HiXCircle, HiInformationCircle, HiX } from 'react-icons/hi';

let toastId = 0;
let addToastFn = null;

export const toast = {
  success: (message) => addToastFn?.({ type: 'success', message }),
  error: (message) => addToastFn?.({ type: 'error', message }),
  info: (message) => addToastFn?.({ type: 'info', message }),
};

const icons = {
  success: HiCheckCircle,
  error: HiXCircle,
  info: HiInformationCircle,
};

const styles = {
  success: 'border-gain/30 bg-gain/10',
  error: 'border-loss/30 bg-loss/10',
  info: 'border-accent-cyan/30 bg-accent-cyan/10',
};

const iconColors = {
  success: 'text-gain',
  error: 'text-loss',
  info: 'text-accent-cyan',
};

const ToastItem = ({ toast: t, onRemove }) => {
  const Icon = icons[t.type];

  useEffect(() => {
    const timer = setTimeout(() => onRemove(t.id), 4000);
    return () => clearTimeout(timer);
  }, [t.id, onRemove]);

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl shadow-2xl animate-slide-down ${styles[t.type]}`}
    >
      <Icon className={`w-5 h-5 flex-shrink-0 ${iconColors[t.type]}`} />
      <p className="text-sm text-white font-medium flex-1">{t.message}</p>
      <button
        onClick={() => onRemove(t.id)}
        className="text-gray-400 hover:text-white transition-colors"
      >
        <HiX className="w-4 h-4" />
      </button>
    </div>
  );
};

const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    addToastFn = ({ type, message }) => {
      const id = ++toastId;
      setToasts((prev) => [...prev, { id, type, message }]);
    };
    return () => {
      addToastFn = null;
    };
  }, []);

  return createPortal(
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 w-full max-w-sm">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onRemove={removeToast} />
      ))}
    </div>,
    document.body
  );
};

export default ToastContainer;
