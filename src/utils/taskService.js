import { supabase } from './supabaseClient';

// Yeni görev ekle
export async function addTask(task, userId) {
  // Başlık boşsa hata fırlat
  if (!task.title || !task.title.trim()) {
    throw new Error('Görev başlığı boş olamaz.');
  }
  // Eğer başlıkta "doğum günü" geçiyorsa otomatik olarak yıllık tekrar ayarla
  const isRecurringBirthday = /doğum\s*günü/i.test(task.title);
  
  const { data, error } = await supabase
    .from('tasks')
    .insert([{
      title: task.title,
      description: task.description || '',
      datetime: task.datetime,
      relative_date: task.relative_date || '',
      category: task.category || 'Diğer',
      completed: task.completed || false,
      is_recurring: isRecurringBirthday ? true : (task.is_recurring || false),
      recurrence_type: isRecurringBirthday ? 'yearly' : (task.recurrence_type || 'none'),
      recurrence_note: isRecurringBirthday ? 'Yıllık doğum günü hatırlatması' : (task.recurrence_note || ''),
      user_id: userId
    }])
    .select();

  if (error) throw error;
  return data[0];
}

// Tüm görevleri getir
export async function getTasks(userId) {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
    .order('datetime', { ascending: true });

  if (error) throw error;
  return data;
}

// Görevi güncelle
export async function updateTask(taskId, updates) {
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', taskId)
    .select();

  if (error) throw error;
  return data[0];
}

// Görevi sil
export async function deleteTask(taskId) {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId);

  if (error) throw error;
}

// Görevi tamamlandı olarak işaretle
export async function toggleTaskComplete(taskId, isCompleted) {
  const { data, error } = await supabase
    .from('tasks')
    .update({ completed: isCompleted })
    .eq('id', taskId)
    .select();

  if (error) throw error;
  return data[0];
}

// Mevcut görevi yıllık tekrar olarak güncelle
export async function updateTaskAsYearlyRecurring(taskId) {
  const { data, error } = await supabase
    .from('tasks')
    .update({
      is_recurring: true,
      recurrence_type: 'yearly',
      recurrence_note: 'Yıllık doğum günü hatırlatması'
    })
    .eq('id', taskId)
    .select();

  if (error) throw error;
  return data[0];
} 