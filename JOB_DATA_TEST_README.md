# 🧪 راهنمای تست Job Positions Data

## 📋 خلاصه

این یک **صفحه تست ساده** است برای:
- ✅ Extract کردن job data از API ها
- ✅ نمایش داده‌ها در یک صفحه تست
- ✅ آماده کردن data برای تیم Backend

**⚠️ مهم**: هیچ database جدیدی نصب نشده و هیچ تغییری در ساختار کد ایجاد نشده.

---

## 🚀 نحوه استفاده

### 1. دسترسی به صفحه تست

بعد از login، به این آدرس بروید:
```
http://localhost:3000/test-jobs
```

یا از منو:
- Dashboard → Test Jobs (اگر به منو اضافه شده باشد)

### 2. استفاده از صفحه

- **Search Box**: می‌توانید job title و location را تغییر دهید
- **Fetch Jobs**: دکمه برای fetch کردن data
- **Job Cards**: نمایش job positions
- **Raw Data**: نمایش JSON data برای تیم Backend

---

## 📡 API Endpoint

### GET `/api/jobs/test`

**Parameters:**
- `query` (optional): Job title - default: "developer"
- `location` (optional): Location - default: "Dubai"
- `limit` (optional): Number of jobs - default: 20

**Example:**
```
GET /api/jobs/test?query=react&location=Dubai&limit=10
```

**Response:**
```json
{
  "success": true,
  "count": 10,
  "jobs": [
    {
      "id": "1",
      "title": "Senior Frontend Developer",
      "company": "Tech Company",
      "location": "Dubai, UAE",
      "locationType": "remote",
      "description": "...",
      "techStack": ["React", "Next.js"],
      "salaryMin": 5000,
      "salaryMax": 8000,
      "source": "jobdata",
      ...
    }
  ]
}
```

---

## 🔧 تنظیمات

### API Key (اختیاری)

اگر می‌خواهید از JobData API استفاده کنید:

1. ثبت نام در https://jobdataapi.com/
2. دریافت API key
3. اضافه کردن به `.env.local`:

```env
JOB_DATA_API_KEY=your-api-key-here
```

**نکته**: اگر API key نباشد، از mock data استفاده می‌شود.

---

## 📊 ساختار Data

هر job position شامل این فیلدهاست:

```typescript
{
  id?: string;                    // External ID from API
  title: string;                   // Job title
  company: string;                 // Company name
  location?: string;               // Location (e.g., "Dubai, UAE")
  locationType?: 'remote' | 'hybrid' | 'onsite';
  description?: string;            // Job description
  requirements?: string;           // Job requirements
  techStack?: string[];           // Technologies (extracted)
  salaryMin?: number;              // Minimum salary
  salaryMax?: number;              // Maximum salary
  salaryCurrency?: string;         // Currency (default: USD)
  employmentType?: string;         // full-time, part-time, etc.
  experienceLevel?: string;        // entry, mid, senior, lead
  postedDate?: string;            // ISO date string
  applicationUrl?: string;        // URL to apply
  source: string;                  // API source (jobdata, indeed, mock)
  sourceUrl?: string;             // Original job URL
}
```

---

## 🎯 استفاده برای تیم Backend

### داده‌های آماده:

1. **Format**: JSON structure مشخص شده
2. **Source**: از API های مختلف قابل دریافت
3. **Extraction**: Tech stack و skills به صورت خودکار extract می‌شوند

### پیشنهادات برای Backend:

1. **Database Schema**: می‌توانند از structure موجود استفاده کنند
2. **API Integration**: می‌توانند از همین service استفاده کنند
3. **Update Frequency**: می‌توانند cron job برای هر 10 دقیقه setup کنند

---

## 🧪 تست

### تست 1: با Mock Data

```bash
# بدون API key - از mock data استفاده می‌شود
curl http://localhost:3000/api/jobs/test
```

### تست 2: با API Key

```bash
# با API key واقعی
curl http://localhost:3000/api/jobs/test?query=developer&location=Dubai
```

### تست 3: از Browser

1. Login کنید
2. بروید به `/test-jobs`
3. دکمه "Fetch Jobs" را بزنید
4. داده‌ها را مشاهده کنید

---

## 📝 فایل‌های ایجاد شده

1. ✅ `src/services/jobs/fetchJobs.ts` - Service برای fetch کردن jobs
2. ✅ `src/app/api/jobs/test/route.ts` - API endpoint
3. ✅ `src/app/(private)/test-jobs/page.tsx` - صفحه تست
4. ✅ `src/config/routes.ts` - اضافه شدن route

---

## ⚠️ نکات مهم

1. **No Database**: داده‌ها فقط fetch می‌شوند و نمایش داده می‌شوند
2. **Mock Data**: اگر API key نباشد، از mock data استفاده می‌شود
3. **Simple**: فقط برای تست و extract کردن data
4. **Ready for Backend**: داده‌ها آماده برای ذخیره در database هستند

---

## 🔄 مراحل بعدی (برای تیم Backend)

1. بررسی structure داده‌ها
2. تصمیم گیری درباره database schema
3. Setup database و ذخیره داده‌ها
4. Setup cron job برای update هر 10 دقیقه
5. Integration با dashboard

---

**آخرین به‌روزرسانی**: 2026-01-28
