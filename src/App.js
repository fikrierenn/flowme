import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import TaskDetail from "./components/TaskDetail";
import Tasks from "./pages/Tasks";
import NewTaskModal from "./components/NewTaskModal";
import { getTasks, toggleTaskComplete as toggleTaskAPI, addTask as addTaskAPI, deleteTask } from "./utils/taskService";
import Calendar from "./pages/Calendar";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ResetPassword from "./pages/ResetPassword";
import { supabase } from "./utils/supabaseClient";

export default function App() {
  const [selectedTask, setSelectedTask] = useState(null);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [activePage, setActivePage] = useState('home');
  const [tasks, setTasks] = useState({ today: [], upcoming: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [plan, setPlan] = useState('free'); // 'free' veya 'pro'
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [chatStyle, setChatStyle] = useState('samimi');

  // Supabase login kontrolü
  useEffect(() => {
    let mounted = true;
    async function checkUser() {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
      } else {
        setUser(null);
      }
      setLoading(false);
    }
    checkUser();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setUser(session?.user ?? null);
      }
    });
    return () => {
      mounted = false;
      listener?.subscription?.unsubscribe?.();
    };
  }, []);

  // Görevleri Supabase'den yükle
  useEffect(() => {
    if (user) loadTasks();
    // eslint-disable-next-line
  }, [user]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const allTasks = await getTasks(user.id);
      const today = new Date().toISOString().split('T')[0];
      const categorizedTasks = allTasks.reduce((acc, task) => {
        const taskDate = task.datetime?.split('T')[0];
        if (taskDate === today || !taskDate) {
          acc.today.push(task);
        } else {
          acc.upcoming.push(task);
        }
        return acc;
      }, { today: [], upcoming: [] });
      setTasks(categorizedTasks);
    } catch (err) {
      setError('Görevler yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleTaskClick = (task) => setSelectedTask(task);
  const handleNewTask = async (newTask) => {
    try {
      // newTask zaten kaydedilmiş olarak geliyor (NewTaskModal'dan)
      // Eğer dizi ise hepsini ekle, değilse tek kaydı ekle
      const tasksToAdd = Array.isArray(newTask) ? newTask : [newTask];
      setTasks(prevTasks => {
        const newTasks = { ...prevTasks };
        tasksToAdd.forEach(savedTask => {
          const today = new Date().toISOString().split('T')[0];
          const taskDate = savedTask.datetime.split(' ')[0];
          if (taskDate === today || savedTask.datetime === 'Tarih seçilmedi') {
            newTasks.today = [...newTasks.today, savedTask];
          } else {
            newTasks.upcoming = [...newTasks.upcoming, savedTask];
          }
        });
        return newTasks;
      });
      setShowNewTaskModal(false);
    } catch (err) {
      setError('Görev eklenirken bir hata oluştu.');
    }
  };
  const toggleTaskComplete = async (taskId) => {
    try {
      let task;
      ['today', 'upcoming'].forEach(list => {
        const found = tasks[list].find(t => t.id === taskId);
        if (found) task = found;
      });
      if (!task) return;
      const updatedTask = await toggleTaskAPI(taskId, !task.completed);
      setTasks(prevTasks => {
        const newTasks = { ...prevTasks };
        ['today', 'upcoming'].forEach(list => {
          const taskIndex = newTasks[list].findIndex(t => t.id === taskId);
          if (taskIndex !== -1) {
            newTasks[list] = [...newTasks[list]];
            newTasks[list][taskIndex] = updatedTask;
          }
        });
        return newTasks;
      });
    } catch (err) {
      alert('Görev güncellenirken bir hata oluştu.');
    }
  };

  // Görev silme fonksiyonu
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Bu görevi silmek istediğinize emin misiniz?')) return;
    try {
      await deleteTask(taskId);
      setTasks(prevTasks => {
        const newTasks = { ...prevTasks };
        newTasks.today = newTasks.today.filter(t => t.id !== taskId);
        newTasks.upcoming = newTasks.upcoming.filter(t => t.id !== taskId);
        return newTasks;
      });
    } catch (err) {
      setError('Görev silinirken bir hata oluştu.');
    }
  };

  // Çıkış işlemi
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate('/login');
  };

  // Alt menülü ana uygulama
  const renderMainApp = () => (
    <div className="min-h-screen bg-white pb-20">
      {/* Sayfa içeriği */}
      <div className="max-w-md mx-auto px-4 pt-6">
        {activePage === 'home' && (
          <>
            <div className="w-full text-3xl font-bold text-black mb-4">Merhaba, {user?.email?.split('@')[0] || 'Kullanıcı'}</div>
            <div className="w-full bg-mint/10 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Günlük İlerleme</span>
                <span className="text-sm font-bold text-primary">
                  {tasks.today.filter(t => t.completed).length}/{tasks.today.length}
                </span>
              </div>
              <div className="w-full h-2 bg-mint rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${(tasks.today.filter(t => t.completed).length / (tasks.today.length || 1)) * 100}%` }}
                />
              </div>
            </div>
            <button 
              onClick={() => setShowNewTaskModal(true)}
              className="w-full bg-primary text-white text-lg font-semibold rounded-xl py-3 mb-6 shadow hover:bg-accent transition"
            >
              + Yeni Görev
            </button>
            <div className="w-full mb-2 text-lg font-bold text-black">Bugün</div>
            <div className="w-full flex flex-col gap-2 mb-4">
              {tasks.today.map(task => (
                <div 
                  key={task.id}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-mint/10 transition cursor-pointer"
                >
                  <button 
                    onClick={() => toggleTaskComplete(task.id)}
                    className="w-10 h-10 rounded-xl bg-mint flex items-center justify-center flex-shrink-0 transition hover:bg-mint/80"
                  >
                    <svg width="24" height="24" fill="none">
                      <path 
                        d="M7 12.5L11 16.5L17 9.5" 
                        stroke={task.completed ? "#25D366" : "#075E54"} 
                        strokeWidth="2.5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  {/* Sil butonu */}
                  <button
                    onClick={e => { e.stopPropagation(); handleDeleteTask(task.id); }}
                    className="w-8 h-8 flex items-center justify-center rounded hover:bg-red-100 ml-2"
                    title="Görevi Sil"
                  >
                    <svg width="20" height="20" fill="none" stroke="#E53935" strokeWidth="2"><path d="M6 6l8 8M6 14L14 6"/></svg>
                  </button>
                  <div 
                    className="flex-1"
                    onClick={() => handleTaskClick(task)}
                  >
                    <div className="font-semibold text-lg text-black">{task.title}</div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">
                        {task.datetime}
                        {task.relative_date && <span className="text-xs ml-1 text-gray-400">({task.relative_date})</span>}
                      </span>
                      <span className="text-xs text-primary bg-mint/20 px-2 py-0.5 rounded-full">
                        {task.category}
                      </span>
                      {task.is_recurring && (
                        <span className="text-xs text-accent bg-mint/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 12a9 9 0 1 0 9-9 9 9 0 0 0-9 9z"/>
                            <path d="M12 7v5l3 3"/>
                          </svg>
                          {task.recurrence_type === 'yearly' ? 'Yıllık' : task.recurrence_type === 'monthly' ? 'Aylık' : 'Tekrarlı'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Yaklaşan Görevler */}
            <div className="w-full mb-2 text-lg font-bold text-black">Yaklaşan Görevler</div>
            <div className="w-full flex flex-col gap-2 mb-4">
              {tasks.upcoming.length === 0 ? (
                <div className="text-gray-400 text-sm">Yaklaşan görev yok.</div>
              ) : (
                tasks.upcoming.map(task => (
                  <div 
                    key={task.id}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-mint/10 transition cursor-pointer"
                  >
                    <button 
                      onClick={() => toggleTaskComplete(task.id)}
                      className="w-10 h-10 rounded-xl bg-mint flex items-center justify-center flex-shrink-0 transition hover:bg-mint/80"
                    >
                      <svg width="24" height="24" fill="none">
                        <path 
                          d="M7 12.5L11 16.5L17 9.5" 
                          stroke={task.completed ? "#25D366" : "#075E54"} 
                          strokeWidth="2.5" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                    {/* Sil butonu */}
                    <button
                      onClick={e => { e.stopPropagation(); handleDeleteTask(task.id); }}
                      className="w-8 h-8 flex items-center justify-center rounded hover:bg-red-100 ml-2"
                      title="Görevi Sil"
                    >
                      <svg width="20" height="20" fill="none" stroke="#E53935" strokeWidth="2"><path d="M6 6l8 8M6 14L14 6"/></svg>
                    </button>
                    <div 
                      className="flex-1"
                      onClick={() => handleTaskClick(task)}
                    >
                      <div className="font-semibold text-lg text-black">{task.title}</div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">
                          {task.datetime}
                          {task.relative_date && <span className="text-xs ml-1 text-gray-400">({task.relative_date})</span>}
                        </span>
                        <span className="text-xs text-primary bg-mint/20 px-2 py-0.5 rounded-full">
                          {task.category}
                        </span>
                        {task.is_recurring && (
                          <span className="text-xs text-accent bg-mint/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M3 12a9 9 0 1 0 9-9 9 9 0 0 0-9 9z"/>
                              <path d="M12 7v5l3 3"/>
                            </svg>
                            {task.recurrence_type === 'yearly' ? 'Yıllık' : task.recurrence_type === 'monthly' ? 'Aylık' : 'Tekrarlı'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
        {activePage === 'tasks' && <Tasks tasks={tasks} plan={plan} />}
        {activePage === 'calendar' && <Calendar onTaskClick={handleTaskClick} userId={user.id} />}
        {activePage === 'settings' && <Settings plan={plan} setPlan={setPlan} onLogout={handleLogout} email={user?.email} chatStyle={chatStyle} setChatStyle={setChatStyle} />}
      </div>
      {/* Yeni Görev Modalı */}
      {showNewTaskModal && (
        <NewTaskModal onClose={() => setShowNewTaskModal(false)} onSave={handleNewTask} user={user} chatStyle={chatStyle} />
      )}
      {/* Görev Detay Modalı */}
      {selectedTask && (
        <TaskDetail task={selectedTask} onClose={() => setSelectedTask(null)} />
      )}
      {/* Alt Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-mint shadow z-50">
        <div className="max-w-md mx-auto flex justify-between items-center px-6 py-2">
          <button onClick={() => setActivePage('home')} className={`flex flex-col items-center gap-1 ${activePage === 'home' ? 'text-primary' : 'text-gray-400'}`}> <svg width="26" height="26" fill="none"><path d="M3 12.5L13 4l10 8.5V21a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-8.5Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg> <span className="text-xs">Ana</span></button>
          <button onClick={() => setActivePage('tasks')} className={`flex flex-col items-center gap-1 ${activePage === 'tasks' ? 'text-primary' : 'text-gray-400'}`}> <svg width="26" height="26" fill="none"><path d="M7 12.5L11 16.5L17 9.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/><rect x="3" y="5" width="18" height="16" rx="4" stroke="currentColor" strokeWidth="2"/></svg> <span className="text-xs">Görevler</span></button>
          <button onClick={() => setActivePage('calendar')} className={`flex flex-col items-center gap-1 ${activePage === 'calendar' ? 'text-primary' : 'text-gray-400'}`}> <svg width="26" height="26" fill="none"><rect x="3" y="5" width="18" height="16" rx="4" stroke="currentColor" strokeWidth="2"/><path d="M8 3v4M18 3v4M3 9h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg> <span className="text-xs">Takvim</span></button>
          <button onClick={() => setActivePage('settings')} className={`flex flex-col items-center gap-1 ${activePage === 'settings' ? 'text-primary' : 'text-gray-400'}`}> <svg width="26" height="26" fill="none"><circle cx="13" cy="13" r="4" stroke="currentColor" strokeWidth="2"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.65 1.65 0 0 0 15 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 6.6 15a1.65 1.65 0 0 0-1.82-.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 11a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 6.6a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 11c.14.22.22.47.22.73s-.08.51-.22.73Z" stroke="currentColor" strokeWidth="2"/></svg> <span className="text-xs">Ayarlar</span></button>
        </div>
      </nav>
    </div>
  );

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-primary font-title text-xl">Yükleniyor...</div>;
  }

  return (
    <Routes>
      {/* Auth gerektirmeyen sayfalar */}
      <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
      <Route path="/signup" element={user ? <Navigate to="/" /> : <SignUp />} />
      <Route path="/reset-password" element={user ? <Navigate to="/" /> : <ResetPassword />} />
      {/* Ana uygulama, login gerektirir */}
      <Route path="/*" element={user ? renderMainApp() : <Navigate to="/login" state={{ from: location }} replace />} />
    </Routes>
  );
}