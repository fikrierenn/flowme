import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ResetPassword from './pages/ResetPassword';
import { supabase } from './utils/supabaseClient';
import Calendar from './pages/Calendar';
import YearCalendar from './components/YearCalendar';
import { ViewColumnsIcon, CalendarIcon } from '@heroicons/react/24/outline';

function MainApp() {
  const [tasks, setTasks] = useState([]); // Görevler için state
  const [view, setView] = useState('month'); // 'month' veya 'year'

  const handleDateClick = (date) => {
    // Tarih tıklama işlemleri
    console.log('Seçilen tarih:', date);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6">
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200 px-4 py-4 sm:flex sm:items-center sm:justify-between">
            <h1 className="text-lg font-semibold text-gray-900">FlowMe Takvim</h1>
            <div className="mt-3 sm:mt-0 sm:ml-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setView('month')}
                  className={`inline-flex items-center px-3 py-2 border rounded-md ${
                    view === 'month'
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <CalendarIcon className="h-5 w-5 mr-2" />
                  Ay Görünümü
                </button>
                <button
                  onClick={() => setView('year')}
                  className={`inline-flex items-center px-3 py-2 border rounded-md ${
                    view === 'year'
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <ViewColumnsIcon className="h-5 w-5 mr-2" />
                  Yıl Görünümü
                </button>
              </div>
            </div>
          </div>

          {view === 'month' ? (
            <Calendar tasks={tasks} onDateClick={handleDateClick} />
          ) : (
            <YearCalendar tasks={tasks} onDateClick={handleDateClick} />
          )}
        </div>
      </div>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

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
      <Route path="/*" element={user ? <MainApp /> : <Navigate to="/login" state={{ from: location }} replace />} />
    </Routes>
  );
}

export default App; 