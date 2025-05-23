import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PRO_FEATURES = [
  'Sınırsız görev ekleme',
  'Yıllık ve aylık istatistikler',
  'Özel tema seçenekleri',
  'Yedekleme ve dışa aktarma',
  'Öncelikli destek',
];

const FREE_FEATURES = [
  'Aylık 20 görev limiti',
  'Temel takvim ve görev yönetimi',
  'Mobil uyumlu arayüz',
  'Veri güvenliği',
];

const CHAT_STYLES = [
  { value: 'samimi', label: 'Samimi' },
  { value: 'resmi', label: 'Resmi' },
  { value: 'klasik', label: 'Klasik' },
];

export default function Settings({ plan = 'free', setPlan, onLogout, email, chatStyle = 'samimi', setChatStyle }) {
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold text-primary mb-6 text-center tracking-tight">Ayarlar</h2>
      {/* Hesap Bölümü */}
      <div className="mb-6 bg-white border border-mint rounded-2xl p-5 shadow-sm">
        <div className="font-semibold text-primary text-lg mb-2">Hesap</div>
        {email && (
          <div className="flex items-center gap-2 mb-3">
            <span className="text-gray-500">E-posta:</span>
            <span className="font-mono text-primary text-sm">{email}</span>
          </div>
        )}
        <div className="flex gap-2 mb-2">
          <button
            className="bg-mint/60 border border-mint text-primary rounded-xl px-4 py-2 text-sm font-semibold hover:bg-mint/80 transition"
            onClick={() => navigate('/reset-password')}
          >
            Şifre Değiştir
          </button>
          <button
            className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-2 text-sm font-semibold hover:bg-red-100 transition"
            onClick={onLogout}
          >
            Çıkış Yap
          </button>
        </div>
      </div>
      {/* Kullanıcı Ayarları Bölümü */}
      <div className="mb-6 bg-white border border-mint rounded-2xl p-5 shadow-sm">
        <div className="font-semibold text-primary text-lg mb-2">Kullanıcı Ayarları</div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-gray-700">Koyu Tema</span>
          <label className="inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" checked={darkMode} onChange={() => setDarkMode(v => !v)} />
            <div className="w-10 h-6 bg-mint peer-checked:bg-primary rounded-full relative transition">
              <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${darkMode ? 'translate-x-4' : ''}`}></div>
            </div>
          </label>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-700">Bildirimler</span>
          <label className="inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" checked={notifications} onChange={() => setNotifications(v => !v)} />
            <div className="w-10 h-6 bg-mint peer-checked:bg-primary rounded-full relative transition">
              <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${notifications ? 'translate-x-4' : ''}`}></div>
            </div>
          </label>
        </div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-gray-700">Sohbet Stili</span>
          <select
            className="bg-mint/10 border border-mint rounded-xl px-3 py-1 text-primary font-semibold focus:outline-none"
            value={chatStyle}
            onChange={e => setChatStyle && setChatStyle(e.target.value)}
          >
            {CHAT_STYLES.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="mb-6 rounded-2xl border border-mint bg-mint/10 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-sm">
        <div className="flex-1 min-w-[140px]">
          <div className="text-lg font-semibold text-primary">Abonelik Planı</div>
          <div className="text-sm text-gray-500">{plan === 'pro' ? 'Ücretli (Pro)' : 'Ücretsiz (Free)'}</div>
        </div>
        {plan === 'free' && (
          <button
            className="bg-primary text-white px-5 py-2 rounded-xl font-semibold shadow hover:bg-accent transition w-full sm:w-auto"
            onClick={() => setShowUpgrade(true)}
          >
            Pro'ya Yükselt
          </button>
        )}
        {plan === 'pro' && (
          <span className="bg-green-100 text-green-700 px-4 py-1 rounded-xl font-bold tracking-wide shadow w-full sm:w-auto text-center">PRO</span>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-10">
        <div className="flex-1 bg-white rounded-2xl border border-mint/50 p-5 shadow-sm">
          <div className="font-semibold text-primary mb-3 text-base">Free Avantajları</div>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            {FREE_FEATURES.map((f, i) => (
              <li key={i} className="text-sm">{f}</li>
            ))}
          </ul>
        </div>
        <div className="flex-1 bg-white rounded-2xl border border-mint/50 p-5 shadow-sm">
          <div className="font-semibold text-primary mb-3 text-base">Pro Avantajları</div>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            {PRO_FEATURES.map((f, i) => (
              <li key={i} className="text-sm">{f}</li>
            ))}
          </ul>
        </div>
      </div>

      {showUpgrade && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-7 min-w-[320px] max-w-xs relative border border-mint">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-black text-2xl" onClick={() => setShowUpgrade(false)}>&times;</button>
            <div className="font-bold text-xl text-primary mb-2 text-center">Pro'ya Yükselt</div>
            <div className="mb-5 text-gray-700 text-center">Pro sürüm ile tüm özelliklerin kilidini açın ve FlowMe deneyimini zirveye taşıyın!</div>
            <button
              className="w-full bg-primary text-white py-2 rounded-xl font-semibold shadow hover:bg-accent transition text-lg"
              onClick={() => { setPlan('pro'); setShowUpgrade(false); }}
            >
              Şimdi Yükselt (Demo)
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 