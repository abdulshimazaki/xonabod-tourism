# Xonobod — Turizm portali

To'liq ishlaydigan turizm sayti va admin panel (CMS): **React + TypeScript + Tailwind CSS** (frontend) + **Supabase** (Postgres ma'lumotlar bazasi, autentifikatsiya, fayl saqlash).

Sayt to'liq **o'zbek tilida** (lotin alifbosi). Admin paneldan qo'shilgan har qanday obyekt (dam olish maskani, sanatoriya, restoran va h.k.) darhol ommaviy saytda ko'rinadi — bu statik mock emas, ishlaydigan full-stack ilova.

---

## 1. Loyihaning tuzilishi

```
src/
  types/content.ts          # Barcha kontent turlari uchun umumiy TypeScript tiplari
  config/contentTypes.ts    # 6 ta turizm kategoriyasining markazlashgan sozlamasi
                             # (label'lar, jadval nomlari, qo'shimcha maydonlar) —
                             # admin CRUD va ommaviy sahifalar shu fayldan boshqariladi
  lib/supabase.ts           # Supabase klient
  hooks/                    # useAuth, useContent (generic CRUD), useMediaUpload, ...
  components/
    layout/                 # Header, Footer, PublicLayout, AdminLayout
    public/                 # Hero, CategoryGrid, ListingCard, MapView, ...
    admin/                  # ProtectedRoute
    ui/                     # Rasm/video yuklovchi, RichTextEditor, Toast, va h.k.
  pages/
    public/                 # Bosh sahifa, umumiy Listing/Detail sahifalar, Media,
                             # Tadbirlar, Xarita, Qidiruv, Xonobod haqida
    admin/                  # Login, Dashboard, generic CRUD List/Form, Media
                             # menejeri, Sozlamalar, Foydalanuvchilar
supabase/
  schema.sql                # To'liq baza sxemasi + Row Level Security siyosatlari
  seed.sql                  # Namuna (demo) ma'lumotlar — ixtiyoriy
```

**Muhim arxitektura qarori:** oltita turizm kategoriyasi (dam olish maskanlari,
sanatoriyalar, dachalar, restoranlar, joylashish vositalari, diqqatga sazovor
joylar) bir xil ustun tuzilishini ishlatadi va `config/contentTypes.ts` fayli
orqali boshqariladi. Bu degani — admin CRUD sahifalari va ommaviy
listing/detail sahifalar HAR BIR toifa uchun alohida yozilmagan, balki bitta
generic komponent barcha toifalarni xizmat qiladi. Yangi maydon qo'shish yoki
yangi kategoriya yaratish uchun asosan shu bitta faylni tahrirlash kifoya.

---

## 2. Supabase loyihasini yaratish

