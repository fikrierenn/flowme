# FlowMe — Detaylı Proje Dokümanı

---

## 0. FlowMe Nasıl Çalışır? (Kullanıcı Odaklı İşleyiş)

### 🧠 FlowMe Nedir?
FlowMe senin yerine düşünmez, ama düşündüğünü düzene sokar. Hayatındaki "şunu yapacaktım, unuttum" gibi şeyleri alır, unutulmaz ve yönetilir hale getirir.

### 🤯 Normalde Ne Olur?
Sen düşünürsün:
- "Bugün faturayı ödeyecektim."
- "Yarın anneme hediye almalıyım."
- "Bulaşık makinesi bozuldu, servisi aramalıyım."
Sonra unutursun, gecikir, kafanda döner durur.

### ✅ FlowMe'de Ne Oluyor?
Sen yazıyorsun:
- "Yarın anneme doğum günü hediyesi almam lazım."
FlowMe diyor ki:
- "Bu bir görev. Konu: Hediye. Tarih: Yarın. Kategori: Kişisel. Eylem: Alışveriş."
Ve bunu bir görev kartı gibi sana gösteriyor. İstersen hatırlatıyor, istersen güncelliyor.

### 🤖 Bunu Yapan Kim?
Yapay zekâ. Senin yazdığın mesajı anlamaya çalışan bir "minik akıllı asistan." Bu asistanın beyni Gemini denilen bir sistem (tıpkı ChatGPT gibi ama Google versiyonu). Senin cümleni alıyor, parçalıyor ve anlamlı hale getiriyor.

### 💾 Bilgileri Kim Saklıyor?
Her yazdığın şey, her görev, Supabase adında bir veritabanında saklanıyor. (Veritabanı = dijital defter gibi düşünebilirsin. Notların hep orada kalıyor.)

### 🔄 Süreç Nasıl Çalışıyor?
Uygulamada kutuya yazıyorsun:
- "Kahve makinesi damlatıyor, ilgilenmem lazım."
Yapay zekâ diyor ki:
- Görev: "Servis çağır"
- Konu: "Kahve makinesi arızası"
- Aciliyet: "Bugün içinde"
Görev olarak sistemde saklanıyor. Durum: Bekliyor. Sen istersen: Tamamlandı yapıyorsun.

### 🔔 Hatırlatma Özelliği?
Sistem:
- "Bu görevi hâlâ yapmadın."
- "Bugün saat 14:00'te bunu yapacağım diye not almıştın."
gibi seni dürtüyor.

### 🧠 Eksik Bilgi Varsa?
Sen yazarsın:
- "Kahve makinesi bozuldu."
Sistem sorar:
- "Tam olarak neyi bozuldu? Ne marka? Ne zamandır böyle?"
Yani seni tamamlatır. Senin düşünmediğini o düşünür.

### 📲 Nerede Çalışacak?
- Başta web uygulaması (tarayıcıdan çalışıyor)
- Sonra mobil uygulama olarak Play Store'a girecek
- APK (Android uygulaması) olarak da kullanılabilir olacak

### 💡 Neden Farklı Bu?
- Not almaz, süreç çıkarır
- Hatırlatıcı değildir, düşünce yöneticisidir
- Yapay zekâyla çalışır ama kontrol sende kalır
- Her şeyin çok sade ve mesajlaşma kadar kolay olması hedeflenir

### 🛠️ Teknik Dille Özet
- React + Tailwind → arayüz
- Supabase → veritabanı, oturum, görev takibi
- Gemini API → yapay zekâ
- Edge Function → AI işlemleri
- Vercel → deployment
- Capacitor (ileride) → mobil APK üretimi

### 🎯 Ne İşe Yarar?
Sen sadece yazarsın:
- "Yarın ayakkabılarımı tamirciye götürmem lazım."
Sistem şunu yapar:
- Görev oluşturur
- Hatırlatma ekler
- Gerekirse tekrar sorar
- Unutmamanı sağlar
- Düşünce dağınıklığını düzene sokar

## 1. Proje Tanımı ve Amaç
FlowMe, kullanıcının doğal dilde yazdığı ihtiyaçları (görevler, notlar, fikirler) anlamlandırıp; görev, kategori, tarih gibi yapılara dönüştüren kişisel bir yapay zekâ asistanıdır. Hedef, kullanıcıların günlük işlerini kolayca organize etmelerini ve takip etmelerini sağlamaktır.

