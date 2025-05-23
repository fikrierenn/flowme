import React from 'react';

export default function TaskDetail({ task, onClose, onToggleComplete }) {
  if (!task) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-t-2xl p-4 animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-primary">Görev Detayı</h2>
          <button onClick={onClose} className="p-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#075E54" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {/* Başlık */}
          <div>
            <h3 className="text-lg font-semibold text-black">{task.title}</h3>
            <p className="text-gray-500">{task.datetime}</p>
          </div>

          {/* Durum */}
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${task.completed ? 'bg-accent' : 'bg-primary'}`}></div>
            <span className="text-sm font-medium text-gray-600">
              {task.completed ? 'Tamamlandı' : 'Devam Ediyor'}
            </span>
          </div>

          {/* Açıklama */}
          <div>
            <p className="text-gray-600">{task.description || 'Açıklama eklenmemiş'}</p>
          </div>

          {/* Tamamla/Geri Al Butonu */}
          <div className="flex gap-2 pt-4">
            <button 
              className={`flex-1 ${task.completed ? 'bg-gray-300 text-gray-600' : 'bg-primary text-white'} py-2 rounded-xl font-medium hover:bg-accent transition`}
              onClick={() => onToggleComplete && onToggleComplete(task.id)}
            >
              {task.completed ? 'Geri Al' : 'Tamamla'}
            </button>
            <button 
              className="flex-1 border-2 border-primary text-primary py-2 rounded-xl font-medium hover:bg-mint/20 transition"
              onClick={() => console.log('Sil')}
            >
              Sil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 