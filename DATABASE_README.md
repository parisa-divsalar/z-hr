# 📚 راهنمای کامل Database محلی پروژه Z-HR

## 📍 مکان Database

Database محلی این پروژه در فولدر **`data/`** در root پروژه قرار دارد و شامل فایل‌های JSON زیر است:

```
data/
├── users.json          # اطلاعات کاربران
├── cvs.json            # رزومه‌های ذخیره شده
├── skills.json         # لیست مهارت‌ها
├── user_skills.json    # مهارت‌های کاربران
└── interview_sessions.json  # جلسات مصاحبه
```

---

## 🏗️ معماری Database

### نوع Database
این پروژه از **File-based JSON Database** استفاده می‌کند که:
- داده‌ها در فایل‌های JSON ذخیره می‌شوند
- خواندن و نوشتن با `fs.readFile` و `fs.writeFile` انجام می‌شود
- برای development و local testing استفاده می‌شود

### External API
علاوه بر database محلی، این پروژه از یک **External API** نیز استفاده می‌کند:
- **Base URL**: `https://apisrv.zenonrobotics.ae/api/`
- **Client**: `apiClientServer` در `src/services/api-client.ts`
- **استفاده**: اکثر API routes از این external API استفاده می‌کنند

---

## 📊 ساختار هر Table (JSON File)

### 1. `users.json` - کاربران

**ساختار:**
```json
[
  {
    "id": 1,
    "email": "user@example.com",
    "password_hash": "$2a$10$...",
    "name": "نام کاربر",
    "created_at": "2026-01-06T11:34:34.823Z",
    "updated_at": "2026-01-06T11:34:34.823Z"
  }
]
```

**استفاده:**
- ذخیره اطلاعات کاربران
- Authentication و Authorization
- **منبع ورودی**: API routes در `src/app/api/auth/`

**API Routes مرتبط:**
- `POST /api/auth/register` - ثبت کاربر جدید
- `POST /api/auth/login` - ورود کاربر
- `POST /api/auth/update-password` - تغییر رمز عبور
- `POST /api/auth/forgot-password` - بازیابی رمز عبور

---

### 2. `cvs.json` - رزومه‌ها

**ساختار:**
```json
[
  {
    "id": 1,
    "user_id": 1,
    "request_id": "uuid-string",
    "content": "{}", // JSON stringified resume data
    "analysis_result": "{}", // JSON stringified analysis
    "created_at": "2026-01-06T11:34:34.823Z",
    "updated_at": "2026-01-06T11:34:34.823Z"
  }
]
```

**استفاده:**
- ذخیره رزومه‌های تولید شده
- نگهداری نتایج تحلیل CV
- **منبع ورودی**: API routes در `src/app/api/cv/`

**API Routes مرتبط:**
- `POST /api/cv/add-cv` - اضافه کردن رزومه جدید
- `GET /api/cv/get-cv` - دریافت رزومه
- `POST /api/cv/edit-cv` - ویرایش رزومه
- `POST /api/cv/add-cover-letter` - اضافه کردن نامه پوششی
- `GET /api/cv/get-cover-letter` - دریافت نامه پوششی

**جریان داده:**
1. کاربر در Wizard اطلاعات وارد می‌کند (`src/components/Landing/Wizard/`)
2. داده‌ها در `useWizardStore` ذخیره می‌شوند (`src/store/wizard/`)
3. با کلیک روی "Generate Resume"، داده‌ها به API ارسال می‌شوند
4. API route داده‌ها را به External API ارسال می‌کند
5. External API داده‌ها را پردازش و در database ذخیره می‌کند
6. نتیجه به frontend برگردانده می‌شود

---

### 3. `skills.json` - مهارت‌ها

**ساختار:**
```json
[
  {
    "id": 1,
    "name": "React",
    "category": "Web Frameworks",
    "created_at": "2026-01-06T12:16:13.758Z"
  },
  {
    "id": 2,
    "name": "Node.js",
    "category": "Web Frameworks",
    "created_at": "2026-01-06T12:16:13.758Z"
  }
]
```

**استفاده:**
- لیست کامل مهارت‌های موجود در سیستم
- دسته‌بندی مهارت‌ها (Web Frameworks, Database, Mobile Development, etc.)
- **منبع ورودی**: Seed script یا External API

**API Routes مرتبط:**
- `GET /api/slills-categories` - دریافت دسته‌بندی مهارت‌ها
- `GET /api/categories-name?category=...` - دریافت مهارت‌های یک دسته

