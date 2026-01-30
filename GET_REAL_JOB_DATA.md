# 🎯 راهنمای دریافت داده‌های واقعی Job Positions

## ⚠️ مهم

این صفحه **فقط داده‌های واقعی** از API های واقعی نمایش می‌دهد. **هیچ mock data استفاده نمی‌شود**.

---

## 🚀 راه‌اندازی سریع (5 دقیقه)

### گزینه 1: Adzuna API (پیشنهادی - رایگان)

1. **ثبت نام**: بروید به https://developer.adzuna.com/overview
2. **دریافت API Keys**: بعد از ثبت نام، `app_id` و `app_key` دریافت می‌کنید
3. **اضافه کردن به `.env.local`**:
   ```env
   ADZUNA_APP_ID=your-app-id-here
   ADZUNA_APP_KEY=your-app-key-here
   ```
4. **Restart server**: `npm run dev` را restart کنید
5. **تست**: بروید به `http://localhost:3000/test-jobs`

### گزینه 2: JSearch API (از طریق RapidAPI)

1. **ثبت نام**: بروید به https://rapidapi.com/
2. **Subscribe به JSearch**: https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch
3. **دریافت API Key**: از RapidAPI dashboard
4. **اضافه کردن به `.env.local`**:
   ```env
   RAPIDAPI_KEY=your-rapidapi-key-here
   ```
5. **Restart و تست**

### گزینه 3: JobData API

1. **ثبت نام**: https://jobdataapi.com/
2. **دریافت API Key**
3. **اضافه کردن به `.env.local`**:
   ```env
   JOB_DATA_API_KEY=your-key-here
   ```

---

## 📊 تست

### از Browser:
1. Login کنید
2. بروید به: `http://localhost:3000/test-jobs`
3. دکمه "Fetch Jobs" را بزنید
4. داده‌های واقعی را مشاهده کنید

### از Terminal:
```bash
curl "http://localhost:3000/api/jobs/test?query=developer&location=Dubai&limit=10"
```

---

## ✅ بررسی اینکه API کار می‌کند

اگر API key درست باشد، باید:
- ✅ داده‌های واقعی از job boards نمایش داده شود
- ✅ Company names واقعی باشند
- ✅ Locations واقعی باشند
- ✅ Descriptions کامل باشند

اگر API key نباشد:
- ❌ پیام خطا نمایش داده می‌شود
- ❌ راهنمای دریافت API key نمایش داده می‌شود

---

## 🔍 منابع API

### 1. Adzuna (رایگان - پیشنهادی)
- **Website**: https://developer.adzuna.com/
- **Free Tier**: ✅ بله
- **Coverage**: 20+ countries
- **Rate Limit**: Generous free tier

### 2. JSearch (از طریق RapidAPI)
- **Website**: https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch
- **Free Tier**: ✅ بله (محدود)
- **Coverage**: Global
- **Sources**: Indeed, LinkedIn, Glassdoor, etc.

### 3. JobData API
- **Website**: https://jobdataapi.com/
- **Free Tier**: ⚠️ محدود
- **Coverage**: Global

---

## 📝 مثال Response

```json
{
  "success": true,
  "count": 15,
  "sources": ["adzuna"],
  "jobs": [
    {
      "id": "123456",
      "title": "Senior Frontend Developer",
      "company": "Tech Corp",
      "location": "Dubai, UAE",
      "locationType": "remote",
      "description": "Real job description from job board...",
      "techStack": ["React", "TypeScript"],
      "salaryMin": 5000,
      "salaryMax": 8000,
      "source": "adzuna",
      "sourceUrl": "https://..."
    }
  ]
}
```

---

## ⚠️ نکات مهم

1. **بدون API Key = بدون Data**: هیچ mock data نمایش داده نمی‌شود
2. **حداقل یک API Key لازم است**: برای دریافت داده‌های واقعی
3. **Rate Limits**: API های رایگان محدودیت دارند
4. **Real Data Only**: همه داده‌ها از job boards واقعی هستند

---

**آخرین به‌روزرسانی**: 2026-01-28
