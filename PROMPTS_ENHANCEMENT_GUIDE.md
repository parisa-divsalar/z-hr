# راهنمای بهبود Prompt های ChatGPT

## خلاصه تغییرات

فایل `src/services/chatgpt/prompts.ts` به‌روزرسانی شده تا:

1. ✅ **Job Description در همه prompt ها لحاظ می‌شود**
2. ✅ **داده‌ها به صورت structured و labeled ارسال می‌شوند**
3. ✅ **خروجی‌ها ATS-friendly هستند**
4. ✅ **همه section های CV در خروجی موجودند**

---

## تغییرات در هر Prompt

### 1. `analyzeCV(cvText, jobDescription?)`

**قبل:**
```typescript
PROMPTS.analyzeCV(cvText)
```

**بعد:**
```typescript
PROMPTS.analyzeCV(cvText, jobDescription?) // jobDescription اختیاری است
```

**خروجی جدید شامل:**
- `personalInfo`
- `summary`
- `technicalSkills` (جدید)
- `professionalExperience` (جدید - ساختار یافته)
- `education` (بهبود یافته)
- `certifications` (بهبود یافته)
- `selectedProjects` (جدید)
- `languages` (بهبود یافته)
- `additionalInfo` (جدید)

**مثال استفاده:**
```typescript
const analysis = await ChatGPTService.analyzeCV(cvText, jobDescription);
// analysis شامل همه section ها با ساختار ATS-friendly است
```

---

### 2. `improveCV(section, context?, jobDescription?)`

**قبل:**
```typescript
PROMPTS.improveCV(section, context?)
```

**بعد:**
```typescript
PROMPTS.improveCV(section, context?, jobDescription?) // jobDescription اختیاری است
```

**بهبودها:**
- استفاده از keywords از job description
- خروجی ATS-friendly
- Tailor کردن متن به job requirements

**مثال استفاده:**
```typescript
const improved = await ChatGPTService.improveCVSection(
    sectionText, 
    context, 
    jobDescription
);
```

---

### 3. `improveStructuredResume(params)`

**قبل:**
```typescript
PROMPTS.improveStructuredResume({ resume, mode })
```

**بعد:**
```typescript
PROMPTS.improveStructuredResume({ 
    resume, 
    mode, 
    jobDescription?, // جدید
    structuredInput? // جدید - داده‌های labeled
})
```

**structuredInput** شامل:
```typescript
{
    personalInfo?: any;
    summary?: any;
    technicalSkills?: any;
    professionalExperience?: any;
    education?: any;
    certifications?: any;
    selectedProjects?: any;
    languages?: any;
    additionalInfo?: any;
}
```

**خروجی کامل شامل همه section ها:**
```json
{
    "personalInfo": {...},
    "summary": "...",
    "technicalSkills": [...],
    "professionalExperience": [...],
    "education": [...],
    "certifications": [...],
    "selectedProjects": [...],
    "languages": [...],
    "additionalInfo": {...}
}
```

**مثال استفاده:**
```typescript
const improved = await ChatGPTService.improveStructuredResume({
    resume: rawResume,
    mode: 'auto',
    jobDescription: jobDesc,
    structuredInput: {
        personalInfo: {...},
        summary: {...},
        technicalSkills: [...],
        // ... سایر section ها
    }
});
```

---

### 4. `generateInterviewQuestions(position, cvData, jobDescription?)`

**قبل:**
```typescript
PROMPTS.generateInterviewQuestions(position, cvData)
```

**بعد:**
```typescript
PROMPTS.generateInterviewQuestions(position, cvData, jobDescription?)
```

**خروجی جدید:**
```json
{
    "questions": ["question1", "question2", ...]
}
```

---

## ویژگی‌های ATS-Friendly

همه prompt ها اکنون:

1. ✅ از emoji و کاراکترهای خاص استفاده نمی‌کنند
2. ✅ از keywords استاندارد صنعتی استفاده می‌کنند
3. ✅ فرمت استاندارد برای تاریخ‌ها دارند
4. ✅ ساختار قابل اسکن برای ATS دارند
5. ✅ از terminology حرفه‌ای استفاده می‌کنند

---

## نحوه تست

### تست 1: Analyze CV با Job Description

