# Learning Hub – راهنمای مرحله‌به‌مرحله (استفاده از APIهای رایگان)

این سند دقیقاً مشخص می‌کند چطور از **public-apis (GitHub)**، **RapidAPI**، **freepublicapis.com** و **public-api-lists** استفاده کنیم و Learning Hub را با دادهٔ واقعی فعال کنیم.

**وضعیت:** پیاده‌سازی با API یودمی (RapidAPI – udemy-paid-courses-for-free-api) انجام شده است:
- مرحله ۱: `db.learningHubCourses` و نوع `LearningHubCourse`.
- مرحله ۲: `src/services/learningHub/fetchCourses.ts` – fetch از Udemy با `RAPIDAPI_KEY`.
- مرحله ۳: `GET /api/learning-hub/courses` و `GET/POST /api/learning-hub/sync`.
- مرحله ۴: صفحه Learning Hub از API داده می‌گیرد؛ در پنل ادمین جدول Learning Hub courses و دکمه «Sync Learning Hub courses» اضافه شده است.
- **به‌روزرسانی هر ۵ دقیقه:** از cron یا scheduler هر ۵ دقیقه `GET /api/learning-hub/sync` را فراخوانی کنید تا لیست دوره‌ها به‌روز بماند. کلید API را در `.env.local` قرار دهید: `RAPIDAPI_KEY=...`

---

## بخش ۱: از کجا API پیدا کنیم؟

