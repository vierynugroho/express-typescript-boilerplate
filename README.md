# Express Typescript Boilerplate

Proyek ini menggunakan:

- Node.js dengan TypeScript
- Prisma ORM untuk database (v6.6.0)
- Express.js (v5.1.0) untuk REST API
- Zod (v3.24.3) untuk validasi data
- Swagger UI (v5.0.1) untuk dokumentasi API
- JSON Web Token (JWT) untuk autentikasi
- Helmet (v8.1.0) untuk keamanan HTTP header
- Cors (v2.8.5) untuk cross-origin resource sharing
- Morgan untuk HTTP request logging

## Cara Menjalankan Aplikasi

### Prasyarat

- Node.js (versi 14 atau lebih baru)
- NPM
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
