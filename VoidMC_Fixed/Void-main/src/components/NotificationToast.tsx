import React, { useEffect } from 'react';
import { Bell, CheckCircle2, AlertTriangle, X } from 'lucide-react';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'info' | 'success';
}

interface NotificationToastProps {
  notifications: NotificationItem[];
  onDismiss: (id: string) => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ notifications, onDismiss }) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {notifications.map((n) => (
        <div
          key={n.id}
          className="pointer-events-auto p-4 rounded-2xl bg-[#140B24]/95 border border-purple-600/60 shadow-[0_0_30px_rgba(168,85,247,0.35)] backdrop-blur-md flex items-start gap-3 transition-all animate-in slide-in-from-bottom-2 duration-200"
        >
          <div className="p-2 rounded-xl bg-purple-950/80 border border-purple-500/40 text-purple-400 shrink-0">
            {n.type === 'order' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
            {n.type === 'info' && <Bell className="w-5 h-5 text-purple-300" />}
            {n.type === 'success' && <CheckCircle2 className="w-5 h-5 text-purple-300" />}
          </div>

          <div className="flex-1">
            <h4 className="text-xs font-bold text-white font-heading">{n.title}</h4>
            <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">{n.message}</p>
          </div>

          <button
            onClick={() => onDismiss(n.id)}
            className="text-slate-400 hover:text-white p-1 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
