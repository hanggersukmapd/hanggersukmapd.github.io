# Hangger Sukma Prima Darsono — Portfolio (v2)

Portofolio profesional satu halaman yang dibangun ulang dengan pendekatan
**bento grid + glassmorphism**, animasi halus, dan komponen interaktif.
Tanpa framework JavaScript — hanya HTML, Tailwind CSS (CDN), dan JavaScript
murni yang dimodularisasi.

- **Nama:** Hangger Sukma Prima Darsono
- **Role:** Informatics Engineering Student | Data Science, Machine Learning & Web Development Enthusiast
- **Lokasi:** Jakarta Selatan, DKI Jakarta
- **Kontak:** hanggersukmapd@gmail.com

---

## 1. Struktur file

```
.
├── index.html                  # Markup seluruh halaman (semantic, aksesibel)
├── package.json                # Script build Tailwind + server lokal
├── tailwind.config.js          # Konfigurasi Tailwind (scan HTML + JS)
├── src/
│   └── input.css               # Entry: @tailwind base/components/utilities
├── manifest.webmanifest        # Metadata PWA (installable)
├── sw.js                       # Service worker: offline shell + cache runtime
├── robots.txt                  # Arahan crawler
├── sitemap.xml                 # Sitemap (1 halaman)
├── CV_Hangger_Sukma_Prima_Darsono.docx
├── assets/
│   ├── css/
│   │   ├── tailwind.css        # HASIL BUILD — jangan diedit manual
│   │   └── styles.css          # Design token, glassmorphism, modal, palette, animasi
│   ├── js/
│   │   ├── data.js             # SITE, TYPING_PHRASES, SKILL_GROUPS, PROJECTS
│   │   └── main.js             # 13 modul interaktif (IIFE, tanpa dependency)
│   └── img/
│       ├── favicon.svg
│       ├── apple-touch-icon.png
│       ├── icon-192.png
│       ├── icon-512.png
│       └── og-cover.png        # 1200×630 untuk pratinjau tautan
├── scripts/
│   ├── og-cover.html           # Sumber render og-cover.png
│   └── icon.html               # Sumber render ikon PNG
└── README.md                   # Dokumentasi ini
```

Pemisahan ini disengaja: **konten** (`data.js`) terpisah dari **perilaku**
(`main.js`) dan **tampilan** (`styles.css`), sehingga mengubah teks studi kasus
tidak menyentuh logika, dan mengubah tema tidak menyentuh konten.

---

## 2. Cara menjalankan

### 1. Build CSS (wajib sekali)

Tailwind sudah **diprecompile** ke `assets/css/tailwind.css`, jadi situs bisa
langsung dibuka. Build ulang hanya diperlukan bila Anda menambah/mengubah kelas
Tailwind di `index.html` atau `assets/js/*.js`.

```bash
npm install       # sekali saja (tailwindcss sebagai devDependency)
npm run build     # hasil minify → assets/css/tailwind.css
npm run dev       # mode watch saat mengembangkan
```

> `node_modules/` dan hasil build tidak perlu di-commit bila CI menjalankan
> `npm ci && npm run build` sebelum deploy.

### 2. Lokal

```bash
# Opsi 1 — server statis bawaan Python
python -m http.server 8000
# lalu buka http://localhost:8000

# Opsi 2 — langsung buka file
open index.html      # macOS
start index.html     # Windows
xdg-open index.html  # Linux
```

Membuka `index.html` lewat `file://` tetap berfungsi (seluruh aset bersifat
relatif), tetapi server lokal lebih aman untuk menguji perilaku clipboard dan
penyimpanan tema di beberapa browser.

### 3. Akses dari perangkat lain (Wi-Fi yang sama)

```bash
npm run serve:lan     # python -m http.server 8080 --bind 0.0.0.0
```

Lalu buka dari ponsel/tablet dengan alamat IP lokal laptop:

```
http://<IP-LAPTOP>:8080
```

Contoh: `http://192.168.1.7:8080`. Cek IP dengan `ipconfig` (Windows) atau
`ip addr` (Linux/macOS).

- Perangkat harus tersambung ke jaringan yang sama dengan laptop.
- Bila tidak bisa dibuka, izinkan Python pada **Windows Defender Firewall →
  Private networks** untuk port tersebut.
- Lewat `http://` IP lokal, browser tidak menganggapnya *secure context*:
  service worker/PWA tidak aktif dan Clipboard API bisa dibatasi (tombol salin
  otomatis memakai fallback `execCommand`). Untuk URL publik permanen, gunakan
  deploy statis di bagian berikut.

### Deploy

Situs ini 100% statis, jadi bisa langsung diunggah ke layanan hosting statis
mana pun:

| Platform | Langkah singkat |
| --- | --- |
| **GitHub Pages** | Push ke repo → Settings → Pages → pilih branch `main` dan folder root. |
| **Netlify / Vercel** | Hubungkan repo, framework preset "Other", build command kosong, output directory `.` |
| **Cloudflare Pages** | Upload folder, tanpa build step. |

