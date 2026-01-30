# Environment setup (پنل ادمین Z-HR)

## چرا این پنل `.env.local` جدا دارد؟

این پوشه یک **اپ جدا** است (TailAdmin). وقتی اینجا `npm run dev` می‌زنی، روی پورت دیگری (مثلاً ۳۰۰۱) اجرا می‌شود و فقط به **اپ اصلی Z-HR** (پورت ۳۰۰۰) درخواست می‌فرستد. پس:

- **API keyها (مثل RAPIDAPI_KEY)** در اپ اصلی هستند → فایل **`.env.local` در روت پروژه** (`d:\z-hr-master\.env.local`).
- این پنل فقط باید بداند **آدرس اپ اصلی** کجاست → با **`.env.local` همین پوشه**.

## چه کار کنم؟

### ۱. ساخت `.env.local` برای همین پنل

از **همین پوشه** (`free-nextjs-admin-dashboard`):

```bash
# در ویندوز (PowerShell یا CMD):
copy env.example .env.local

# یا دستی: یک فایل به نام .env.local بساز و داخلش بگذار:
NEXT_PUBLIC_ZHR_API_URL=http://localhost:3000
```

مقدار را در صورت نیاز عوض کن (مثلاً اگر اپ اصلی روی پورت دیگری است).

### ۲. اجرای اپ اصلی

قبل از استفاده از پنل ادمین، اپ اصلی Z-HR باید روشن باشد:

```bash
# از روت پروژه (d:\z-hr-master):
npm run dev
```

آن اپ همان جایی است که **RAPIDAPI_KEY** و بقیه کلیدها در `.env.local` روت پروژه خوانده می‌شوند.

### ۳. اجرای پنل ادمین

```bash
# از داخل پوشه free-nextjs-admin-dashboard:
npm run dev
```

بعد در مرورگر آدرس پنل را باز کن (مثلاً http://localhost:3001). دکمه‌های «Sync Job positions» و «Sync Learning Hub courses» درخواست را به اپ اصلی می‌فرستند و کلیدها آنجا استفاده می‌شوند.

## خلاصه

| چیز | کجا |
|-----|-----|
| RAPIDAPI_KEY, ADZUNA_APP_ID, OPENAI_API_KEY, ... | `.env.local` در **روت پروژه** (`d:\z-hr-master\.env.local`) |
| آدرس اپ اصلی (برای پنل ادمین) | `.env.local` در **همین پوشه** (`free-nextjs-admin-dashboard/.env.local`) با متغیر `NEXT_PUBLIC_ZHR_API_URL` |