**جریان داده:**
1. مهارت‌ها از External API دریافت می‌شوند (`Apps/SlillsCategories`)
2. در frontend نمایش داده می‌شوند
3. کاربر مهارت‌های خود را انتخاب می‌کند
4. مهارت‌های انتخاب شده در `wizardData.skills` ذخیره می‌شوند

---

### 4. `user_skills.json` - مهارت‌های کاربران

**ساختار:**
```json
[
  {
    "id": 1,
    "user_id": 1,
    "skill_id": 5,
    "created_at": "2026-01-06T12:16:13.758Z"
  }
]
```

**استفاده:**
- ارتباط بین کاربران و مهارت‌هایشان
- نگهداری مهارت‌های انتخاب شده توسط هر کاربر
- **منبع ورودی**: از External API یا از Wizard

**جریان داده:**
1. کاربر در Wizard مهارت‌های خود را انتخاب می‌کند
2. مهارت‌ها در `wizardData.skills` ذخیره می‌شوند
3. هنگام ذخیره رزومه، مهارت‌ها به External API ارسال می‌شوند
4. External API ارتباط user-skill را در database ذخیره می‌کند

---

### 5. `interview_sessions.json` - جلسات مصاحبه

**ساختار:**
```json
[
  {
    "id": 1,
    "user_id": 1,
    "position": "Senior Developer",
    "questions": ["question1", "question2", ...],
    "answers": ["answer1", "answer2", ...],
    "created_at": "2026-01-06T12:16:13.758Z"
  }
]
```

**استفاده:**
- ذخیره جلسات مصاحبه کاربران
- نگهداری سوالات و پاسخ‌های مصاحبه
- **منبع ورودی**: از External API

**API Routes مرتبط:**
- `GET /api/interview/questions` - دریافت سوالات مصاحبه
- (احتمالاً routes دیگری برای ذخیره جلسات)

---

## 🔄 جریان داده در کل سیستم

### 1. ثبت نام / ورود کاربر

```
User Input (Frontend)
    ↓
POST /api/auth/register or /api/auth/login
    ↓
apiClientServer.post('Apps/Register' or 'Apps/Login')
    ↓
External API (https://apisrv.zenonrobotics.ae/api/)
    ↓
Database (users.json یا External Database)
    ↓
Response با userId
    ↓
Cookie set می‌شود (accessToken)
```

### 2. تولید رزومه

```
User fills Wizard (Step 1, 2, 3)
    ↓
useWizardStore ذخیره می‌کند (local state)
    ↓
User clicks "Generate Resume"
    ↓
POST /api/cv/add-cv
    Body: { userId, requestId, bodyOfResume }
    ↓
apiClientServer.post('Apps/AddCV')
    ↓
External API پردازش می‌کند
    ↓
External API ذخیره می‌کند در database
    ↓
Response با CV data
    ↓
Frontend نمایش می‌دهد در ResumeEditor
```

### 3. دریافت رزومه

```
User opens Resume Editor
    ↓
GET /api/cv/get-cv?userId=...&requestId=...
    ↓
apiClientServer.get('Apps/GetCV')
    ↓
External API خواندن از database
    ↓
Response با CV data
    ↓
Frontend نمایش می‌دهد
```

### 4. تحلیل رزومه با ChatGPT

```
User uploads CV file
    ↓
POST /api/cv/analyze
    ↓
ChatGPTService.analyzeCV(cvText, jobDescription?)
    ↓
OpenAI API
    ↓
Structured JSON response
    ↓
POST /api/cv/add-cv (ذخیره نتیجه)
    ↓
External API ذخیره می‌کند
```

---

## 🛠️ نحوه استفاده از Database

### Pattern استفاده شده: Repository Pattern

این پروژه از **Repository Pattern** استفاده می‌کند که نمونه آن در `shared/blog/repository.ts` موجود است:

```typescript
// خواندن از فایل JSON
async function readRepository(): Promise<BlogArticle[]> {
  try {
    const fileContent = await fsPromises.readFile(articlesFilePath, 'utf-8');
    return JSON.parse(fileContent) ?? [];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      await writeRepository([]);
      return [];
    }
    throw error;
  }
}

// نوشتن به فایل JSON
async function writeRepository(articles: BlogArticle[]): Promise<void> {
  await fsPromises.writeFile(
    articlesFilePath, 
    JSON.stringify(articles, null, 2), 
    'utf-8'
  );
}
```

### مثال: ایجاد یک Repository برای Users