```typescript
const cvText = "..."; // متن CV
const jobDesc = "..."; // شرح شغل

const result = await ChatGPTService.analyzeCV(cvText, jobDesc);

// بررسی کنید که:
console.log(result.personalInfo); // باید موجود باشد
console.log(result.technicalSkills); // باید array باشد
console.log(result.professionalExperience); // باید array باشد
console.log(result.selectedProjects); // باید array باشد
console.log(result.additionalInfo); // باید object باشد
```

### تست 2: Improve Section با Job Description

```typescript
const section = "I did some coding and stuff";
const jobDesc = "Looking for Senior React Developer with 5+ years experience";

const improved = await ChatGPTService.improveCVSection(section, null, jobDesc);

// بررسی کنید که:
// - شامل keywords از job description باشد
// - ATS-friendly باشد (no emojis, proper formatting)
// - حرفه‌ای و مختصر باشد
```

### تست 3: Improve Structured Resume

```typescript
const structuredInput = {
    personalInfo: { name: "John", email: "john@example.com" },
    summary: { text: "Experienced developer" },
    technicalSkills: ["React", "Node.js"],
    professionalExperience: [
        { text: "Worked at company X" }
    ],
    // ... سایر section ها
};

const improved = await ChatGPTService.improveStructuredResume({
    resume: rawData,
    jobDescription: jobDesc,
    structuredInput: structuredInput
});

// بررسی کنید که:
// - همه section ها در خروجی موجود باشند
// - داده‌های misplaced به section درست منتقل شده باشند
// - همه متن‌ها ATS-friendly باشند
// - keywords از job description استفاده شده باشند
```

---

## Migration Guide

### برای کدهای موجود:

1. **analyzeCV**: اگر jobDescription دارید، آن را پاس دهید (اختیاری است)
2. **improveCVSection**: اگر jobDescription دارید، آن را پاس دهید (اختیاری است)
3. **improveStructuredResume**: می‌توانید `jobDescription` و `structuredInput` را اضافه کنید (اختیاری است)

**همه تغییرات backward compatible هستند** - کدهای قدیمی بدون تغییر کار می‌کنند.

---

## نکات مهم

1. **Job Description اختیاری است** - اگر نباشد، prompt ها بدون آن کار می‌کنند
2. **structuredInput اختیاری است** - اگر نباشد، از resume raw استفاده می‌شود
3. **همه section ها در خروجی موجودند** - حتی اگر خالی باشند (empty array یا empty object)
4. **ATS-Friendly** - همه خروجی‌ها برای ATS systems بهینه شده‌اند

---

## مثال کامل

```typescript
// 1. Analyze CV با job description
const analysis = await ChatGPTService.analyzeCV(cvText, jobDescription);

// 2. Improve یک section
const improvedSummary = await ChatGPTService.improveCVSection(
    analysis.summary,
    "This is the summary section",
    jobDescription
);

// 3. Improve کل resume
const improvedResume = await ChatGPTService.improveStructuredResume({
    resume: analysis,
    mode: 'auto',
    jobDescription: jobDescription,
    structuredInput: {
        personalInfo: analysis.personalInfo,
        summary: improvedSummary,
        technicalSkills: analysis.technicalSkills || [],
        professionalExperience: analysis.professionalExperience || [],
        education: analysis.education || [],
        certifications: analysis.certifications || [],
        selectedProjects: analysis.selectedProjects || [],
        languages: analysis.languages || [],
        additionalInfo: analysis.additionalInfo || {}
    }
});

// خروجی شامل همه section ها با ساختار ATS-friendly است
console.log(improvedResume);
```

---

## سوالات متداول

**Q: آیا باید همه کدهای موجود را تغییر دهم؟**
A: خیر، همه تغییرات backward compatible هستند. می‌توانید به تدریج jobDescription را اضافه کنید.

**Q: اگر jobDescription نداشته باشم چه می‌شود؟**
A: Prompt ها بدون jobDescription هم کار می‌کنند، فقط optimization کمتری خواهند داشت.

**Q: structuredInput چیست؟**
A: داده‌های ورودی که به صورت labeled و structured هستند تا ChatGPT بداند هر داده از کدام section می‌آید.

**Q: آیا خروجی‌ها واقعاً ATS-friendly هستند؟**
A: بله، همه prompt ها دستورالعمل‌های ATS-friendly دارند و از ChatGPT می‌خواهند که خروجی را بهینه کند.

---

## پشتیبانی

اگر مشکلی داشتید یا سوالی دارید، لطفاً issue ایجاد کنید یا با تیم تماس بگیرید.