### ۱. public-apis (GitHub)
- **لینک:** [github.com/public-apis/public-apis](https://github.com/public-apis/public-apis)
- **کار:** داخل README برو به **Index** و این بخش‌ها را باز کن:
  - **Jobs** – برای آگهی شغل (مثل Adzuna که الان داریم)
  - **Education** – برای دوره/آموزش (اگه دستهٔ جدا داشته باشن)
  - **Open Data** – داده‌های باز عمومی
- هر API یک ردیف جدول است: نام، توضیح، **Auth** (No / apiKey / OAuth)، **HTTPS**، **CORS**.
- برای Learning Hub: اول **Education** را چک کن؛ اگر نبود، در **Development** یا **Video** (مثلاً YouTube) دنبال دوره/پلی‌لیست آموزشی بگرد.

### ۲. RapidAPI – Free APIs
- **لینک:** [rapidapi.com/collection/list-of-free-apis](https://rapidapi.com/collection/list-of-free-apis)
- **کار:** ثبت‌نام رایگان → جستجو با کلمه‌های **"Udemy free courses"** یا **"free courses"** یا **"education"**.
- APIهایی که **Free** یا **Freemium** هستند را انتخاب کن (بدون کارت بانکی برای Free).
- برای دوره: معمولاً **Udemy Coupons / Free Courses** یا مشابه آن را انتخاب می‌کنیم؛ بعد از Subscribe به API، یک **X-RapidAPI-Key** می‌گیری و در env می‌ذاری.

### ۳. freepublicapis.com
- **لینک:** [freepublicapis.com](https://www.freepublicapis.com/)
- **کار:** دسته‌های **Work**، **Education**، **Public Data** را باز کن و APIهای رایگان را انتخاب کن.
- هر API را باز کن و **Endpoint** و **Auth** (اگر لازم است) را یادداشت کن.

### ۴. public-api-lists
- **لینک:** [public-api-lists.github.io/public-api-lists](https://public-api-lists.github.io/public-api-lists/)
- **کار:** لیست دسته‌بندی‌شده؛ همان دسته‌های Jobs, Education, Open Data را ببین و لینک مستندات هر API را باز کن.

**جمع‌بندی:** برای Learning Hub سریع‌ترین مسیر این است که در **RapidAPI** یک API مثل **Udemy Free Courses** یا **Courses** را انتخاب کنی و با یک کلید (API Key) از همانجا داده بگیری. اگر نخواستی وابسته به RapidAPI باشی، از **public-apis** یا **public-api-lists** در دسته Education/Video یکی را انتخاب کن (مثلاً YouTube Data API برای پلی‌لیست‌های آموزشی).

---

## بخش ۲: مراحل پیاده‌سازی (در پروژه)

الگوی کار مثل **Job Positions** است: یک منبع داده (JSON/DB)، یک سرویس fetch از API خارجی، یک API route داخلی، و در نهایت صفحه Learning Hub از همین API داخلی داده بگیرد.

---

### مرحله ۱: تعریف ساختار داده و دیتابیس

**۱.۱ نوع آیتم دوره (مطابق کارت فعلی Learning Hub):**

```ts
// مثلاً در src/types/learningHub.ts یا همان فایل سرویس
export type LearningHubCourse = {
  id: number;
  title: string;
  level: string;           // "Junior" | "Mid-level" | "Mid-senior" | "Senior"
  price: string;          // e.g. "$20" or "Free"
  isFree: boolean;
  source?: string;        // e.g. "Udemy", "YouTube"
  sourceUrl?: string;     // لینک به دوره
  description?: string;
  imageUrl?: string;
  createdAt?: string;
};
```

**۱.۲ اضافه کردن به `src/lib/db.ts`:**
- یک فایل جدید مثلاً `learning_hub_courses.json` (کنار `job_positions.json`).
- یک آبجکت مثل `db.learningHubCourses` با متدهای:
  - `findAll()`
  - `findById(id)`
  - `add(course)` – برای اضافه کردن یک دوره
  - `addMany(courses)` – برای ادغام بعد از sync (بر اساس `sourceUrl` یا `external_id` تکراری نذاریم)

ساختار هر رکورد در JSON می‌تواند همان فیلدهای بالا به‌همراه `external_id` و `source` و `added_at` باشد تا مثل job positions بتوان sync کرد.

**۱.۳ فایل‌های تغییر:**  
- `src/lib/db.ts` (اضافه کردن مسیر فایل + آبجکت `learningHubCourses`).

---

### مرحله ۲: سرویس fetch از API خارجی

**۲.۱ انتخاب یک API:**
- **گزینه A (پیشنهادی):** در RapidAPI یک API مثل **Udemy Free Courses** یا **Udemy Coupons, Courses & Instructors** را Subscribe کن و مستندات endpoint را ببین (معمولاً یک GET با هدر `X-RapidAPI-Key`).
- **گزینه B:** از **public-apis** در بخش Education یا Video یک API بدون احراز یا با apiKey انتخاب کن و endpoint را یادداشت کن.

**۲.۲ ایجاد فایل سرویس:**  
`src/services/learningHub/fetchCourses.ts`

- تابعی مثل `fetchCoursesFromRapidAPI()` یا `fetchCoursesFromYouTube()` بنویس که:
  - از `process.env` کلید API را بخواند (مثلاً `RAPIDAPI_KEY` یا `YOUTUBE_API_KEY`);
  - درخواست HTTP به endpoint بزند;
  - پاسخ را به آرایه‌ای از آبجکت‌های هم‌شکل `LearningHubCourse` (یا همان ساختار ذخیره در DB) map کند (title, level, price, isFree, sourceUrl, ...).
- اگر API سطح (level) یا قیمت نداشت، مقدار پیش‌فرض بگذار (مثلاً `level: "Mid-level"`, `price: "Free"`, `isFree: true` برای دوره‌های رایگان).

**۲.۳ فایل‌های تغییر:**  
- `src/services/learningHub/fetchCourses.ts` (جدید)
- در `.env.example` یک خط مثل `RAPIDAPI_KEY=` یا `UDEMY_API_KEY=` اضافه کن و در doc توضیح بده از کجا بگیرند.

---

### مرحله ۳: API routeهای داخلی

**۳.۱ لیست دوره‌ها (برای صفحه Learning Hub):**  
`src/app/api/learning-hub/courses/route.ts`

- **GET:** از `db.learningHubCourses.findAll()` بخوان و به فرمت مورد انتظار فرانت (مثلاً همان `LearningHubItem`: id, title, level, price, isFree) برگردان.
- اگر آرایه خالی بود، می‌توانی یک بار از سرویس fetch صدا بزنی و در DB بریزی و بعد همان را برگردانی (اختیاری).

**۳.۲ سینک (مثل job sync):**  
`src/app/api/learning-hub/sync/route.ts` (اختیاری ولی توصیه می‌شود)

- **GET یا POST:** صدا زدن `fetchCoursesFromRapidAPI()` (یا هر تابع fetch که نوشتی)، map کردن به رکوردهای DB، سپس `db.learningHubCourses.addMany(...)` تا تکراری‌ها اضافه نشوند.
- پاسخ JSON: تعداد اضافه‌شده، تعداد کل.

بعداً می‌توان این sync را با cron هر چند ساعت یک بار فراخوانی کرد.

**۳.۳ فایل‌های تغییر:**  
- `src/app/api/learning-hub/courses/route.ts` (جدید)
- `src/app/api/learning-hub/sync/route.ts` (جدید، اختیاری)

---

### مرحله ۴: اتصال صفحه Learning Hub به API

**۴.۱ در صفحه Learning Hub:**  
`src/app/(private)/learning-hub/page.tsx`

- به‌جای استفاده از `mockLearningHubData`، یک `fetch('/api/learning-hub/courses')` (یا با `useEffect` / React Query / SWR) بزن و نتیجه را در state ذخیره کن.
- همان state را به کامپوننت‌هایی که الان `mockLearningHubData` یا فیلترش را می‌گیرند پاس بده (مثلاً به `LearningHubContent` به‌صورت `items={courses}`).

**۴.۲ در `LearningHubContent.tsx`:**
- اگر نوع `LearningHubItem` با خروجی API یکی است (id, title, level, price, isFree)، نیازی به تغییر نیست.
- اگر API فیلدهای دیگری برمی‌گرداند (مثلاً snake_case)، یا در API route map کن به camelCase یا در کامپوننت از همان نام فیلدها استفاده کن.

**۴.۳ لودینگ و خطا:**  
- حالت loading و خطا را برای fetch اضافه کن (مثلاً یک پیام «در حال بارگذاری…» و در صورت خطا «نمی‌توان دوره‌ها را بارگذاری کرد»).

**۴.۴ فایل‌های تغییر:**  
- `src/app/(private)/learning-hub/page.tsx`
- در صورت نیاز `LearningHubContent.tsx` یا نوع `LearningHubItem`

---

## خلاصه چک‌لیست

| مرحله | کار | فایل‌ها |
|--------|-----|---------|
| ۱ | تعریف نوع + اضافه کردن `learning_hub_courses` به DB و `addMany` | `src/lib/db.ts`, نوع در `src/types/` یا سرویس |
| ۲ | نوشتن سرویس fetch از RapidAPI یا API دیگر و map به ساختار دوره | `src/services/learningHub/fetchCourses.ts`, `.env.example` |
| ۳ | GET `/api/learning-hub/courses` و در صورت تمایل GET/POST `/api/learning-hub/sync` | `src/app/api/learning-hub/courses/route.ts`, `sync/route.ts` |
| ۴ | در صفحه Learning Hub فراخوانی API و نمایش نتیجه به‌جای mock | `src/app/(private)/learning-hub/page.tsx` (و در صورت نیاز `LearningHubContent.tsx`) |

بعد از انجام این مراحل، Learning Hub با دادهٔ واقعی از یکی از همان منابع (GitHub public-apis، RapidAPI، freepublicapis، public-api-lists) فعال می‌شود. اگر بگی کدام API را انتخاب کرده‌ای (مثلاً نام دقیق از RapidAPI)، می‌توان مرحله ۲ را با نام endpoint و نمونه کد برای همان API دقیق‌تر نوشت.
