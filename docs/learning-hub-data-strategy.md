# Learning Hub – What It Is & How to Get Real Data

## 1. Learning Hub در پروژه چیه؟

**Learning Hub** یک صفحه داخل داشبورد کاربر است (`/learning-hub`) که:
- **مسیرهای یادگیری (دوره‌ها)** را به کاربر نشان می‌دهد (مثل Front-end Path, Back-end Path, Full Stack, DevOps, UI/UX, Mobile).
- تب‌ها: **All** / **Free** / **Paid**
- سورت: **Newest**, **Oldest**, **Free first**
- هر آیتم با کارت `SkillGapCard` نمایش داده می‌شود با فیلدهای: **title**, **level**, **price**, **isFree** (و اختیاری **image**).

**جای فعلی در کد:**
- صفحه: `src/app/(private)/learning-hub/page.tsx`
- محتوا و دادهٔ mock: `src/app/(private)/learning-hub/LearningHubContent.tsx`
- کارت هر دوره: `src/app/(private)/history-edite/Components/SkillGapCard.tsx`

**ساختار فعلی هر آیتم (mock):**
```ts
type LearningHubItem = {
  id: number;
  title: string;   // e.g. "Front-end Path"
  level: string;   // "Junior" | "Mid-level" | "Mid-senior" | "Senior"
  price: string;   // e.g. "$20"
  isFree: boolean;
  // optional: image?: string; description?: string; url?: string;
};
```

الان همهٔ این داده‌ها **ثابت و mock** داخل `LearningHubContent.tsx` هستند و از دیتابیس یا API نمی‌آیند.

---

## 2. راهکار دیتابیس (مشابه Job Positions)

برای اینکه دادهٔ Learning Hub را «جمع» کنیم و مثل job positions در دیتابیس داشته باشیم:

1. **یک جدول/منبع داده در DB** (مثلاً فایل JSON یا بعداً جدول SQL):
   - فیلدها: `id`, `title`, `level`, `price`, `is_free`, `source`, `source_url`, `description`, `image_url`, `created_at`, ...
2. **یک سرویس fetch** که از APIهای خارجی دوره بگیرد و در همین جدول بریزد (مثلاً هر ۱۰ دقیقه یا یک بار روزانه).
3. **صفحه Learning Hub** به‌جای `mockLearningHubData` از همین منبع (API داخلی یا مستقیم از DB) داده بگیرد.

تا وقتی تیم بکند تصمیم نگیره دیتابیس کجا باشد (فایل JSON / SQL / …)، می‌توان فقط سرویس fetch و یک API route موقت (مثلاً `/api/learning-hub/courses`) نوشت که خروجی را به همان فرمت `LearningHubItem` برگرداند؛ بعداً منبع را به DB وصل می‌کنیم.

---

## 3. از چه APIهایی می‌شود برای دوره‌ها استفاده کرد؟

### گزینه‌های رایگان / کم‌هزینه

| منبع | نوع | توضیح کوتاه |
|------|-----|-------------|
| **YouTube Data API** | ویدیو / پلی‌لیست | پلی‌لیست‌های آموزشی (مثلاً "React course"). نیاز به API key از Google Cloud. رایگان با سهمیه. |
| **RapidAPI – Free Courses / Udemy Free** | لیست دوره | چند API آماده برای لیست دوره‌های رایگان. با کلید RapidAPI. |
| **OpenCourseWare (OCW)** | دوره دانشگاهی | MIT و سایر دانشگاه‌ها؛ اغلب دیتاست/صفحه ثابت؛ ممکن است نیاز به اسکرپ یا دیتاست آماده باشد. |
| **Alison** | دوره رایگان | دوره‌های رایگان؛ معمولاً از طریق اسکرپ یا اگر API رسمی دادند. |

### گزینه‌های پولی / پارتنری

| منبع | توضیح |
|------|--------|
| **Udemy** | API برای پارتنرها؛ دوره‌های پولی و گاهی رایگان. |
| **Coursera** | API محدود؛ بیشتر برای پارتنرها. |
| **edX** | دسترسی به کاتالوگ دوره‌ها. |
| **Pluralsight / LinkedIn Learning** | معمولاً با قرارداد پارتنری. |

### پیشنهاد برای شروع (با کمترین وابستگی)

1. **RapidAPI**
   - جستجو در RapidAPI با عبارت "free courses" یا "udemy free courses".
   - یکی از APIهایی که خروجی ساده (title, url, سطح، رایگان/پولی) دارد را انتخاب کنید.
   - یک سرویس در پروژه (مثلاً `src/services/learningHub/fetchCourses.ts`) بنویسید که این API را صدا بزند و خروجی را به فرمت `LearningHubItem` (یا جدول آینده) map کند.

2. **YouTube Data API**
   - برای محتوای ویدیویی آموزشی.
   - خروجی را به «دوره» (یک پلی‌لیست = یک دوره با title, thumbnail, link) map کنید و در همان ساختار بالا بریزید.

3. **لیست ثابت + بعداً API**
   - می‌توان همان mock فعلی را به یک JSON در پروژه یا در `data/` منتقل کرد و از API داخلی سرو کرد؛ بعداً وقتی یکی از APIهای بالا را وصل کردید، همان endpoint را عوض می‌کنید تا از API خارجی پر شود.

