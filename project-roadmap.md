# FlowMe — Yapılacaklar & Eklenecekler Listesi

---

## 1. Pro Plan Özellikleri ve Ayrımı
- [ ] Plan yönetimi: Kullanıcı "free" mi "pro" mu, arayüzde ve fonksiyonlarda net ayrım.
- [ ] Sınırsız görev ekleme: Pro'da limit yok, free'de 20 görev limiti (mevcut).
- [ ] Pro avantajları ekranı: Pro'ya geçişi teşvik eden, avantajları listeleyen bir sayfa/modal.

---

## 2. Yedekleme & Geri Yükleme
### a) Harici Otomatik Yedekleme (Google Drive)
- [ ] Google Drive OAuth entegrasyonu: Kullanıcıdan izin alınması.
- [ ] Yedekleme dosyası oluşturma: Kullanıcının tüm görevlerini JSON/CSV olarak hazırlama.
- [ ] Google Drive'a yükleme: Dosyanın kullanıcının Drive'ına otomatik olarak yüklenmesi.
- [ ] Otomatik yedekleme zamanlayıcısı: Kullanıcı "otomatik yedek"yi açarsa, belirli aralıklarla yedekleme.
- [ ] Geri yükleme: Kullanıcı Drive'dan yedeği seçip görevlerini geri yükleyebilmeli.
- [ ] Kullanıcıya bildirimler: Yedekleme/geri yükleme başarılı/başarısız mesajları.

### b) (Alternatif) Supabase içi manuel yedek/geri yükle
- [ ] Yedekle/İndir butonu: Görevleri JSON olarak indir.
- [ ] Yedekten yükle: JSON dosyasını seçip görevleri geri yükle.

---

## 3. Yıllık ve Aylık İstatistikler
- [ ] İstatistik ekranı: Tamamlanan/toplam görev sayısı, aylık/yıllık grafikler.
- [ ] Pro kullanıcıya özel detaylı istatistikler: (örn. kategoriye göre, tamamlanma oranı, vs.)

---

## 4. Özel Tema Seçenekleri
- [ ] Tema ayarları ekranı: Açık/koyu mod, özel renkler.
- [ ] Tema seçimi sadece pro kullanıcıya açık.
- [ ] Kullanıcı seçimine göre arayüzün dinamik olarak değişmesi.

---

## 5. Öncelikli Destek
- [ ] Pro kullanıcıya özel destek formu: Hızlı iletişim, öncelikli yanıt.
- [ ] Destek taleplerinin Supabase'e kaydı veya e-posta ile iletilmesi.

---

## 6. Genel İyileştirmeler
- [ ] Görev silme/iptal etme: (Mevcut, ama detaylı test ve UX iyileştirmesi)
- [ ] Hata mesajları ve bildirimler: Daha kullanıcı dostu ve açıklayıcı.
- [ ] Mobil ve masaüstü uyumluluğu: Responsive tasarım kontrolleri.
- [ ] Performans ve güvenlik iyileştirmeleri.

---

## 7. (Opsiyonel) Diğer Bulutlara Yedekleme
- [ ] Dropbox, OneDrive, S3 gibi alternatif bulutlara yedekleme desteği.

---

# Öncelik Sırası Önerisi

1. Pro avantajları ekranı ve plan ayrımı
2. Google Drive otomatik yedekleme (veya başka harici bulut)
3. Yıllık/aylık istatistikler
4. Tema seçenekleri
5. Öncelikli destek
6. Genel iyileştirmeler 