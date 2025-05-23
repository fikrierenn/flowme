import React, { useState } from 'react';
import TaskDetail from '../components/TaskDetail';

const FREE_TASK_LIMIT = 20;

export default function Tasks({ tasks, plan }) {
  const [selectedTask, setSelectedTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' veya 'grid'
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'active', 'completed'

  // Görevleri kategorilere ayır
  const categories = [
    {
      id: 1,
      title: 'Bugün',
      tasks: tasks.today || [],
    },
    {
      id: 2,
      title: 'Yaklaşan',
      tasks: tasks.upcoming || [],
    },
  ];

  // Toplam görev sayısı (free limiti için)
  const totalTaskCount = (tasks.today?.length || 0) + (tasks.upcoming?.length || 0);
  const isFreeLimitReached = plan === 'free' && totalTaskCount >= FREE_TASK_LIMIT;

  // Görevleri filtrele
  const filterTasks = (tasks) => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesStatus = filterStatus === 'all' ? true :
        filterStatus === 'completed' ? task.completed :
        !task.completed;
      return matchesSearch && matchesStatus;
    });
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Üst Bar */}
      <div className="sticky top-0 bg-white border-b border-mint z-40">
        <div className="max-w-md mx-auto px-4 py-3">
          {/* Başlık */}
          <h1 className="text-2xl font-bold text-primary mb-3">Görevler</h1>
          {/* Free limit uyarısı */}
          {plan === 'free' && (
            <div className={`mb-3 rounded-xl px-4 py-2 text-sm font-medium ${isFreeLimitReached ? 'bg-red-100 text-red-700' : 'bg-mint/20 text-primary'}`}>
              {isFreeLimitReached
                ? `Ücretsiz planda en fazla ${FREE_TASK_LIMIT} görev ekleyebilirsiniz. Daha fazla görev için Pro'ya yükseltin!`
                : `Ücretsiz planda aylık ${FREE_TASK_LIMIT} görev ekleyebilirsiniz.`}
            </div>
          )}
          {/* Arama */}
          <div className="relative mb-3">
            <input
              type="text"
              placeholder="Görev ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-mint/10 rounded-xl py-2 px-4 pl-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          {/* Filtreler */}
          <div className="flex items-center justify-between gap-2 mb-2">
            {/* Durum Filtreleri */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                  filterStatus === 'all' ? 'bg-primary text-white' : 'bg-mint/10 text-primary'
                }`}
              >
                Tümü
              </button>
              <button
                onClick={() => setFilterStatus('active')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                  filterStatus === 'active' ? 'bg-primary text-white' : 'bg-mint/10 text-primary'
                }`}
              >
                Aktif
              </button>
              <button
                onClick={() => setFilterStatus('completed')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                  filterStatus === 'completed' ? 'bg-primary text-white' : 'bg-mint/10 text-primary'
                }`}
              >
                Tamamlanan
              </button>
            </div>
            {/* Görünüm Değiştirici */}
            <div className="flex items-center gap-1 bg-mint/10 rounded-lg p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white shadow' : ''}`}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#075E54">
                  <path d="M4 6h16M4 12h16M4 18h16" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white shadow' : ''}`}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#075E54">
                  <path d="M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 0h6v6h-6v-6z" strokeWidth="2"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Görev Listesi */}
      <div className="max-w-md mx-auto px-4">
        {categories.map(category => {
          const filteredTasks = filterTasks(category.tasks);
          if (filteredTasks.length === 0) return null;
          return (
            <div key={category.id} className="mt-6">
              <h2 className="text-lg font-bold text-black mb-3">{category.title}</h2>
              <div className={`grid gap-2 ${viewMode === 'grid' ? 'grid-cols-2' : ''}`}>
                {filteredTasks.map(task => (
                  <div
                    key={task.id}
                    onClick={() => setSelectedTask(task)}
                    className={`bg-white rounded-xl border border-mint hover:border-primary/20 transition cursor-pointer ${
                      viewMode === 'grid' ? 'p-3' : 'p-3 flex items-center gap-3'
                    }`}
                  >
                    {viewMode === 'list' && (
                      <div className="w-10 h-10 rounded-xl bg-mint flex items-center justify-center flex-shrink-0">
                        <svg width="24" height="24" fill="none">
                          <path d="M7 12.5L11 16.5L17 9.5" stroke="#075E54" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    )}
                    <div className={viewMode === 'grid' ? 'space-y-2' : 'flex-1'}>
                      <div className="font-semibold text-black">{task.title}</div>
                      <div className="text-sm text-gray-500">{task.datetime}</div>
                      {viewMode === 'grid' && (
                        <div className="text-xs text-primary bg-mint/20 w-fit px-2 py-0.5 rounded-full">
                          {task.category}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      {/* Görev Detay Modalı */}
      {selectedTask && (
        <TaskDetail
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </div>
  );
} 