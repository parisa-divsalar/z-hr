# 🗄️ راهنمای کامل ذخیره‌سازی Database و Migration به SQL/Docker

## 📍 کجا داده‌ها ذخیره می‌شوند؟

### وضعیت فعلی:

#### 1. **External API Server** (Production - واقعی)
- **URL**: `https://apisrv.zenonrobotics.ae/api/`
- **نوع Database**: احتمالاً **SQL Server** یا **PostgreSQL** (در سرور external)
- **مکان**: داده‌ها در سرور external ذخیره می‌شوند
- **استفاده**: همه API calls در production به این سرور می‌روند

```
Frontend → Next.js API Routes → External API (apisrv.zenonrobotics.ae) → SQL Database
```

#### 2. **Local JSON Files** (Development - فعلی)
- **مکان**: `./data/*.json`
- **نوع**: File-based JSON storage
- **استفاده**: فقط برای development و testing
- **مشکل**: برای production مناسب نیست (no concurrency, no transactions)

---

## ❓ آیا فایل‌های JSON لازم هستند؟

### پاسخ: **بستگی دارد به استراتژی شما**

#### ✅ **اگر می‌خواهید مستقل باشید:**
- **بله، لازم هستند** - باید یک database محلی داشته باشید
- باید migration به SQL/Docker انجام دهید

#### ❌ **اگر فقط از External API استفاده می‌کنید:**
- **خیر، لازم نیستند** - می‌توانید حذف کنید
- اما برای development و testing مفید هستند

---

## 🚀 راه‌حل 1: Migration به SQLite (ساده‌ترین)

SQLite برای development و small-scale production مناسب است.

### نصب Dependencies:

```bash
npm install better-sqlite3
npm install --save-dev @types/better-sqlite3
```

### ساخت Database Manager:

```typescript
// src/lib/db/sqlite.ts
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = path.resolve(process.cwd(), 'data', 'z-hr.db');
const dbDir = path.dirname(dbPath);

// اطمینان از وجود directory
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS cvs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    request_id TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    analysis_result TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS user_skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    skill_id INTEGER NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (skill_id) REFERENCES skills(id),
    UNIQUE(user_id, skill_id)
  );

  CREATE TABLE IF NOT EXISTS interview_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    position TEXT,
    questions TEXT NOT NULL,
    answers TEXT,
    created_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);

export default db;
```

### ساخت Repository با SQLite:

```typescript
// src/lib/repositories/users.repository.ts
import db from '@/lib/db/sqlite';

export interface User {
  id: number;
  email: string;
  password_hash: string;
  name: string | null;
  created_at: string;
  updated_at: string;
}

export function getAllUsers(): User[] {
  const stmt = db.prepare('SELECT * FROM users');
  return stmt.all() as User[];
}

export function getUserById(id: number): User | null {
  const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
  return (stmt.get(id) as User) || null;
}

export function getUserByEmail(email: string): User | null {
  const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
  return (stmt.get(email) as User) || null;
}

export function createUser(user: Omit<User, 'id' | 'created_at' | 'updated_at'>): User {
  const now = new Date().toISOString();
  const stmt = db.prepare(`
    INSERT INTO users (email, password_hash, name, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?)
  `);
  
  const result = stmt.run(
    user.email,
    user.password_hash,
    user.name,
    now,
    now
  );
  
  return getUserById(result.lastInsertRowid as number)!;
}

export function updateUser(id: number, updates: Partial<User>): User | null {
  const now = new Date().toISOString();
  const fields: string[] = [];
  const values: any[] = [];
  
  if (updates.email) {
    fields.push('email = ?');
    values.push(updates.email);
  }
  if (updates.password_hash) {
    fields.push('password_hash = ?');
    values.push(updates.password_hash);
  }
  if (updates.name !== undefined) {
    fields.push('name = ?');
    values.push(updates.name);
  }
  fields.push('updated_at = ?');
  values.push(now);
  values.push(id);
  
  const stmt = db.prepare(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`);
  stmt.run(...values);
  
  return getUserById(id);
}

export function deleteUser(id: number): boolean {
  const stmt = db.prepare('DELETE FROM users WHERE id = ?');
  const result = stmt.run(id);
  return result.changes > 0;
}
```

---

## 🐳 راه‌حل 2: استفاده از Docker + PostgreSQL (بهترین برای Production)

### ساخت Docker Compose:

```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: z-hr-db
    environment:
      POSTGRES_USER: zhr_user
      POSTGRES_PASSWORD: zhr_password
      POSTGRES_DB: zhr_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U zhr_user"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

### ساخت Schema SQL:

```sql
-- init.sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cvs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    request_id UUID UNIQUE NOT NULL DEFAULT uuid_generate_v4(),
    content JSONB NOT NULL,
    analysis_result JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS skills (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    category VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_skills (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    skill_id INTEGER NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, skill_id)
);

CREATE TABLE IF NOT EXISTS interview_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    position VARCHAR(255),
    questions JSONB NOT NULL,
    answers JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX idx_cvs_user_id ON cvs(user_id);
CREATE INDEX idx_cvs_request_id ON cvs(request_id);
CREATE INDEX idx_user_skills_user_id ON user_skills(user_id);
CREATE INDEX idx_user_skills_skill_id ON user_skills(skill_id);
```

### نصب Prisma (ORM):

```bash
npm install prisma @prisma/client
npx prisma init
```

### ساخت Prisma Schema:

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            Int       @id @default(autoincrement())
  email         String    @unique
  passwordHash  String    @map("password_hash")
  name          String?
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")
  
  cvs           CV[]
  userSkills    UserSkill[]
  interviews    InterviewSession[]
  
  @@map("users")
}

