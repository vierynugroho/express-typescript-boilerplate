# Albana Clodi Backend

Aplikasi backend untuk Albana Clodi Grosir. Proyek ini menggunakan:

- Node.js dengan TypeScript
- Prisma ORM untuk database
- Express.js untuk REST API
- Zod untuk validasi data

## Cara Menjalankan Aplikasi

### Prasyarat

- Node.js (versi 14 atau lebih baru)
- NPM atau Yarn
- Database (PostgreSQL/MySQL/SQLite sesuai konfigurasi Prisma)

### Langkah-langkah

1. **Instalasi Dependensi**

   ```bash
   npm install
   ```

2. **Konfigurasi Database**

   - Pastikan file `.env` sudah berisi konfigurasi database yang benar
   - Contoh: `DATABASE_URL="postgresql://username:password@localhost:5432/dbname"`

3. **Migrasi Database**

   ```bash
   npx prisma migrate dev
   ```

4. **Generate Prisma Client**

   ```bash
   npx prisma generate
   ```

5. **Menjalankan Aplikasi (Development)**

   ```bash
   npm run start:dev
   ```

6. **Menjalankan Aplikasi (Production)**
   ```bash
   npm run build
   npm start
   ```

## Struktur Proyek

Proyek ini menggunakan arsitektur layered dengan repository pattern:

- `src/api` - Endpoint API dan logika bisnis
- `src/common` - Utilitas, middleware, dan model umum
- `src/config` - Konfigurasi aplikasi