> **Catatan build:** `assets/css/tailwind.css` adalah artefak hasil `npm run build`
> (±16 KB minified). Jangan mengeditnya langsung — ubah markup/kelas lalu build
> ulang. `assets/css/styles.css` berisi komponen kustom (tema, glass, modal) dan
> tetap diedit manual.
>
> Urutan muat: `tailwind.css` → `styles.css`. Artinya kelas komponen kustom
> menang atas utility bila menyentuh properti yang sama. Untuk utility display
> responsif pada elemen ber-kelas komponen (mis. `#nav-toggle`), tambahkan
> media query eksplisit di `styles.css`.

Untuk GitHub Pages yang hanya menyajikan file statis, commit hasil build.
Untuk Netlify/Vercel/Cloudflare Pages, tambahkan build command `npm run build`
(tanpa output directory khusus) agar CSS selalu sinkron dengan markup.

---

## 3. Fitur yang tersedia

### Layout & visual
- **Bento grid** pada bagian About + Metrics, Skills, Projects, dan Education.
- **Glassmorphism**: `backdrop-filter: blur()`, border semi-transparan, dan
  surface berbasis CSS variable (bukan warna hardcode).
- **Latar belakang berlapis**: glow radial indigo/cyan yang bergerak perlahan
  plus grid halus dengan mask radial.
- **Mobile-first & responsif**: satu kolom di ponsel, 2 kolom di tablet,
  bento 6 kolom di desktop.

### Interaktif
| Fitur | Lokasi kode | Perilaku |
| --- | --- | --- |
| **Scroll progress bar** | `Progress` (main.js) | Bar gradien di atas halaman, dihitung dengan `requestAnimationFrame`. |
| **Dark / Light mode** | `Theme` (main.js) | Disimpan di `localStorage` (`hsp-theme`), diterapkan sebelum paint via skrip inline di `<head>` agar tidak berkedip. |
| **Typing effect** | `Typing` (main.js), `TYPING_PHRASES` (data.js) | Frasa bergantian dengan caret; teks lengkap tetap ada di `.sr-only` untuk pembaca layar. |
| **Filter Skills** | `Filters` (main.js) | Tabs: Semua / Data Science & AI / Web Dev / Tools & Cloud / Soft Skills. |
| **Filter Projects** | `Filters` (main.js) | Tabs: All / Data Science & ML / Web Development / Leadership. |
| **Project modal** | `Modal` (main.js) | Studi kasus lengkap: latar belakang, peran, tantangan, pendekatan, hasil, tech stack, tautan. Fokus terkunci, `Esc` menutup, backdrop menutup, scroll body dikunci, fokus kembali ke kartu asal. |
| **Copy email + toast** | `CopyEmail` + `Toast` (main.js) | `navigator.clipboard` dengan fallback `execCommand`; notifikasi muncul lalu hilang otomatis. |
| **Form kontak** | `ContactForm` (main.js) | Validasi frontend (nama ≥ 2 karakter, email valid, pesan ≥ 10 karakter), error inline dengan `aria-invalid`, lalu menyusun tautan `mailto:` (tidak ada backend). |
| **Scroll spy** | `Nav` (main.js) | Link navigasi aktif mengikuti section yang sedang terlihat. |
| **Reveal + counter** | `Reveal` (main.js) | Elemen `.reveal` muncul saat masuk viewport; angka IPK/medali beranimasi. |
| **Spotlight** | `Spotlight` (main.js) | Glow kartu mengikuti posisi kursor (`pointermove`). |
| **Deep link proyek** | `Modal` (main.js) | URL `#project/<id>` bisa dibagikan; back/forward browser ikut bekerja. |
| **Navigasi antar kasus** | `Modal` (main.js) | Tombol ‹ › dan tombol panah keyboard untuk pindah proyek tanpa menutup panel. |
| **Copy link studi kasus** | `Modal` (main.js) | Menyalin URL absolut studi kasus yang sedang dibuka. |
| **Command palette** | `Palette` (main.js) | `Ctrl`/`⌘` + `K`: cari bagian, proyek, aksi, dan tautan eksternal; navigasi ↑↓, `Enter` untuk menjalankan. |
| **PWA / offline** | `PWA` (main.js) + `sw.js` | Shell di-cache; halaman tetap terbuka saat koneksi terputus (butuh HTTPS/localhost). |
| **Skip link** | `index.html` + CSS | Pengguna keyboard bisa melompat langsung ke `#main`. |

---

### Pintasan keyboard & deep link

| Aksi | Cara |
| --- | --- |
| Buka pencarian cepat | `Ctrl` + `K` atau `⌘` + `K`, atau ikon kaca pembesar di header |
| Navigasi hasil pencarian | `↑` / `↓`, lalu `Enter` |
| Tutup dialog | `Esc` |
| Pindah studi kasus | tombol ‹ › di panel, atau `←` / `→` |
| Bagikan studi kasus | URL `.../#project/factcheck` atau tombol tautan di panel |
| Unduh CV | tombol **Unduh CV** di Hero, atau dari command palette |

---

## 4. Menyesuaikan konten

### Edit teks studi kasus proyek
Buka `assets/js/data.js`, ubah objek di `window.PROJECTS`. Setiap proyek memakai
struktur:

