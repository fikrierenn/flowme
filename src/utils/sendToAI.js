import { getCurrentDate } from './dateHelper';

export async function sendToAI(messages, chatStyle = 'samimi') {
  console.log('Gemini API Key:', process.env.REACT_APP_GEMINI_API_KEY);
  
  const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('API anahtarı bulunamadı! Lütfen .env dosyasına REACT_APP_GEMINI_API_KEY ekleyin.');
  }

  if (apiKey.length < 30) {
    throw new Error('Geçersiz API anahtarı formatı. Lütfen doğru bir Gemini API anahtarı girdiğinizden emin olun.');
  }

  const currentDate = getCurrentDate();

  console.log('API Bağlantısı Başlatılıyor:', apiKey.substring(0, 5) + '...' + apiKey.substring(apiKey.length - 5));

  console.log('Kullanılan API Anahtarı:', apiKey.substring(0, 10) + '...');

  let stylePrompt = '';
  if (chatStyle === 'samimi') stylePrompt = 'Yanıtlarını sıcak, arkadaşça ve samimi bir dille ver.';
  else if (chatStyle === 'resmi') stylePrompt = 'Yanıtlarını resmi ve kibar bir dille ver.';
  else stylePrompt = 'Yanıtlarını sade ve nötr bir dille ver.';

  // Bugünün tarihi ve tarih üretme kuralı ekleniyor
  const prompt = `Bugünün tarihi: ${currentDate.formatted}.
${stylePrompt}
Kullanıcıdan gelen doğal dil görev tarifini, her biri için ayrı ayrı, şu formatta JSON olarak döndür:
[
  {
    "task_title": "Görev başlığı (zorunlu, boş bırakma!)",
    "due_date": { "date": "YYYY-MM-DD HH:mm" },
    "category": "Kategori"
  }
]
- Görev başlığı (task_title) alanı ZORUNLUDUR, asla boş bırakma!
- Eğer görev başlığı çıkarılamıyorsa, task_title alanını 'Başlık girilmedi' olarak doldur.
- Sadece bu formatı döndür. Kod bloğu veya açıklama ekleme.
- Eğer birden fazla tarih/saat varsa, her biri için ayrı görev oluştur.
- Eğer tarih belirtilmemişse, bugünden sonraki en yakın hafta sonunu ve saatleri kullan. Eğer tarih bugünden önceyse, otomatik olarak bir yıl ileri al.

Kullanıcıdan gelen mesaj: ${messages[messages.length - 1]?.text || ''}`;

  // Mesajları Gemini formatına çevir ve başına sistem mesajını ekle
  const geminiMessages = [
    {
      role: 'model',
      parts: [{
        text: prompt
      }]
    },
    ...messages.map(msg => ({
      role: msg.from === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }))
  ];

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  console.log('API URL:', apiUrl);
  console.log('Gemini Mesajları:', geminiMessages);

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ contents: geminiMessages })
    });

    console.log('API Yanıt Durumu:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Hata Detayı:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`API Hatası: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('API Başarılı Yanıt:', data);
    return data;
    
  } catch (error) {
    console.error('Hata Detayı:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    throw error;
  }
} 