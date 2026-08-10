# Fîlîmvan — Sinema Mirası & Kamu Malı Film Platformu 🎬

![Fîlîmvan Banner](https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=1200&q=80)

**Fîlîmvan**, telif süresi sona ermiş ve kamu malı (Public Domain) haline gelmiş olan restore edilmiş klasik sinema eserlerini yüksek kalitede, Türkçe altyazı desteğiyle izleyicilere sunan modern, sinematik ve performanslı bir film streaming platformudur.

---

## 🛠️ Teknoloji Yığını (Tech Stack)

- **Frontend:** React 19, TypeScript (Strict Mode)
- **Derleyici & Build:** Vite 8
- **Stil & Tasarım:** Tailwind CSS v4, Lucide React İkonları, Custom Glassmorphism Cinema UI
- **Veritabanı & Authentication:** Supabase (PostgreSQL, Row Level Security, Supabase Auth)
- **Durum Yönetimi & Caching:** TanStack Query (`@tanstack/react-query`)
- **Form Doğrulaması:** React Hook Form + Zod (`@hookform/resolvers/zod`)
- **Yönlendirme (Routing):** React Router v7 (Lazy Loading Code Splitting)

---

## 📁 Proje Dizin Yapısı

```text
move/
├── public/
│   └── robots.txt             # Disallow: /berxo (SEO koruması)
├── src/
│   ├── components/
│   │   ├── auth/              # AuthProvider, ProtectedRoute, BerxoRoute
│   │   ├── common/            # SEO, ErrorBoundary
│   │   ├── layout/            # Navbar, Footer, MainLayout
│   │   ├── movie/             # MovieCard, MovieGrid, HeroBanner, MovieForm, FavoriteButton, WatchlistButton, MovieSkeleton
│   │   ├── player/            # VideoPlayerShell (Özel Video Oynatıcı)
│   │   └── ui/                # Button, Badge, Input (shadcn/ui ilhamlı)
│   ├── hooks/                 # useAuth, useDebounce
│   ├── layouts/               # MainLayout, BerxoLayout (Admin Menü)
│   ├── lib/                   # supabase client, utils, videoSecurity (Hostname Whitelist)
│   ├── pages/
│   │   ├── berxo/             # BERXO Gizli Yönetim Paneli (Dashboard, Movies, Create, Edit, Genres, Subtitles, Users)
│   │   ├── HomePage.tsx
│   │   ├── MoviesPage.tsx
│   │   ├── MovieDetailPage.tsx
│   │   ├── WatchPage.tsx
│   │   ├── GenresPage.tsx
│   │   ├── GenreDetailPage.tsx
│   │   ├── SearchPage.tsx
│   │   ├── FavoritesPage.tsx
│   │   ├── WatchlistPage.tsx
│   │   ├── HistoryPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── ProfilePage.tsx
│   │   └── NotFoundPage.tsx
│   ├── services/              # movies.ts, userActivity.ts, mockData.ts
│   ├── types/                 # database.ts, movie.ts
│   ├── App.tsx                # React Router & Provider Yapılandırması
│   ├── main.tsx
│   └── index.css              # Tailwind CSS v4 Tasarım Sistemi
├── supabase_schema.sql        # Supabase PostgreSQL Kurulum SQL Betiği
├── .env                       # Ortam Değişkenleri
├── tsconfig.json
└── package.json
```

---

## ⚡ Ortam Değişkenleri (`.env`)

Proje kök dizinindeki `.env` dosyası aşağıdaki değişkenleri içermelidir:

```env
VITE_SUPABASE_URL=https://bvoqeeijrlcgdmsxkvub.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_1aIg8pMBXs9iuvzr8nkkTg_qNIAbw20
```

> [!CAUTION]
> Güvenlik gereği `SUPABASE_SERVICE_ROLE_KEY` kesinlikle frontend tarafında veya `.env` dosyasında bulunmamalıdır!

---

## 🗄️ Supabase Kurulumu & Veritabanı Şeması

1. [Supabase Dashboard](https://supabase.com/dashboard) adresinden projenizi açın.
2. Sol menüden **SQL Editor** sekmesine gidin.
3. Proje kökündeki [`supabase_schema.sql`](file:///c:/Users/BERHAT/Desktop/move/supabase_schema.sql) dosyasının içeriğini yapıştırın ve **Run** butonuna basın.

### Oluşturulan Veritabanı Tabloları:
1. `profiles`: Kullanıcı profilleri, kullanıcı adları, rolleri (`user` / `admin`).
2. `movies`: Film kataloğu, video embed adresleri, yayın durumları.
3. `genres`: Film türleri ve kategoriler.
4. `movie_genres`: Film-Tür çoka-çok ilişki tablosu.
5. `subtitles`: Filmlere ait VTT/SRT altyazı dosyaları.
6. `favorites`: Kullanıcıların favori filmleri.
7. `watchlist`: Kullanıcıların daha sonra izle listeleri.
8. `watch_history`: Oynatma ilerlemeleri ve geçmiş aktiviteleri.

---

## 👑 BERXO Yönetim Paneli & İlk Admin Kullanıcısını Oluşturma

Yönetim paneli için kamuya açık `/admin` rotası **kesinlikle kullanılmamıştır**. Tüm yönetim işlemleri gizli `/berxo` rotası altındadır.

### İlk Admin Kullanıcısını Oluşturma Adımları:
1. Sitede `/register` sayfasından yeni bir hesap oluşturun.
2. [Supabase Dashboard](https://supabase.com/dashboard) ➔ **Table Editor** ➔ **`profiles`** tablosuna gidin.
3. Kaydolduğunuz kullanıcının `role` sütununu `'user'` değerinden `'admin'` değerine değiştirip kaydedin.
4. Sitede giriş yaptığınızda Navbar'da **BERXO Yönetim Paneli** bağlantısı görünecek ve `/berxo` paneline tam erişim sağlanacaktır.

---

## 🔒 4 Katmanlı Güvenlik Mimarisi

1. **Supabase Auth:** Oturum kalıcılığı ve güvenli JWT kimlik doğrulaması.
2. **`profiles.role`:** Kullanıcı rolünün frontend ve context seviyesinde denetimi.
3. **`BerxoRoute` Guard:** Yetkisiz kullanıcıların `/berxo` rotasını bildiklerinde dahi doğrudan Ana Sayfaya (`/`) yönlendirilmesi.
4. **Supabase RLS & `is_admin()`:** Veritabanı seviyesinde `SECURITY DEFINER` fonksiyonu ile yetkisiz kullanıcıların admin işlemlerini (film ekleme, silme, rol değiştirme) yapmasının engellenmesi.

---

## 💻 Kurulum & Çalıştırma

### Bağımlılıkları Yükleme:
```bash
npm install
```

### Geliştirme Sunucusu (Development):
```bash
npm run dev
```

### Production Derleme (Build):
```bash
npm run build
```

---

## 📄 Lisans & Yasal Hak Beyanı

Bu platformda sunulan içerikler yalnızca kamu malı (Public Domain) niteliğindeki veya yayın hakkı onaylanmış eserlerden oluşmaktadır.
