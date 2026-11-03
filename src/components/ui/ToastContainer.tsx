import React from 'react';
import { XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { Toast } from '../../hooks/useToast';

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

const TOAST_CONFIG: Record<string, { icon: React.ReactNode; border: string; progressColor: string; bg: string }> = {
  success: {
    icon: <span className="text-xl animate-confetti flex-shrink-0 mt-0.5" role="img" aria-label="success">🎉</span>,
    border: 'border-l-[3px] border-emerald-500',
    progressColor: 'bg-emerald-500',
    bg: 'bg-white',
  },
  error: {
    icon: <XCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />,
    border: 'border-l-[3px] border-rose-500',
    progressColor: 'bg-rose-500',
    bg: 'bg-white',
  },
  warning: {
    icon: <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />,
    border: 'border-l-[3px] border-amber-500',
    progressColor: 'bg-amber-500',
    bg: 'bg-white',
  },
  info: {
    icon: <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />,
    border: 'border-l-[3px] border-blue-500',
    progressColor: 'bg-blue-500',
    bg: 'bg-white',
  },
};

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-6 right-4 z-[200] flex flex-col gap-2 w-80 pointer-events-none"
      role="region"
      aria-label="Notifications"
      aria-live="polite"
    >
      {toasts.map((toast, idx) => {
        const config = TOAST_CONFIG[toast.type] ?? TOAST_CONFIG.info;
        const duration = toast.duration ?? 4000;

        return (
          <div
            key={toast.id}
            className={`
              ${config.bg} rounded-xl shadow-xl ${config.border}
              border border-[#E6E4DF] overflow-hidden pointer-events-auto
              animate-toast-in flex flex-col
            `}
            style={{
              // Stacked paper effect for multiple toasts
              transform: `translateY(${idx * -2}px) scale(${1 - idx * 0.012})`,
              zIndex: 200 - idx,
              transformOrigin: 'bottom right',
            }}
            role="alert"
          >
            {/* Toast body */}
            <div className="flex items-start gap-3 px-4 py-3">
              {config.icon}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-[#111418] leading-snug">{toast.title}</p>
                {toast.message && (
                  <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">{toast.message}</p>
                )}
              </div>
              <button
                onClick={() => onRemove(toast.id)}
                className="text-gray-300 hover:text-gray-600 transition-colors flex-shrink-0 p-0.5 rounded hover:bg-gray-100"
                aria-label="Dismiss notification"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Auto-dismiss progress bar */}
            <div className="h-0.5 w-full bg-gray-100">
              <div
                className={`h-full ${config.progressColor} animate-toast-progress rounded-full`}
                style={{ '--toast-duration': `${duration}ms` } as React.CSSProperties}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
