# 📚 API Routes Documentation - سرویس‌های جدید

این فولدر شامل مستندات و سازماندهی تمام API های جدید پروژه است که از Database محلی و ChatGPT استفاده می‌کنند.

---

## 🔐 Authentication APIs (با Database محلی)

### 1. `/api/auth/login` - POST
**تغییرات:**
- ❌ قدیمی: `apiClientServer.post('Apps/Login')` - سرور خارجی
- ✅ جدید: `db.users.findByEmail()` + JWT + bcryptjs

**فایل:** `src/app/api/auth/login/route.ts`

---

### 2. `/api/auth/register` - POST
**تغییرات:**
- ❌ قدیمی: `apiClientServer.post('Apps/RegisterByUserAndPassword')` - سرور خارجی
- ✅ جدید: `db.users.create()` + bcryptjs

**فایل:** `src/app/api/auth/register/route.ts`

---

### 3. `/api/auth/update-password` - POST
**تغییرات:**
- ❌ قدیمی: `apiClientServer.post('Apps/UpdatePassword/${userId}')` - سرور خارجی
- ✅ جدید: `db.users.update()` + JWT + bcryptjs

**فایل:** `src/app/api/auth/update-password/route.ts`

---

## 📄 CV APIs

### 4. `/api/cv/get-cv` - GET
**تغییرات:**
- ❌ قدیمی: `apiClientServer.get('Apps/GetCV')` - سرور خارجی
- ✅ جدید: `db.cvs.findByRequestId()` + JWT authentication

**فایل:** `src/app/api/cv/get-cv/route.ts`

---

### 5. `/api/cv/add-cv` - POST
**تغییرات:**
- ❌ قدیمی: `apiClientServer.post('Apps/AddCV')` - سرور خارجی
- ✅ جدید: `db.cvs.create()` یا `db.cvs.update()` + JWT

**فایل:** `src/app/api/cv/add-cv/route.ts`

---

### 6. `/api/cv/edit-cv` - PUT
**تغییرات:**
- ❌ قدیمی: `apiClientServer.put('Apps/EditCV')` - سرور خارجی
- ✅ جدید: `db.cvs.update()` یا `db.cvs.create()` + JWT

**فایل:** `src/app/api/cv/edit-cv/route.ts`

---

### 7. `/api/cv/analyze` - POST ⭐ **جدید**
**قابلیت:**
- ✅ تحلیل CV با ChatGPT
- ✅ ذخیره خودکار در Database
- ✅ پشتیبانی از wizardData

**جایگزین:** `/api/cv/send-file` (قدیمی)

**فایل:** `src/app/api/cv/analyze/route.ts`

---

### 8. `/api/cv/improve` - POST ⭐ **جدید**
**قابلیت:**
- ✅ بهبود بخش‌های CV با ChatGPT
- ✅ پشتیبانی از `isFinalStep` flag

**جایگزین:** `/api/cv/post-improved` و `/api/cv/get-improved` (قدیمی)

**فایل:** `src/app/api/cv/improve/route.ts`

---

### 9. `/api/cv/cover-letter` - POST ⭐ **جدید**
**قابلیت:**
- ✅ تولید Cover Letter با ChatGPT
- ✅ پشتیبانی از `isFinalStep` flag

**فایل:** `src/app/api/cv/cover-letter/route.ts`

---

## 🎯 Skills APIs

### 10. `/api/skills/categories` - GET ⭐ **جدید**
**قابلیت:**
- ✅ لیست دسته‌بندی مهارت‌ها (لیست ثابت)
- ✅ آماده برای ChatGPT در آینده

**جایگزین:** `/api/slills-categories` (قدیمی)

**فایل:** `src/app/api/skills/categories/route.ts`

---

### 11. `/api/skills/by-category` - GET ⭐ **جدید**
**قابلیت:**
- ✅ دریافت مهارت‌های یک دسته از Database
- ✅ `db.skills.findByCategory()`

**جایگزین:** `/api/categories-name` (قدیمی)

**فایل:** `src/app/api/skills/by-category/route.ts`

---

### 12. `/api/skills/analyze-gap` - POST ⭐ **جدید**
**قابلیت:**
- ✅ تحلیل Skill Gap با ChatGPT
- ✅ مقایسه CV با job description