```js
"id-proyek": {
  id: "id-proyek",
  title: "Judul proyek",
  tagline: "Satu kalimat ringkas",
  category: "Web Development",
  year: "2026",
  tech: ["Python", "MongoDB"],
  links: [{ label: "GitHub", href: "https://..." }],
  facts: { Tahun: "2026", Peran: "Developer", Tipe: "Personal Project" },
  sections: [
    { heading: "Latar Belakang", body: "Paragraf…" },
    { heading: "Tantangan", bullets: ["Poin 1", "Poin 2"] },
  ],
}
```

### Menambah proyek baru
1. Tambahkan objek baru di `window.PROJECTS` dengan `id` unik.
2. Duplikasi satu kartu proyek di `index.html`, lalu ubah:
   - `data-project="id-proyek-baru"`
   - `data-project-tag="ds|web|leadership"` (menentukan filter)
   - judul, ringkasan, dan badge teknologi.
3. Tidak ada perubahan JavaScript lain — kartu otomatis bisa dibuka di modal.

### Mengubah warna aksen / tema
Semua warna berasal dari variabel di bagian atas `assets/css/styles.css`:

```css
:root {            /* mode gelap */
  --accent: #818cf8;      /* indigo */
  --accent-2: #22d3ee;    /* cyan */
  --bg: #030616;
}
html.light {       /* mode terang */
  --accent: #4f46e5;
  --accent-2: #0e7490;
}
```

Mengubah dua variabel itu sudah mengubah tombol, chip, garis timeline, glow,
progress bar gradient, dan judul bergradien secara konsisten.

### Mengubah frasa typing
Edit array `window.TYPING_PHRASES` di `assets/js/data.js`. Bila pengguna
mengaktifkan *reduce motion*, hanya frasa pertama yang ditampilkan statis.

---

## 5. Aksesibilitas & performa

- **Keyboard**: kartu proyek dapat difokus dengan `Tab` dan dibuka dengan
  `Enter`/`Space`; modal memerangkap fokus dan mengembalikannya saat ditutup.
- **Semantik**: `header`, `main`, `section`, `footer`, heading berurutan,
  `aria-pressed` pada tombol filter, `aria-invalid` + `role="alert"` pada form.
- **Motion**: seluruh animasi dinonaktifkan otomatis saat
  `prefers-reduced-motion: reduce`.
- **Tanpa JS**: seluruh konten statis tetap terbaca; hanya modal studi kasus dan
  filter yang butuh JS (ada `noscript` dengan tautan alternatif).
- **Print**: dekorasi, modal, dan toast disembunyikan lewat `@media print`.

---

## 6. Daftar tautan eksternal

| Platform | URL |
| --- | --- |
| Email | hanggersukmapd@gmail.com |
| LinkedIn | https://www.linkedin.com/in/hanggersukmapd |
| GitHub | https://github.com/hanggersukmapd |
| Kaggle | https://www.kaggle.com/hanggersukmapd |

---

## 7. Aset gambar & PWA

### Mengganti domain
Domain saat ini diasumsikan `https://hanggersukmapd.github.io/`. Bila berbeda, ubah di:

1. `index.html` → `canonical`, `og:url`, `og:image`, `twitter:image`, dan JSON-LD.
2. `robots.txt` dan `sitemap.xml`.
3. `assets/js/data.js` → `SITE.url` (dipakai bila ingin menampilkan/membagikan URL).

### Regenerasi aset gambar
Sumber desain ada di `scripts/`, dirender dengan Chrome headless:

```bash
CHROME="/c/Program Files/Google/Chrome/Application/chrome.exe"

"$CHROME" --headless=new --hide-scrollbars --force-device-scale-factor=1 \
  --window-size=1200,630 --screenshot=assets/img/og-cover.png scripts/og-cover.html

for size in 512 192 180; do
  "$CHROME" --headless=new --hide-scrollbars --force-device-scale-factor=1 \
    --window-size=$size,$size --screenshot=assets/img/icon-$size.png scripts/icon.html
done
```

### Cache service worker
`sw.js` menyimpan shell dengan versi `CACHE_VERSION`. **Naikkan versinya**
(mis. `hsp-v1` → `hsp-v2`) setiap kali `index.html`, CSS, atau JS berubah, lalu
reload dua kali agar service worker baru aktif.

> Service worker hanya terdaftar pada `https://` atau `localhost`; membuka file
> lewat `file://` tetap berfungsi tanpa mode offline.

---

## 8. Catatan pengembangan lanjutan (opsional)

- **Backend form**: ganti handler `mailto:` di `ContactForm` dengan `fetch()`
  ke endpoint layanan form (Formspree, Netlify Forms, atau API sendiri).
- **OG image**: tambahkan `assets/img/og-cover.jpg` dan `og:image` di `<head>`
  agar pratinjau tautan tampil menarik.
- **Halaman proyek terpisah**: pecah modal menjadi rute statis per proyek bila
  ingin tiap studi kasus punya URL dan metadata sendiri.
- **Backend form**: ganti `mailto:` dengan endpoint layanan form + status
  pengiriman yang dapat diverifikasi.
