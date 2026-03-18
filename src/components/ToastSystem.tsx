import React from 'react';
import { useApp } from '@/contexts/AppContext';
import { X } from 'lucide-react';

const ToastSystem: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          <span>{t.message}</span>
          {t.undoFn && (
            <button
              onClick={() => { t.undoFn!(); removeToast(t.id); }}
              style={{ fontWeight: 700, textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontSize: '0.875rem' }}
            >
              Undo
            </button>
          )}
          <button onClick={() => removeToast(t.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', display: 'flex', alignItems: 'center' }}>
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastSystem;
