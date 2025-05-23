import React, { useState } from 'react';
import { MONTHS_TR } from '../utils/dateHelper';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const YearCalendar = ({ tasks, onDateClick }) => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [hoveredDay, setHoveredDay] = useState(null);

  const generateMonthCalendar = (year, month) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDayIndex = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    
    const weeks = [];
    let days = [];
    
    // Boş günleri ekle
    for (let i = 0; i < startingDayIndex; i++) {
      days.push(null);
    }
    
    // Ayın günlerini ekle
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      const dateStr = `${day} ${MONTHS_TR[month]} ${year}`;
      
      // O güne ait görevleri bul
      const dayTasks = tasks.filter(task => {
        const taskDate = new Date(task.date);
        return taskDate.getDate() === day && 
               taskDate.getMonth() === month && 
               taskDate.getFullYear() === year;
      });

      days.push({
        day,
        tasks: dayTasks,
        date: currentDate
      });
      
      if (days.length === 7) {
        weeks.push(days);
        days = [];
      }
    }
    
    // Son haftayı tamamla
    if (days.length > 0) {
      while (days.length < 7) {
        days.push(null);
      }
      weeks.push(days);
    }
    
    return weeks;
  };

  const handleYearChange = (increment) => {
    setSelectedYear(prev => prev + increment);
  };

  // Görev tipine göre renk belirleme
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

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => handleYearChange(-1)}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ChevronLeftIcon className="h-6 w-6" />
        </button>
        <h2 className="text-2xl font-semibold">{selectedYear}</h2>
        <button
          onClick={() => handleYearChange(1)}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ChevronRightIcon className="h-6 w-6" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {MONTHS_TR.map((month, monthIndex) => (
          <div key={month} className="border rounded-lg p-2">
            <h3 className="text-center font-medium mb-2">{month}</h3>
            <div className="grid grid-cols-7 gap-1 text-xs">
              <div className="text-center font-medium">P</div>
              <div className="text-center font-medium">S</div>
              <div className="text-center font-medium">Ç</div>
              <div className="text-center font-medium">P</div>
              <div className="text-center font-medium">C</div>
              <div className="text-center font-medium">C</div>
              <div className="text-center font-medium">P</div>
              
              {generateMonthCalendar(selectedYear, monthIndex).map((week, weekIndex) => (
                <React.Fragment key={weekIndex}>
                  {week.map((day, dayIndex) => {
                    const isHovered = hoveredDay === `${day?.date}`;
                    const taskColor = getTaskColor(day?.tasks);
                    
                    return (
                      <div
                        key={dayIndex}
                        onClick={() => day && onDateClick(day.date)}
                        onMouseEnter={() => day && setHoveredDay(`${day.date}`)}
                        onMouseLeave={() => setHoveredDay(null)}
                        className={`
                          relative text-center p-1 cursor-pointer rounded transition-all duration-200
                          ${day ? 'hover:shadow-md' : ''}
                          ${taskColor}
                          ${!day?.tasks?.length ? 'hover:bg-gray-100' : ''}
                        `}
                      >
                        <span className={`
                          ${day?.tasks?.length ? 'text-gray-800' : 'text-gray-600'}
                          ${isHovered ? 'font-medium' : ''}
                        `}>
                          {day?.day}
                        </span>
                        
                        {/* Hover tooltip */}
                        {isHovered && day?.tasks?.length > 0 && (
                          <div className="absolute z-10 w-48 bg-white border rounded-lg shadow-lg p-2 text-left -translate-x-1/2 left-1/2 mt-1">
                            <div className="text-xs font-medium mb-1">{day.tasks.length} Görev</div>
                            {day.tasks.map((task, i) => (
                              <div key={i} className="text-xs truncate text-gray-600">
                                • {task.title}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default YearCalendar; 