## 2. Hedef Kitle ve Kullanım Senaryoları
- Yoğun çalışan profesyoneller
- Yaratıcılar ve girişimciler
- Not alma, görev yönetimi ve düşünce organizasyonu ihtiyacı duyan bireyler

**Kullanım Senaryosu Örnekleri:**
- "Yarın saat 10'da toplantı yapmayı unutma."
- "Pazartesi market alışverişi yap."
- "Annemin doğum günü için çiçek siparişi ver."

## 3. Temel Özellikler ve Akışlar
- **Doğal Dil Girdisi:** Kullanıcı, görevleri serbestçe yazar.
- **AI Destekli Yapılandırma:** AI, metni analiz ederek başlık, tarih, kategori ve eksik bilgileri çıkarır.
- **Eksik Bilgi Sorgulama:** AI, eksik alanlar için kullanıcıya soru yöneltir.
- **Görev Oluşturma ve Takip:** Görevler Supabase veritabanına kaydedilir, durumu güncellenebilir.
- **Kategori ve Etiketleme:** Görevler kategorilere ayrılır, renkli etiketlerle gösterilir.
- **Bildirim ve Hatırlatıcı:** Planlanan görevler için bildirim (ilerleyen sürümde).

## 4. Sistem Mimarisi ve Teknoloji Yığını
- **Frontend:** React.js + TailwindCSS
- **Backend:** Supabase (PostgreSQL, Auth, Edge Functions)
- **AI:** Gemini Pro API (başlangıç), opsiyonel olarak open-source modeller (Mistral, Phi)
- **Deployment:** Vercel (frontend), Supabase platformu

## 5. Bileşenler ve Modüller
- **TaskInput:** Görev giriş kutusu, kullanıcıdan doğal dilde metin alır.
- **TaskCard:** Görevlerin listelendiği ve yönetildiği kart bileşeni.
- **sendToAI (utils):** Kullanıcı girdisini AI'a gönderir, yanıtı işler.
- **edge/ai-handler:** Supabase Edge Function, AI ile iletişimi sağlar.

## 6. API ve Edge Function Tasarımı
- **/edge/ai-handler:**
  - POST endpoint'i
  - Girdi: { "input": "Kullanıcı metni" }
  - Çıktı: AI tarafından yapılandırılmış görev JSON'u
- **/tasks:**
  - CRUD işlemleri (create, read, update, delete)
  - Supabase veritabanı ile bağlantı

## 7. Veritabanı Tasarımı (Supabase)
- **tasks** tablosu:
  - id (uuid, primary key)
  - user_id (uuid, foreign key)
  - task_title (text)
  - due_date (timestamp)
  - category (text)
  - status (enum: pending/done)
  - created_at (timestamp)

- **users** tablosu (Supabase Auth ile entegre)

## 8. AI Prompt ve Çıktı Formatı
**Prompt:**
"Sen bir kişisel asistan uygulamasının yapay zekâ motorusun. Kullanıcının yazdığı metni aşağıdaki JSON formatında yapılandır:"

**Beklenen Çıktı:**
```json
{
  "task_title": "",
  "due_date": "",
  "category": "",
  "missing_fields": [],
  "questions_to_ask": []
}
```

## 9. MVP ve Yol Haritası
- [x] Görev giriş kutusu
- [x] AI ile görev çıkarımı
- [x] Görev kartı gösterimi
- [x] Supabase DB entegrasyonu
- [ ] Görev güncelleme
- [ ] Eksik bilgi kontrolü ve geri soru
- [ ] Oturum yönetimi (Supabase Auth)
- [ ] Hatırlatma sistemi

**Faz 2+**
- Kişisel AI eğitimi
- Rutin tanıma ve öneri
- Görev şablonu paylaşımı
- Mobil uygulama (Flutter/PWA)
- Yerel AI geçişi

## 10. Geliştirme ve Dağıtım Süreci
- Kodlama: Bileşen bazlı, modüler yapı
- Versiyon kontrolü: Git
- Otomatik testler ve CI/CD
- Frontend: Vercel'e otomatik deploy
- Backend: Supabase üzerinde yönetim

---

Bu doküman, FlowMe projesinin hızlı, sürdürülebilir ve hedef odaklı geliştirilmesi için kapsamlı bir yol haritası sunar. 