```typescript
// src/lib/repositories/users.repository.ts
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const fsPromises = fs.promises;
const usersFilePath = path.resolve(process.cwd(), 'data', 'users.json');

export interface User {
  id: number;
  email: string;
  password_hash: string;
  name: string | null;
  created_at: string;
  updated_at: string;
}

async function readUsers(): Promise<User[]> {
  try {
    const fileContent = await fsPromises.readFile(usersFilePath, 'utf-8');
    return JSON.parse(fileContent) ?? [];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      await writeUsers([]);
      return [];
    }
    throw error;
  }
}

async function writeUsers(users: User[]): Promise<void> {
  await fsPromises.writeFile(
    usersFilePath,
    JSON.stringify(users, null, 2),
    'utf-8'
  );
}

export async function getAllUsers(): Promise<User[]> {
  return readUsers();
}

export async function getUserById(id: number): Promise<User | null> {
  const users = await readUsers();
  return users.find(u => u.id === id) ?? null;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const users = await readUsers();
  return users.find(u => u.email === email) ?? null;
}

export async function createUser(user: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
  const users = await readUsers();
  const newUser: User = {
    ...user,
    id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  const updated = [...users, newUser];
  await writeUsers(updated);
  return newUser;
}

export async function updateUser(id: number, updates: Partial<User>): Promise<User | null> {
  const users = await readUsers();
  const index = users.findIndex(u => u.id === id);
  if (index === -1) return null;
  
  const updated = {
    ...users[index],
    ...updates,
    updated_at: new Date().toISOString(),
  };
  users[index] = updated;
  await writeUsers(users);
  return updated;
}

export async function deleteUser(id: number): Promise<boolean> {
  const users = await readUsers();
  const filtered = users.filter(u => u.id !== id);
  if (filtered.length === users.length) return false;
  await writeUsers(filtered);
  return true;
}
```

---

## 📝 نکات مهم

### 1. External API vs Local Database

- **External API**: برای production استفاده می‌شود
- **Local Database (JSON files)**: برای development و testing

### 2. Thread Safety

⚠️ **هشدار**: File-based database برای concurrent writes مناسب نیست. اگر چند request همزمان بخواهند بنویسند، ممکن است data loss رخ دهد.

**راه حل**: استفاده از file locking یا migration به یک database واقعی (SQLite, PostgreSQL, etc.)

### 3. Backup

همیشه از فایل‌های JSON در `data/` backup بگیرید:
```bash
cp -r data/ data-backup-$(date +%Y%m%d)/
```

### 4. Migration به Database واقعی

برای production، بهتر است از یک database واقعی استفاده شود:
- **SQLite**: برای small-scale applications
- **PostgreSQL**: برای production applications
- **MongoDB**: برای document-based storage

---

## 🔍 بررسی کدهای مرتبط

### فایل‌های کلیدی:

1. **API Client**: `src/services/api-client.ts`
   - مدیریت ارتباط با External API

2. **API Routes**: `src/app/api/**/route.ts`
   - Endpoint های مختلف برای CRUD operations

3. **Repository Pattern**: `shared/blog/repository.ts`
   - نمونه implementation برای file-based database

4. **Wizard Store**: `src/store/wizard/useWizardStore.ts`
   - مدیریت state در frontend

5. **Data Files**: `data/*.json`
   - فایل‌های JSON database

---

## 🧪 تست Database

### تست خواندن:
```typescript
import { getAllUsers } from '@/lib/repositories/users.repository';

const users = await getAllUsers();
console.log('Users:', users);
```

### تست نوشتن:
```typescript
import { createUser } from '@/lib/repositories/users.repository';

const newUser = await createUser({
  email: 'test@example.com',
  password_hash: 'hashed_password',
  name: 'Test User',
});
console.log('Created user:', newUser);
```

---

## 📚 منابع بیشتر

- [Next.js API Routes Documentation](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Node.js File System](https://nodejs.org/api/fs.html)
- [Repository Pattern](https://martinfowler.com/eaaCatalog/repository.html)

---

## ❓ سوالات متداول

**Q: آیا می‌توانم مستقیماً فایل‌های JSON را ویرایش کنم؟**
A: بله، اما بهتر است از API routes یا repository functions استفاده کنید تا consistency حفظ شود.

**Q: چرا از External API استفاده می‌شود؟**
A: برای production و scalability بهتر است. Local JSON files برای development هستند.

**Q: چگونه می‌توانم database را reset کنم؟**
A: فایل‌های JSON را به حالت اولیه برگردانید یا خالی کنید (empty array `[]`).

**Q: آیا می‌توانم از SQLite استفاده کنم؟**
A: بله، می‌توانید یک migration script بنویسید که JSON files را به SQLite تبدیل کند.

---

**آخرین به‌روزرسانی**: 2026-01-28
**نگهدارنده**: تیم توسعه Z-HR
