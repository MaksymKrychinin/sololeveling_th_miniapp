# 🔍 SETUP.SH ANALYSIS - ЗНАЙДЕНІ ПРОБЛЕМИ

**Date:** May 11, 2026  
**Status:** ⚠️ **7 Critical Issues Found**

---

## ❌ ПРОБЛЕМИ:

### 1. **Node Version Check - ЗАСТАРІЛИЙ** ⚠️
**Location:** Lines 37-41

**Проблема:**
```bash
if [ "$NODE_VERSION" -lt 20 ]; then
    echo "Node.js version must be >= 20.0.0"
```

**Чому це проблема:**
- Скрипт перевіряє Node >= 20
- Але **pnpm вимагає Node >= 22.13**
- Node v20.11.0 призводить до помилки: `ERR_UNKNOWN_BUILTIN_MODULE: node:sqlite`

**Рішення:** Перевіряти Node >= 22.13

---

### 2. **Немає Перевірки pnpm Compatibility** ❌
**Location:** Lines 45-49

**Проблема:**
```bash
if ! command -v pnpm &> /dev/null; then
    npm install -g pnpm
fi
```

**Чому це проблема:**
- Встановлює pnpm без перевірки версії Node
- Нова версія pnpm не працює з Node v20
- Немає перевірки версії pnpm

**Рішення:** 
- Перевіряти версію pnpm
- Попереджувати про несумісність з Node версією

---

### 3. **Немає Перевірки Портів** ❌
**Location:** Line 93 (docker-compose up)

**Проблема:**
```bash
docker-compose -f docker-compose.dev.yml up -d
```

**Чому це проблема:**
- Запускає Docker без перевірки чи порти вільні
- Якщо PostgreSQL/Redis вже запущені локально → **FAIL**
- Помилка: `Bind for 0.0.0.0:6379 failed: port is already allocated`

**Рішення:** Перевіряти порти 5432, 6379 перед запуском

---

### 4. **Немає Перевірки Apple Silicon (ARM64)** ⚠️
**Location:** Відсутнє

**Проблема:**
- Скрипт не виявляє ARM64 архітектуру
- Не попереджує про platform mismatch
- Docker образи не оптимізовані для M1/M2

**Чому це проблема:**
- На Apple Silicon отримуємо warning:
  ```
  The requested image's platform (linux/amd64) does not match 
  the detected host platform (linux/arm64/v8)
  ```

**Рішення:** Виявляти архітектуру та показувати відповідне повідомлення

---

### 5. **Docker Daemon Не Перевіряється** ❌
**Location:** Lines 52-56

**Проблема:**
```bash
if ! command -v docker &> /dev/null; then
    echo "Docker is not installed"
```

**Чому це проблема:**
- Перевіряє лише наявність команди `docker`
- Не перевіряє чи Docker daemon запущений
- Помилка пізніше: `Cannot connect to the Docker daemon`

**Рішення:** Перевіряти `docker ps` для виявлення запущеного daemon

---

### 6. **Неправильна Перевірка PostgreSQL** ⚠️
**Location:** Lines 106-108

**Проблема:**
```bash
echo "Waiting for PostgreSQL to be ready..."
sleep 5
echo "PostgreSQL is ready"
```

**Чому це проблема:**
- Просто чекає 5 секунд
- Не перевіряє реальний стан PostgreSQL
- На повільних системах 5 секунд може не вистачити
- Міграції можуть провалитися якщо DB не готова

**Рішення:** Використовувати `pg_isready` або перевіряти connection

---

### 7. **Seed Помилки Ігноруються** ⚠️
**Location:** Lines 136-142

**Проблема:**
```bash
pnpm db:seed
if [ $? -eq 0 ]; then
    echo "Database seeded"
else
    echo "⚠️ Database seeding failed, continuing..."
fi
```

**Чому це проблема:**
- Seed fails через `Cannot find module '@solo-leveling/shared'`
- Скрипт продовжує і показує "Setup Complete!"
- Користувач думає що все ок, але seed data відсутня

**Рішення:** 
- Пояснювати що seed не критичний
- Показувати як додати вручну

---

## 📊 SEVERITY BREAKDOWN:

| Issue | Severity | Impact |
|-------|----------|--------|
| Node v20 vs v22 | 🔴 Critical | Breaks pnpm completely |
| Port conflicts | 🔴 Critical | Docker fails to start |
| Docker daemon | 🔴 Critical | Everything fails |
| pnpm compatibility | 🟡 High | Silent failures |
| PostgreSQL check | 🟡 High | Migrations may fail |
| ARM64 detection | 🟠 Medium | Performance warning |
| Seed ignoring | 🟢 Low | Missing templates |

---

## 🔧 IMPROVEMENTS NEEDED:

### Priority 1 (Critical):
1. ✅ Check Node >= 22.13
2. ✅ Check ports before Docker
3. ✅ Check Docker daemon running
4. ✅ Proper PostgreSQL readiness check

### Priority 2 (High):
5. ✅ Check pnpm version
6. ✅ Better error messages
7. ✅ Rollback on failure

### Priority 3 (Nice to have):
8. ✅ Detect ARM64 and show appropriate message
9. ✅ Explain seed failure is OK
10. ✅ Add --skip-seed flag

---

## 💡 RECOMMENDED ADDITIONS:

### 1. Port Checker Function:
```bash
check_port() {
    port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 1  # Port in use
    fi
    return 0  # Port free
}
```

### 2. Docker Daemon Check:
```bash
if ! docker ps >/dev/null 2>&1; then
    echo "Docker daemon is not running"
    exit 1
fi
```

### 3. PostgreSQL Readiness:
```bash
until docker exec solo-leveling-postgres-dev pg_isready -U postgres >/dev/null 2>&1; do
    echo "Waiting for PostgreSQL..."
    sleep 2
done
```

### 4. ARM64 Detection:
```bash
ARCH=$(uname -m)
if [ "$ARCH" = "arm64" ]; then
    echo "⚡ Detected Apple Silicon (M1/M2)"
    echo "   Using ARM64-optimized images"
fi
```

---

## ✅ QUICK FIXES:

### Minimal Fix (5 min):
```bash
# Change line 38:
if [ "$NODE_VERSION" -lt 22 ]; then
    echo "Node.js version must be >= 22.13.0"
    
# Add before line 93:
if lsof -i :5432 >/dev/null 2>&1 || lsof -i :6379 >/dev/null 2>&1; then
    echo "Ports 5432 or 6379 already in use"
    echo "Run: ./check-ports.sh"
    exit 1
fi

# Add after line 52:
if ! docker ps >/dev/null 2>&1; then
    echo "Docker daemon is not running. Please start Docker."
    exit 1
fi
```

---

## 📝 СТВОРЮЮ ВИПРАВЛЕНИЙ ФАЙЛ...

Переписую setup.sh з усіма виправленнями ↓