---

## 4. مراحل پیشنهادی (قدم‌به‌قدم)

| مرحله | کار |
|--------|-----|
| ۱ | تعیین منبع داده: فقط لیست ثابت از JSON، یا یکی از APIهای بالا (مثلاً RapidAPI یا YouTube). |
| ۲ | تعریف ساختار نهایی دوره در پروژه (همان فیلدهای بالا + هر فیلد اضافه مثل `category`, `duration`). |
| ۳ | اگر دیتابیس (فایل JSON یا DB) از طرف تیم بکند تأیید شد: اضافه کردن جدول/فایل `learning_hub_courses` و سرویس ذخیره/بروزرسانی. |
| ۴ | نوشتن سرویس fetch از API خارجی و map به همین ساختار؛ در صورت نیاز cron یا API route برای بروزرسانی دوره‌ها. |
| ۵ | تغییر صفحه Learning Hub تا به‌جای mock از API داخلی (یا مستقیم از DB) داده بگیرد. |

اگر بگی کدام گزینه را ترجیح می‌دهی (فقط لیست ثابت، RapidAPI، یا YouTube)، می‌توان مرحله ۲ و ۳ و ۴ را دقیق‌تر (با نام فایل‌ها و نمونه کد) برای همین پروژه نوشت.

---

## 5. مسیرهای رایگان – Third-party APIهای واقعی (مثل Adzuna)

چند منبع **رایگان یا با پلن رایگان** که **دادهٔ واقعی** می‌دهند و شبیه Adzuna قابل استفاده در پروژه هستند:

### شغل (Job Positions) – الان داریم

| سرویس | نوع | لینک | توضیح |
|--------|-----|------|--------|
| **Adzuna** | رایگان | [developer.adzuna.com](https://developer.adzuna.com/) | الان در پروژه استفاده می‌شود. ثبت‌نام → app_id + app_key. دادهٔ واقعی آگهی‌ها و حقوق. |
| **JSearch** | رایگان (RapidAPI) | RapidAPI → "JSearch" | جستجوی شغل؛ با کلید RapidAPI. |
| **Arbeitnow** | رایگان | public APIs lists | لیست شغل؛ بعضی بدون احراز هویت. |

### دوره / آموزش (Learning Hub)

| سرویس | نوع | لینک | توضیح |
|--------|-----|------|--------|
| **Udemy Coupons / Free Courses API** | رایگان (RapidAPI) | [RapidAPI – Udemy](https://rapidapi.com/hub) جستجو: "Udemy free courses" | دوره‌های رایگان یودمی؛ فیلدها: نام، قیمت، لکتور، ویو، ریتینگ، زبان، دسته. معمولاً free tier دارند. |
| **Udemy Coupons, Courses & Instructors** | رایگان (RapidAPI) | همان RapidAPI | دادهٔ دوره + کوپن + مدرس؛ free tier؛ گاهی بدون کارت. |
| **YouTube Data API** | رایگان (سهمیه) | [Google Cloud – YouTube Data API](https://developers.google.com/youtube/v3) | پلی‌لیست‌های آموزشی = دوره؛ نیاز به API key گوگل. |
| **freecourses_API (GitHub)** | رایگان | [TuhinBar/freecourses_API](https://github.com/TuhinBar/freecourses_API) | API برای دوره‌های رایگان از چند منبع (udemy و غیره). |

### لیست‌های کلی APIهای رایگان (برای پیدا کردن سرویس‌های دیگر)

| منبع | لینک | توضیح |
|------|------|--------|
| **public-apis (GitHub)** | [github.com/public-apis/public-apis](https://github.com/public-apis/public-apis) | لیست بزرگ APIهای رایگان؛ دسته‌بندی Jobs, Education, Open Data. |
| **RapidAPI – Free APIs** | [RapidAPI – list of free APIs](https://rapidapi.com/collection/list-of-free-apis) | APIهای واقعاً رایگان (بدون کارت). |
| **Free Public APIs** | [freepublicapis.com](https://www.freepublicapis.com/) | صدها API تست‌شده؛ دسته Work, Education, Public Data. |
| **public-api-lists** | [public-api-lists.github.io](https://public-api-lists.github.io/public-api-lists/) | لیست دسته‌بندی‌شده؛ Jobs, Education و غیره. |

### خلاصه برای «رایگان + داده واقعی»

- **شغل:** Adzuna (الان داریم)؛ در صورت نیاز JSearch از RapidAPI.
- **دوره (Learning Hub):** سریع‌ترین مسیر: یکی از APIهای **Udemy Free / Courses** روی RapidAPI (ثبت‌نام RapidAPI رایگان است و free tier معمولاً کافی است).
- **سایر داده‌ها:** از لیست‌های بالا برو تو دسته Education یا Jobs و APIهایی که "Free" یا "No Auth" دارند را انتخاب کن.

همهٔ این سرویس‌ها third-party و مستقل از سرور خودمان هستند؛ فقط با یک درخواست HTTP و (در صورت نیاز) یک API key دادهٔ واقعی برمی‌گردانند.
