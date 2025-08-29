# 🐳 Konfigurasi Deployment Ngobrol.Yuk
Repositori ini berisi file `docker-compose.yml` yang berfungsi sebagai pusat orkestrasi untuk menjalankan aplikasi chat Ngobrol.Yuk. Konfigurasi ini menyatukan layanan backend, frontend, dan database ke dalam lingkungan multi-container yang terisolasi.

## 🚀 Arsitektur Proyek
Proyek ini menerapkan arsitektur multi-container di mana setiap layanan utama berjalan secara independen:

- **frontend-service**: Menjalankan aplikasi React + Vite yang sudah di-build.
- **backend-service**: Menjalankan API yang dibangun dari Go (Golang) dengan Fiber Framework.
- **database-mongo**: Menjalankan instance MongoDB sebagai penyimpan data.

Ketiga layanan ini dihubungkan melalui jaringan internal yang dibuat oleh Docker Compose, memungkinkan mereka untuk berkomunikasi satu sama lain.

## ⚙️ Cara Menjalankan
Pastikan Docker dan Docker Compose sudah ter-install di sistem Anda.

**1. Siapkan Semua Repositori**

Pastikan repositori backend dan frontend sudah di-clone dan berada di dalam direktori yang sama dengan file docker-compose.yml ini.

```
FinalProject_Kel3/
├── ngobrol_yuk/         <-- Repositori Backend
├── nobrolyuk-frontend/  <-- Repositori Frontend
└── docker-compose.yml   <-- Repository Docker Compose
```

**2. Jalankan dengan Docker Compose**

Buka terminal di direktori utama, lalu jalankan perintah berikut:

```
docker-compose up -d --build
```

Perintah ini akan membangun image untuk backend dan frontend, mengunduh image MongoDB, lalu menjalankan ketiga container di latar belakang.

**3. Akses Aplikasi**
- Frontend: Buka browser dan kunjungi `http://localhost:3000`
- Backend API: Dapat diakses di `http://localhost:8080`

## 📦 Repositori Terkait
- Backend (Go): https://github.com/Adisonsmn/ngobrol_yuk
- Frontend (React): https://github.com/anandamarachel/nobrolyuk-frontend