model CV {
  id            Int       @id @default(autoincrement())
  userId        Int       @map("user_id")
  requestId     String    @unique @default(uuid()) @map("request_id")
  content       Json
  analysisResult Json?    @map("analysis_result")
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")
  
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@map("cvs")
}

model Skill {
  id            Int       @id @default(autoincrement())
  name          String    @unique
  category      String
  createdAt     DateTime  @default(now()) @map("created_at")
  
  userSkills    UserSkill[]
  
  @@map("skills")
}

model UserSkill {
  id            Int       @id @default(autoincrement())
  userId        Int       @map("user_id")
  skillId       Int       @map("skill_id")
  createdAt     DateTime  @default(now()) @map("created_at")
  
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  skill         Skill     @relation(fields: [skillId], references: [id], onDelete: Cascade)
  
  @@unique([userId, skillId])
  @@map("user_skills")
}

model InterviewSession {
  id            Int       @id @default(autoincrement())
  userId        Int       @map("user_id")
  position      String?
  questions     Json
  answers       Json?
  createdAt     DateTime  @default(now()) @map("created_at")
  
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@map("interview_sessions")
}
```

### استفاده از Prisma:

```typescript
// src/lib/db/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
```

```typescript
// src/lib/repositories/users.repository.ts
import { prisma } from '@/lib/db/prisma';

export async function getAllUsers() {
  return prisma.user.findMany();
}

export async function getUserById(id: number) {
  return prisma.user.findUnique({ where: { id } });
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function createUser(data: {
  email: string;
  passwordHash: string;
  name?: string;
}) {
  return prisma.user.create({ data });
}

export async function updateUser(id: number, data: {
  email?: string;
  passwordHash?: string;
  name?: string;
}) {
  return prisma.user.update({
    where: { id },
    data,
  });
}

export async function deleteUser(id: number) {
  return prisma.user.delete({ where: { id } });
}
```

---

## 🔄 Migration از JSON به SQL

### Script برای Migration:

```typescript
// scripts/migrate-json-to-sql.ts
import fs from 'fs';
import path from 'path';
import { prisma } from '../src/lib/db/prisma';

async function migrateUsers() {
  const usersPath = path.join(process.cwd(), 'data', 'users.json');
  const users = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
  
  for (const user of users) {
    await prisma.user.create({
      data: {
        email: user.email,
        passwordHash: user.password_hash,
        name: user.name,
        createdAt: new Date(user.created_at),
        updatedAt: new Date(user.updated_at),
      },
    });
  }
  
  console.log(`Migrated ${users.length} users`);
}

async function migrateSkills() {
  const skillsPath = path.join(process.cwd(), 'data', 'skills.json');
  const skills = JSON.parse(fs.readFileSync(skillsPath, 'utf-8'));
  
  for (const skill of skills) {
    await prisma.skill.create({
      data: {
        name: skill.name,
        category: skill.category,
        createdAt: new Date(skill.created_at),
      },
    });
  }
  
  console.log(`Migrated ${skills.length} skills`);
}

async function migrateCVs() {
  const cvsPath = path.join(process.cwd(), 'data', 'cvs.json');
  const cvs = JSON.parse(fs.readFileSync(cvsPath, 'utf-8'));
  
  for (const cv of cvs) {
    await prisma.cV.create({
      data: {
        userId: cv.user_id,
        requestId: cv.request_id,
        content: JSON.parse(cv.content),
        analysisResult: cv.analysis_result ? JSON.parse(cv.analysis_result) : null,
        createdAt: new Date(cv.created_at),
        updatedAt: new Date(cv.updated_at),
      },
    });
  }
  
  console.log(`Migrated ${cvs.length} CVs`);
}

async function main() {
  try {
    await migrateUsers();
    await migrateSkills();
    await migrateCVs();
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
```

### اجرای Migration:

```bash
# 1. Start Docker
docker-compose up -d

# 2. Run Prisma migrations
npx prisma migrate dev --name init

# 3. Run migration script
npx tsx scripts/migrate-json-to-sql.ts
```

---

## 📝 تنظیمات Environment Variables

### `.env.local`:

```env
# Database
DATABASE_URL="postgresql://zhr_user:zhr_password@localhost:5432/zhr_db?schema=public"

# یا برای SQLite:
# DATABASE_URL="file:./data/z-hr.db"

# External API (optional - اگر می‌خواهید از external API استفاده کنید)
API_SERVER_BASE_URL="https://apisrv.zenonrobotics.ae/api/"

# ChatGPT
OPENAI_API_KEY=your-key-here

# JWT
JWT_SECRET=your-secret-key-change-in-production

# Environment
NODE_ENV=development
```

---

## 🎯 توصیه‌ها

### برای Development:
- ✅ **SQLite** - ساده و سریع
- ✅ فایل‌های JSON برای backup

### برای Production:
- ✅ **PostgreSQL + Docker** - scalable و reliable
- ✅ Prisma برای type safety
- ❌ حذف فایل‌های JSON (یا فقط برای backup)

---

## 📊 مقایسه گزینه‌ها

| ویژگی | JSON Files | SQLite | PostgreSQL + Docker |
|-------|------------|--------|---------------------|
| **سادگی** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Performance** | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Concurrency** | ❌ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Scalability** | ❌ | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Transactions** | ❌ | ✅ | ✅ |
| **Relationships** | ❌ | ✅ | ✅ |
| **Production Ready** | ❌ | ⚠️ | ✅ |

---

## 🚀 مراحل بعدی

1. **انتخاب گزینه**: SQLite (ساده) یا PostgreSQL (production-ready)
2. **نصب Dependencies**: طبق راهنمای بالا
3. **Migration**: اجرای script migration
4. **تست**: تست کردن همه CRUD operations
5. **Deploy**: Deploy کردن با Docker

---

**آخرین به‌روزرسانی**: 2026-01-28