1. https://supabase.com saytida ro'yxatdan o'ting va **New project** tugmasini bosing.
2. Loyiha nomi, parol va mintaqani tanlang (Yevropa mintaqasi O'zbekistonga eng yaqin).
3. Loyiha yaratilgach, **Project Settings → API** bo'limiga o'ting va quyidagilarni nusxalab oling:
   - `Project URL`
   - `anon public` kaliti

---

## 3. Ma'lumotlar bazasini sozlash

1. Supabase konsolida **SQL Editor → New query** ga o'ting.
2. `supabase/schema.sql` faylining **butun mazmunini** joylashtirib, **Run** tugmasini bosing.
   Bu quyidagilarni yaratadi:
   - 6 ta turizm kontent jadvali (`recreation_places`, `sanatoriums`, `dachas`, `restaurants`, `accommodations`, `attractions`)
   - `events`, `media`, `about_content`, `site_settings`, `admin_users` jadvallari
   - Har bir jadval uchun **Row Level Security** siyosatlari:
     - Oddiy tashrif buyuruvchilar faqat **nashr qilingan** (`published = true`) obyektlarni o'qiy oladi
     - Ro'yxatdan o'tgan administratorlar hammasini o'qiy va tahrirlay oladi
   - `xonobod-media` nomli ommaviy Storage bucket (rasm/video fayllar uchun)
3. (Ixtiyoriy) Namuna ma'lumotlar bilan sinab ko'rish uchun `supabase/seed.sql` faylini ham shu tarzda ishga tushiring.
   > Namuna ma'lumotlardagi barcha nomlar, manzillar va telefon raqamlari **haqiqiy emas** — ular faqat interfeysni sinash uchun. Nashr qilishdan oldin haqiqiy ma'lumotlar bilan almashtiring yoki admin paneldan o'chirib tashlang.

---

## 4. Birinchi administrator hisobini yaratish

1. Supabase konsolida **Authentication → Users → Add user** ga o'ting.
2. Email va parol kiriting (masalan, `admin@xonobod.uz`).
3. **Muhim:** `schema.sql` da o'rnatilgan trigger tufayli, tizimda yaratilgan **birinchi** foydalanuvchi avtomatik ravishda `super_admin` roli bilan `admin_users` jadvaliga qo'shiladi. Keyingi foydalanuvchilar `editor` roli bilan qo'shiladi — ularning rolini keyinchalik `/admin/foydalanuvchilar` sahifasidan (yoki to'g'ridan-to'g'ri SQL orqali) `content_manager` yoki `super_admin` ga o'zgartirishingiz mumkin.

---

## 5. Loyihani lokal ishga tushirish

```bash
npm install
cp .env.example .env
```

`.env` faylini oching va Supabase ma'lumotlaringizni kiriting:

```
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=sizning-anon-kalitingiz
```

So'ngra:

```bash
npm run dev
```

Sayt: `http://localhost:5173`
Admin panel: `http://localhost:5173/admin/login`

---

## 6. Netlify'ga joylashtirish (deploy)

1. Loyihani GitHub'ga push qiling.
2. https://app.netlify.com → **Add new site → Import an existing project** → GitHub repo'ni tanlang.
3. Build sozlamalari:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. **Site settings → Environment variables** bo'limida `.env` dagi ikkita o'zgaruvchini qo'shing (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).
5. React Router client-side routing ishlashi uchun loyiha ildizida `public/_redirects` fayli kerak (quyida berilgan) — bu fayl allaqachon loyihaga qo'shilgan.
6. **Deploy site** tugmasini bosing.

---

## 7. Admin panelda kundalik ish

Masalan, yangi dam olish maskanini qo'shish:

1. `/admin` ga kiring → chap menyudan **"Dam olish maskanlari"** ni tanlang.
2. **"+ Yangi dam olish maskani qo'shish"** tugmasini bosing.
3. Nomi, rasm, galereya, tavsif, manzil, telefon va boshqa maydonlarni to'ldiring.
4. **"Qoralama sifatida saqlash"** — obyekt saytda hali ko'rinmaydi, lekin admin panelda saqlanadi.
5. **"Saqlash va nashr qilish"** — obyekt darhol ommaviy saytda paydo bo'ladi.
6. Istalgan vaqtda ro'yxat sahifasidagi yashil/kulrang tugma orqali nashrni yoqib/o'chirib qo'yish mumkin — obyekt o'chirilmaydi, faqat yashiriladi.

Xuddi shu ish tartibi barcha 6 ta kategoriya, tadbirlar va media fayllar uchun bir xil ishlaydi.

---

## 8. Xavfsizlik eslatmalari

- `.env` fayli **hech qachon** git repozitoriyga qo'shilmasligi kerak (`.gitignore` da allaqachon istisno qilingan).
- Frontendda faqat `anon public` kalit ishlatiladi — bu xavfsiz, chunki barcha yozish huquqlari Row Level Security siyosatlari orqali cheklangan (faqat `admin_users` jadvalida ro'yxatdan o'tgan foydalanuvchilar yoza oladi).
- Supabase **service role** kalitini hech qachon frontend kodiga yoki `.env` fayliga qo'shmang.

---

## 9. Kengaytirish

- **Rus/ingliz tili:** har bir jadvalning `seo`, `name`, `description_html` kabi maydonlari kelajakda `{"uz": "...", "ru": "...", "en": "..."}` ko'rinishidagi jsonb obyektlariga aylantirilishi mumkin — joriy sxema buni to'sqinlik qilmaydi.
- **Yangi kontent turi qo'shish:** `supabase/schema.sql` da yangi jadval yarating (`recreation_places` naqshiga ko'ra), so'ngra `src/config/contentTypes.ts` ga bitta yangi obyekt qo'shing — admin CRUD va ommaviy sahifalar avtomatik ishlay boshlaydi.
