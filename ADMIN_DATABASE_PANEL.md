# پنل ادمین و اتصال به دیتابیس Z-HR

## ساختار

- **پروژه اصلی (Z-HR)**: در root پروژه (`d:\z-hr-master`) — همان Next.js که دیتابیس محلی (`data/`) و APIها را دارد.
- **پنل ادمین**: در پوشه `free-nextjs-admin-dashboard` — یک اپ Next.js جدا با داشبورد و منو.

## اتصال پنل ادمین به دیتابیس

دیتابیس فقط در پروژه اصلی خوانده/نوشته می‌شود. پنل ادمین از طریق یک **API** اطلاعات را از پروژه اصلی می‌گیرد و نمایش می‌دهد.

### ۱. API دیتابیس در پروژه اصلی

- **آدرس**: `GET /api/admin/database`
- **عملکرد**: خواندن از `src/lib/db.ts` (فایل‌های JSON داخل `data/`) و برگرداندن خلاصه و جداول.
- **فایل**: `src/app/api/admin/database/route.ts`

### ۲. صفحه «Database» در پنل ادمین

- **مسیر در منو**: Pages → **Database (Z-HR)**
- **مسیر URL**: `/database`
- **فایل**: `free-nextjs-admin-dashboard/src/app/(admin)/(others-pages)/database/page.tsx`

این صفحه به API بالا درخواست می‌زند و خلاصه تعداد رکوردها و محتوای هر جدول را نشان می‌دهد.

## نحوه اجرا

### حالت توسعه (دو سرور)

1. **پروژه اصلی** را اجرا کن (همان جایی که دیتابیس و API هست):
   ```bash
   cd d:\z-hr-master
   npm run dev
   ```
   معمولاً روی `http://localhost:3000` بالا می‌آید.

2. **پنل ادمین** را در یک ترمینال دیگر اجرا کن:
   ```bash
   cd d:\z-hr-master\free-nextjs-admin-dashboard
   npm run dev
   ```
   پورت دیگری (مثلاً 3001) استفاده می‌شود.

3. در پنل ادمین، آدرس API پروژه اصلی را بده:
   - در پوشه `free-nextjs-admin-dashboard` فایل `.env.local` بساز (اگر نیست).
   - این خط را اضافه کن:
     ```env
     NEXT_PUBLIC_ZHR_API_URL=http://localhost:3000
     ```
   - سرور پنل ادمین را یک بار متوقف و دوباره با `npm run dev` اجرا کن.

4. در مرورگر برو به آدرس پنل ادمین (مثلاً `http://localhost:3001`) و از منو: **Pages → Database (Z-HR)**. باید خلاصه دیتابیس و جداول را ببینی.

### اگر فقط پروژه اصلی را اجرا کنی

- اگر فقط `npm run dev` در root بزنی، API دیتابیس روی `http://localhost:3000/api/admin/database` در دسترس است.
- برای دیدن صفحه «Database» باید پنل ادمین را هم (در پوشه `free-nextjs-admin-dashboard`) با `npm run dev` بالا بیاوری و `NEXT_PUBLIC_ZHR_API_URL=http://localhost:3000` را در `.env.local` آن قرار بدهی.

## داده‌های نمایش داده شده

از همان دیتابیس فایل‌های JSON (`data/`) استفاده می‌شود:

| جدول | توضیح |
|------|--------|
| users | کاربران |
| cvs | رزومه‌ها |
| skills | مهارت‌ها |
| user_skills | مهارت‌های کاربران |
| interview_sessions | جلسات مصاحبه |
| registration_logs | لاگ ثبت‌نام |
| cover_letters | نامه‌های پوششی |
| wizard_data | داده ویزارد |
| resume_drafts | پیش‌نویس رزومه |
| resume_section_outputs | خروجی بخش‌های رزومه |

صفحه Database در پنل ادمین این جداول را با تعداد رکورد و امکان انتخاب هر جدول برای مشاهده ردیف‌ها نشان می‌دهد.