**فایل:** `src/app/api/skills/analyze-gap/route.ts`

---

## 💼 Interview APIs

### 13. `/api/interview/questions` - POST ⭐ **جدید**
**قابلیت:**
- ✅ تولید سوالات مصاحبه با ChatGPT
- ✅ ذخیره session در Database
- ✅ پشتیبانی از JWT authentication

**فایل:** `src/app/api/interview/questions/route.ts`

---

## 📝 Resume APIs

### 14. `/api/resume/generate` - POST/GET ⭐ **جدید**
**قابلیت:**
- ✅ تولید بخش‌های رزومه از wizard data
- ✅ پشتیبانی از `resume_dirty` flag
- ✅ پشتیبانی از user overrides

**فایل:** `src/app/api/resume/generate/route.ts`

---

### 15. `/api/resume/save-override` - POST ⭐ **جدید**
**قابلیت:**
- ✅ ذخیره user override برای یک section
- ✅ تنظیم `resume_dirty` flag

**فایل:** `src/app/api/resume/save-override/route.ts`

---

## 📁 Files APIs

### 16. `/api/files/extract-text` - POST ⭐ **جدید**
**قابلیت:**
- ✅ استخراج متن از فایل با ChatGPT
- ✅ پشتیبانی از PDF, DOCX و غیره

**فایل:** `src/app/api/files/extract-text/route.ts`

---

## 🧙 Wizard APIs

### 17. `/api/wizard/save` - POST/GET ⭐ **جدید**
**قابلیت:**
- ✅ ذخیره مرحله‌ای اطلاعات wizard
- ✅ دریافت اطلاعات wizard ذخیره شده
- ✅ پشتیبانی از JWT authentication

**فایل:** `src/app/api/wizard/save/route.ts`

---

## 📊 خلاصه تغییرات

### Migration از API خارجی به Database محلی:
- ✅ Authentication APIs (login, register, update-password)
- ✅ CV APIs (get-cv, add-cv, edit-cv)
- ✅ Skills APIs (by-category)

### Migration از API خارجی به ChatGPT:
- ✅ CV Analysis (`/api/cv/analyze`)
- ✅ CV Improvement (`/api/cv/improve`)
- ✅ Cover Letter Generation (`/api/cv/cover-letter`)
- ✅ Skill Gap Analysis (`/api/skills/analyze-gap`)
- ✅ Interview Questions (`/api/interview/questions`)
- ✅ Text Extraction (`/api/files/extract-text`)

### قابلیت‌های جدید:
- ✅ Resume Generation (`/api/resume/generate`)
- ✅ Resume Override (`/api/resume/save-override`)
- ✅ Wizard Data Management (`/api/wizard/save`)

---

## 🔧 وابستگی‌ها

### Database:
- `@/lib/db` - SQLite database با tables: users, cvs, skills, interview_sessions, wizard_data

### ChatGPT:
- `@/services/chatgpt/service` - ChatGPTService
- `@/services/chatgpt/client` - OpenAI client
- `@/services/chatgpt/prompts` - Prompt templates

### Authentication:
- `jsonwebtoken` - JWT token generation/verification
- `bcryptjs` - Password hashing

---

## 📝 نکات مهم

1. **فایل‌های با علامت ⭐:** API های جدید هستند
2. **فایل‌های قدیمی:** هنوز وجود دارند اما دیگر استفاده نمی‌شوند
3. **JWT Authentication:** تمام API های جدید از JWT استفاده می‌کنند
4. **Database:** تمام داده‌ها در SQLite database محلی ذخیره می‌شوند
5. **ChatGPT:** برای قابلیت‌های AI از OpenAI ChatGPT API استفاده می‌شود

---

## 🚀 نحوه استفاده

### مثال: استفاده از API جدید برای تحلیل CV

```typescript
// قدیمی (دیگر استفاده نمی‌شود)
const response = await fetch('/api/cv/send-file', {
  method: 'POST',
  body: formData
});

// جدید
const response = await fetch('/api/cv/analyze', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    cvText: '...',
    userId: '123',
    requestId: 'req_123'
  })
});
```

---

**آخرین به‌روزرسانی:** 2026-01-26
**نسخه:** 2.0.0
