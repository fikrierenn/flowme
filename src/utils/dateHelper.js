// Türkçe ay isimleri
export const MONTHS_TR = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
];

// Göreceli tarih ifadelerini tanıma
const RELATIVE_DATES = {
  'bugün': 0,
  'yarın': 1,
  'öbür gün': 2,
  'gelecek hafta': 7,
  'gelecek ay': 30,
};

export function getCurrentDate() {
  const now = new Date();
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
    formatted: `${now.getDate()} ${MONTHS_TR[now.getMonth()]} ${now.getFullYear()}`
  };
}

export function formatDate(date) {
  return `${date.getDate()} ${MONTHS_TR[date.getMonth()]} ${date.getFullYear()}`;
}

export function parseDate(dateStr) {
  // Göreceli tarih kontrolü
  for (const [key, days] of Object.entries(RELATIVE_DATES)) {
    if (dateStr.toLowerCase().includes(key)) {
      const date = new Date();
      date.setDate(date.getDate() + days);
      return {
        type: 'relative',
        date: key,
        formatted: formatDate(date)
      };
    }
  }

  // "Her ayın X'i" formatı kontrolü
  const recurringMatch = dateStr.match(/her\s+ay[ıi]n\s+(\d+)['ıiüu]/i);
  if (recurringMatch) {
    const day = parseInt(recurringMatch[1]);
    const nextDate = new Date();
    // Eğer bu aydaki gün geçtiyse gelecek ay
    if (nextDate.getDate() > day) {
      nextDate.setMonth(nextDate.getMonth() + 1);
    }
    nextDate.setDate(day);
    return {
      type: 'recurring',
      date: `her ayın ${day}'i`,
      formatted: formatDate(nextDate)
    };
  }

  // "X Ay" formatı kontrolü (örn: "29 Mayıs")
  const specificMatch = dateStr.match(/(\d+)\s+(ocak|şubat|mart|nisan|mayıs|haziran|temmuz|ağustos|eylül|ekim|kasım|aralık)/i);
  if (specificMatch) {
    const day = parseInt(specificMatch[1]);
    const monthIndex = MONTHS_TR.findIndex(m => m.toLowerCase() === specificMatch[2].toLowerCase());
    const date = new Date();
    date.setMonth(monthIndex);
    date.setDate(day);
    
    // Eğer tarih geçmişse, gelecek yıla ayarla
    if (date < new Date()) {
      date.setFullYear(date.getFullYear() + 1);
    }
    
    return {
      type: 'specific',
      date: `${day} ${MONTHS_TR[monthIndex]}`,
      formatted: formatDate(date)
    };
  }

  // Tarih anlaşılamadıysa
  return null;
}

export function isRecurringTask(title) {
  const keywords = ['doğum günü', 'yıldönümü', 'yıl dönümü', 'senelik', 'yıllık'];
  return keywords.some(keyword => title.toLowerCase().includes(keyword));
}

export function formatRecurringEventDescription(title, date) {
  const currentYear = new Date().getFullYear();
  const eventYear = new Date(date).getFullYear();
  const yearDiff = eventYear - currentYear;

  if (isRecurringTask(title)) {
    // Doğum günü için özel format
    if (title.toLowerCase().includes('doğum günü')) {
      if (yearDiff === 0) {
        return `🎂 ${title} (Bu seneki)`;
      } else if (yearDiff === 1) {
        return `🎂 ${title} (Gelecek sene)`;
      } else {
        return `🎂 ${title} (${yearDiff} sene sonra)`;
      }
    }
    
    // Yıldönümü için özel format
    if (title.toLowerCase().includes('yıldönümü') || title.toLowerCase().includes('yıl dönümü')) {
      if (yearDiff === 0) {
        return `💝 ${title} (Bu seneki)`;
      } else if (yearDiff === 1) {
        return `💝 ${title} (Gelecek sene)`;
      } else {
        return `💝 ${title} (${yearDiff} sene sonra)`;
      }
    }
    
    // Diğer tekrarlayan görevler için genel format
    if (yearDiff === 0) {
      return `🔄 ${title} (Bu seneki)`;
    } else if (yearDiff === 1) {
      return `🔄 ${title} (Gelecek sene)`;
    } else {
      return `🔄 ${title} (${yearDiff} sene sonra)`;
    }
  }
  
  return title;
}

export function getNextOccurrence(dateStr, recurrenceType) {
  const date = new Date();
  
  switch (recurrenceType) {
    case 'yearly':
      // Eğer bu yılki tarih geçtiyse gelecek yıla ayarla
      if (date < new Date()) {
        date.setFullYear(date.getFullYear() + 1);
      }
      break;
      
    case 'monthly':
      // Eğer bu aydaki tarih geçtiyse gelecek aya ayarla
      if (date.getDate() > parseInt(dateStr.split(' ')[0])) {
        date.setMonth(date.getMonth() + 1);
      }
      date.setDate(parseInt(dateStr.split(' ')[0]));
      break;
      
    case 'weekly':
      // Gelecek haftaya ayarla
      date.setDate(date.getDate() + (7 - date.getDay()));
      break;
  }
  
  return formatDate(date);
} 