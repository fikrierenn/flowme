import React, { useState, useRef, useEffect } from 'react';
import { sendToAI } from '../utils/sendToAI';
import { addTask } from '../utils/taskService';
import { parseDate, isRecurringTask, getNextOccurrence } from '../utils/dateHelper';

const initialMessages = [
  { from: 'ai', text: 'Yeni görevinizi yazın veya kısaca tarif edin. (Örn: Yarın 10:00 toplantı)' }
];

export default function NewTaskModal({ onClose, onSave, user, chatStyle = 'samimi' }) {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [pendingTask, setPendingTask] = useState({});
  const [step, setStep] = useState('input'); // input, confirm
  const inputRef = useRef(null);
  const scrollRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Her mesajdan sonra en alta kaydır
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const toISO = (dateStr) => {
    // "2024-05-18 14:00" → "2024-05-18T14:00:00"
    if (!dateStr) return '';
    return dateStr.replace(' ', 'T') + ':00';
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { from: 'user', text: input };
    setMessages(msgs => [...msgs, userMsg]);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const aiResult = await sendToAI([...messages, { from: 'user', text: input }], chatStyle);
      let output = aiResult.candidates?.[0]?.content?.parts?.[0]?.text || '';
      // Kod bloğu ve gereksiz karakter temizliği
      let jsonText = output.replace(/```json|```/g, '').trim();
      const firstBracket = jsonText.indexOf('[');
      const lastBracket = jsonText.lastIndexOf(']');
      if (firstBracket !== -1 && lastBracket !== -1) {
        jsonText = jsonText.substring(firstBracket, lastBracket + 1);
      }
      // JSON metni köşeli parantezle başlıyor mu?
      if (!jsonText.startsWith('[') || !jsonText.endsWith(']')) {
        setMessages(msgs => [...msgs, { from: 'ai', text: 'AI yanıtı beklenen formatta değil. Lütfen daha açık bir görev girin veya tekrar deneyin.' }]);
        setLoading(false);
        setStep('input');
        console.error('AI JSON format hatası:', output, jsonText);
        return;
      }
      let tasks;
      try {
        tasks = JSON.parse(jsonText);
      } catch (parseError) {
        setMessages(msgs => [...msgs, { from: 'ai', text: 'AI yanıtı ayrıştırılamadı. Lütfen tekrar deneyin.' }]);
        setLoading(false);
        setStep('input');
        console.error('AI JSON parse hatası:', parseError, output, jsonText);
        return;
      }
      // Parse edilen veri dizi mi ve en az bir görev var mı?
      if (!Array.isArray(tasks) || tasks.length === 0) {
        setMessages(msgs => [...msgs, { from: 'ai', text: 'AI yanıtında geçerli görev bulunamadı. Lütfen tekrar deneyin.' }]);
        setLoading(false);
        setStep('input');
        console.error('AI görev dizisi hatası:', tasks, output, jsonText);
        return;
      }
      setPendingTask(tasks);
      // Eksik alanlar veya onay adımı
      setStep('confirm');
      setMessages(msgs => [...msgs, { from: 'ai', text: `Aşağıdaki görev(ler) eklenecek:\n${tasks.map(t => `- ${t.task_title} (${t.due_date?.date || '-'})`).join('\n')}\nOnaylıyor musunuz? (Evet/Hayır)` }]);
    } catch (err) {
      setError(err.message || 'AI servisine ulaşılamadı.');
      setMessages(msgs => [...msgs, { from: 'ai', text: err.message || 'AI servisine ulaşılamadı.' }]);
      console.error('AI genel hata:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (answer) => {
    console.log('handleConfirm ÇALIŞTI', { answer, pendingTask, user });
    if (/evet|onayla|tamam/i.test(answer)) {
      try {
        let tasksToSave = Array.isArray(pendingTask) ? pendingTask : [pendingTask];
        // Boş başlıklı görevleri filtrele (hem task_title hem title)
        const validTasks = tasksToSave.filter(
          task =>
            (task.task_title && task.task_title.trim()) ||
            (task.title && task.title.trim())
        );
        if (validTasks.length === 0) {
          setMessages(msgs => [...msgs, { from: 'ai', text: 'Geçerli başlığa sahip görev bulunamadı. Lütfen tekrar deneyin.' }]);
          setStep('input');
          return;
        }
        const savedTasks = [];
        for (const task of validTasks) {
          const title = task.task_title || task.title;
          const taskObj = {
            title,
            description: task.description || '',
            datetime: toISO(task.due_date?.date || task.datetime || ''),
            relative_date: task.relative_date || '',
            category: task.category || 'Diğer',
            completed: task.completed || false,
            is_recurring: task.is_recurring || false,
            recurrence_type: task.recurrence_type || 'none',
            recurrence_note: task.recurrence_note || ''
          };
          console.log('Supabase eklenecek task:', taskObj, 'user_id:', user?.id);
          try {
            const savedTask = await addTask(taskObj, user?.id);
            console.log('Supabase addTask BAŞARILI:', savedTask);
            savedTasks.push(savedTask);
          } catch (error) {
            console.error('Supabase addTask HATASI:', error, 'Task:', taskObj, 'user_id:', user?.id);
            setMessages(msgs => [...msgs, { from: 'ai', text: 'Görev kaydedilemedi: ' + (error.message || error) + '\nTekrar denemek ister misiniz?' }]);
            setStep('input');
            return;
          }
        }
        // Kayıt başarılıysa kullanıcıya bilgi ver ve chat'i sıfırla/modalı kapat
        setMessages(msgs => [...msgs, { from: 'ai', text: 'Görev(ler) başarıyla kaydedildi ve ilgili tarihlere eklendi.' }]);
        setTimeout(() => {
          onSave(savedTasks.length === 1 ? savedTasks[0] : savedTasks);
          onClose();
        }, 1200);
        return;
      } catch (error) {
        console.error('Genel görev ekleme hatası:', error, { answer, pendingTask, user });
        setMessages(msgs => [...msgs, { from: 'ai', text: 'Görev kaydedilemedi: ' + error.message + '\nTekrar denemek ister misiniz?' }]);
        setStep('input');
        return;
      }
    } else {
      setMessages(msgs => [...msgs, { from: 'ai', text: 'İşlem iptal edildi. Yeni bir görev girmek ister misiniz?' }]);
      setStep('input');
    }
  };

  const handleInput = (e) => {
    setInput(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      if (step === 'confirm') {
        handleConfirm(input);
        setInput('');
      } else {
        handleSend(e);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-[100]">
      <div className="bg-white w-full max-w-md rounded-t-2xl p-0 flex flex-col h-[80vh] min-h-[400px]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-mint">
          <h2 className="text-xl font-bold text-primary">Yeni Görev</h2>
          <button onClick={onClose} className="p-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#075E54" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
        {/* Chat Alanı */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-2 bg-mint/10">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.from === 'ai' ? (
                <div className="flex items-start gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg">F</div>
                  <div className="max-w-[80%] px-4 py-2 rounded-2xl text-sm whitespace-pre-line bg-white text-primary rounded-bl-md border border-mint">
                    <div className="font-semibold text-primary mb-1">Flowy</div>
                    {msg.text}
                  </div>
                </div>
              ) : (
                <div className="max-w-[80%] px-4 py-2 rounded-2xl text-sm whitespace-pre-line bg-primary text-white rounded-br-md">
                  {msg.text}
                </div>
              )}
            </div>
          ))}
        </div>
        {/* Input Alanı */}
        <form onSubmit={step === 'confirm' ? (e) => { e.preventDefault(); handleConfirm(input); setInput(''); } : handleSend} className="flex items-center gap-2 p-3 border-t border-mint bg-white">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-mint/10 rounded-xl py-2 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder={step === 'confirm' ? 'Evet / Hayır' : 'Mesajınızı yazın...'}
            autoFocus
            disabled={loading}
          />
          <button type="submit" className="bg-primary text-white rounded-xl px-4 py-2 font-semibold hover:bg-accent transition" disabled={loading}>
            {loading ? (
              <div className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>İşleniyor</span>
              </div>
            ) : 'Gönder'}
          </button>
        </form>
        {error && <div className="text-red-500 text-xs px-4 pb-2">{error}</div>}
      </div>
    </div>
  );
} 