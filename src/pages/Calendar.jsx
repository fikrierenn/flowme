import React, { useEffect, useState } from 'react';
import { getTasks } from '../utils/taskService';
import { formatDate, MONTHS_TR } from '../utils/dateHelper';

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year, month) {
  return new Date(year, month, 1).getDay();
}

const YEARS_RANGE = Array.from({ length: 12 }, (_, i) => new Date().getFullYear() - 5 + i);

export default function Calendar({ onTaskClick, userId }) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('month'); // 'month' | 'year' | 'years'
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    if (view === 'month' || view === 'year') {
      loadTasks();
    }
  }, [year, month, view]);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const allTasks = await getTasks(userId);
      setTasks(allTasks);
    } finally {
      setLoading(false);
    }
  };

  // Her gün için görevleri bul
  const getTasksForDay = (day) => {
    const dateStr = `${day} ${MONTHS_TR[month]} ${year}`;
    return tasks.filter(task => {
      if (task.is_recurring && task.recurrence_type === 'yearly') {
        const [tDay, tMonth] = task.datetime.split(' ');
        return parseInt(tDay) === day && tMonth === MONTHS_TR[month];
      }
      return task.datetime === dateStr;
    });
  };

  // Ayı ileri/geri al
  const changeMonth = (delta) => {
    let newMonth = month + delta;
    let newYear = year;
    if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    }
    setMonth(newMonth);
    setYear(newYear);
  };

  // Bir ayda görev varsa tipine göre renk döndür
  const getMonthTaskColor = (y, m) => {
    const monthTasks = tasks.filter(task => {
      const date = new Date(task.datetime);
      return date.getFullYear() === y && date.getMonth() === m;
    });
    if (monthTasks.some(task => task.title?.toLowerCase().includes('doğum günü'))) {
      return 'bg-pink-200 hover:bg-pink-300 border-pink-400';
    }
    if (monthTasks.some(task => task.title?.toLowerCase().includes('yıldönümü'))) {
      return 'bg-purple-200 hover:bg-purple-300 border-purple-400';
    }
    if (monthTasks.length > 0) {
      return 'bg-blue-200 hover:bg-blue-300 border-blue-400';
    }
    return 'border-gray-200';
  };

  // Bir yılda görev varsa tipine göre renk döndür
  const getYearTaskColor = (y) => {
    const yearTasks = tasks.filter(task => {
      const date = new Date(task.datetime);
      return date.getFullYear() === y;
    });
    if (yearTasks.some(task => task.title?.toLowerCase().includes('doğum günü'))) {
      return 'bg-pink-200 hover:bg-pink-300 border-pink-400';
    }
    if (yearTasks.some(task => task.title?.toLowerCase().includes('yıldönümü'))) {
      return 'bg-purple-200 hover:bg-purple-300 border-purple-400';
    }
    if (yearTasks.length > 0) {
      return 'bg-blue-200 hover:bg-blue-300 border-blue-400';
    }
    return 'border-gray-200';
  };

  // Bir ayda görev var mı?
  const hasTaskInMonth = (y, m) => {
    return tasks.some(task => {
      const date = new Date(task.datetime);
      return date.getFullYear() === y && date.getMonth() === m;
    });
  };

  // Bir yılda görev var mı?
  const hasTaskInYear = (y) => {
    return tasks.some(task => {
      const date = new Date(task.datetime);
      return date.getFullYear() === y;
    });
  };

  // Gün kutusu rengi
  const getTaskColor = (tasks) => {
    if (!tasks || tasks.length === 0) return '';
    if (tasks.some(task => task.title?.toLowerCase().includes('doğum günü'))) {
      return 'bg-pink-200 hover:bg-pink-300';
    }
    if (tasks.some(task => task.title?.toLowerCase().includes('yıldönümü'))) {
      return 'bg-purple-200 hover:bg-purple-300';
    }
    return 'bg-blue-200 hover:bg-blue-300';
  };

  // --- Görünümler ---
  if (view === 'years') {
    return (
      <div className="w-full max-w-md mx-auto p-4">
        <div className="text-xl font-bold text-center mb-4">Yıllar</div>
        <div className="grid grid-cols-3 gap-4">
          {YEARS_RANGE.map(y => (
            <button
              key={y}
              className={`rounded-lg p-4 text-lg font-semibold border hover:shadow-md ${y === year ? 'ring-2 ring-black' : ''} ${getYearTaskColor(y)}`}
              onClick={() => { setYear(y); setView('year'); }}
            >
              {y}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (view === 'year') {
    return (
      <div className="w-full max-w-2xl mx-auto p-4">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => setYear(y => y - 1)} className="text-primary font-bold">&lt;</button>
          <div className="text-xl font-bold cursor-pointer" onClick={() => setView('years')}>{year}</div>
          <button onClick={() => setYear(y => y + 1)} className="text-primary font-bold">&gt;</button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {MONTHS_TR.map((m, idx) => (
            <button
              key={m}
              className={`rounded-lg p-4 text-center font-semibold border hover:shadow-md ${idx === month ? 'ring-2 ring-black' : ''} ${getMonthTaskColor(year, idx)}`}
              onClick={() => { setMonth(idx); setView('month'); }}
            >
              {m}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // --- Ay görünümü ---
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfWeek = getFirstDayOfWeek(year, month);

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => changeMonth(-1)} className="text-primary font-bold">&lt;</button>
        <div className="text-xl font-bold flex flex-col items-center">
          <span className="cursor-pointer" onClick={() => setView('year')}>{MONTHS_TR[month]}</span>
          <span className="cursor-pointer text-base text-gray-500" onClick={() => setView('years')}>{year}</span>
        </div>
        <button onClick={() => changeMonth(1)} className="text-primary font-bold">&gt;</button>
      </div>
      <div className="grid grid-cols-7 gap-2 text-center text-sm font-semibold text-gray-500 mb-2">
        <div>Pzt</div><div>Sal</div><div>Çar</div><div>Per</div><div>Cum</div><div>Cmt</div><div>Paz</div>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {Array(firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1).fill(null).map((_, i) => (
          <div key={i}></div>
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const dayTasks = getTasksForDay(day);
          return (
            <div
              key={day}
              className={`rounded-lg min-h-[60px] flex flex-col items-center justify-center p-1 cursor-pointer transition-all duration-200 ${getTaskColor(dayTasks)}`}
              onClick={() => dayTasks.length > 0 && setSelectedDay({ day, tasks: dayTasks })}
            >
              <div className="font-bold text-primary mb-1">{day}</div>
            </div>
          );
        })}
      </div>
      {selectedDay && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 min-w-[250px] max-w-xs relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-black" onClick={() => setSelectedDay(null)}>&times;</button>
            <div className="font-bold mb-2">{selectedDay.day} {MONTHS_TR[month]} {year}</div>
            {selectedDay.tasks.map((task, i) => (
              <div key={i} className="mb-1 text-sm">
                <span className="font-semibold">•</span> {task.title}
              </div>
            ))}
          </div>
        </div>
      )}
      {loading && <div className="text-center mt-4">Yükleniyor...</div>}
    </div>
  );
} 