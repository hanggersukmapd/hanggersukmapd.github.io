# Progress Summary — Portofolio Hangger Sukma Prima Darsono

**Status:** ✅ Live dan otomatis ter-deploy
**Terakhir diperbarui:** 31 Oktober 2026

| Item | Nilai |
| --- | --- |
| Situs publik | **https://hanggersukmapd.github.io/** |
| Repository | https://github.com/hanggersukmapd/hanggersukmapd.github.io (publik) |
| Branch produksi | `main` |
| Metode deploy | GitHub Actions → GitHub Pages (`build_type: workflow`) |
| Build CSS | Tailwind CSS 3.4 (precompile, ±16 KB minified) |
| JavaScript | Vanilla JS, 13 modul, tanpa dependency runtime |
| Halaman | 1 halaman, 8 section, 4 studi kasus, 2 grup filter |

---

## 1. Ringkasan progres per tahap

### Tahap 1 — Portofolio dasar
- Satu file `index.html` + Tailwind via CDN.
- Section: Hero, About, Skills, Experience, Projects, Education, Leadership, Contact.
- Navigasi smooth scroll, responsif, tombol LinkedIn/GitHub/Kaggle.
- Dokumentasi awal `README.md`.

### Tahap 2 — Rebuild advanced (bento + glassmorphism)
- Dipecah menjadi `index.html`, `assets/css/styles.css`, `assets/js/data.js`, `assets/js/main.js`.
- Bento grid untuk About/Metrics, Skills, Projects, Education.
- Glassmorphism berbasis CSS variable, latar glow + grid halus, tema gelap/terang persisten.
- Interaksi: scroll progress bar, filter Skills & Projects, modal studi kasus, typing effect, copy email + toast, validasi form, scroll spy, reveal on scroll, counter angka, spotlight card.

### Tahap 3 — Interaksi & distribusi lanjutan
- **Deep link studi kasus**: `#project/<id>`, tombol ‹ ›, panah keyboard, salin tautan, back/forward browser.
- **Command palette** `Ctrl`/`⌘` + `K`: 7 section, 4 proyek, aksi (salin email, unduh CV, ganti tema), 3 tautan eksternal.
- **SEO**: JSON-LD `Person` + `WebSite`, canonical, Open Graph/Twitter, favicon, OG image 1200×630.
- **PWA**: `manifest.webmanifest`, `sw.js` (offline shell), `robots.txt`, `sitemap.xml`.
- **Aksesibilitas**: skip link, `aria-expanded`/`aria-invalid`, focus trap modal, hormati `prefers-reduced-motion`.
- Tombol **Unduh CV** memakai `CV_Hangger_Sukma_Prima_Darsono.docx`.

### Tahap 4 — Build statis (lepas CDN)
- `npm install`, `tailwind.config.js` (scan HTML + JS), `src/input.css`.
- Output `assets/css/tailwind.css` di-commit agar hosting statis bisa langsung menyajikan.
- `sw.js` mencache `tailwind.css`, `CACHE_VERSION` naik ke `hsp-v2`.
- Regresi ditemukan lewat screenshot (hamburger muncul di desktop karena urutan cascade) dan diperbaiki dengan media query eksplisit.

### Tahap 5 — Publikasi
- Repo mandiri dibuat (`hanggersukmapd.github.io`) karena folder proyek sebelumnya menumpang di repo lain.
- Workflow `.github/workflows/deploy.yml`: `npm ci` → `npm run build` → susun artefak → `deploy-pages`.
- Pages diaktifkan dan diubah dari mode `legacy` ke **GitHub Actions**.
- Dua deploy berhasil berturut-turut (initial + update dokumentasi).

---

## 2. Fitur yang sudah tersedia

**UI/UX**
- [x] Bento grid + glassmorphism, aksen indigo/cyan di atas slate gelap
- [x] Responsif mobile-first (uji 390 / 768 / 1440 px)
- [x] Dark/Light mode persisten (`localStorage`)
- [x] Animasi reveal, spotlight kursor, typing effect, gradient text
- [x] Scroll progress bar dan header mengambang

**Interaksi**
- [x] Filter Skills (5 tab) dan Projects (4 tab)
- [x] Modal studi kasus: latar belakang, peran, tantangan, pendekatan, hasil, tech stack, tautan
- [x] Deep link `#project/<id>` + navigasi ‹ › + salin tautan
- [x] Command palette `Ctrl`/`⌘` + `K`
- [x] Copy email dengan toast (clipboard API + fallback)
- [x] Form kontak validasi frontend → `mailto:`
- [x] Unduh CV

**Teknis**
- [x] Tailwind precompile (tanpa CDN), `npm run build` / `npm run dev`
- [x] PWA manifest + service worker (aktif di HTTPS)
- [x] JSON-LD, canonical, OG/Twitter, sitemap, robots
- [x] CI/CD: push ke `main` = build + deploy otomatis
- [x] Skip link, focus trap, `aria-*`, `prefers-reduced-motion`

---

## 3. Struktur file

```
.
├── index.html                  # Halaman utama (8 section)
├── PROGRESS.md                 # Dokumen ini
├── README.md                   # Dokumentasi teknis
├── package.json                # build / dev / serve / serve:lan
├── tailwind.config.js
├── src/input.css               # Sumber Tailwind
├── assets/
│   ├── css/tailwind.css        # hasil build (jangan diedit manual)
│   ├── css/styles.css          # komponen kustom & tema
│   ├── js/data.js              # SITE, TYPING_PHRASES, PROJECTS
│   ├── js/main.js              # 13 modul interaktif
│   └── img/                    # favicon, ikon PWA, og-cover
├── scripts/                    # sumber render gambar
├── sw.js, manifest.webmanifest
├── robots.txt, sitemap.xml
├── .github/workflows/deploy.yml
└── CV_Hangger_Sukma_Prima_Darsono.docx
```

---

## 4. Cara membuka proyek

### A. Dari laptop ini — buka file langsung
```bash
start index.html      # Windows
open index.html       # macOS
xdg-open index.html   # Linux
```
Cukup untuk melihat tampilan. Service worker, clipboard API, dan deep link
sebagian bisa terbatas pada `file://`.

### B. Dari laptop ini — server lokal
```bash
npm run serve         # http://localhost:8000
```
Disarankan saat mengembangkan; semua fitur berjalan normal.

### C. Dari HP/tablet — Wi-Fi yang sama (LAN)
```bash
npm run serve:lan     # python -m http.server 8080 --bind 0.0.0.0
```
1. Cari IP laptop: `ipconfig` (Windows) → lihat **IPv4 Address**, mis. `192.168.1.51`.
2. Dari HP buka `http://192.168.1.51:8080`.
3. Jika tidak terbuka: izinkan Python di **Windows Defender Firewall → Private
   networks**, dan pastikan HP di Wi-Fi yang sama (bukan hotspot berbeda/VPN).
4. Hentikan server: `Ctrl` + `C` pada terminal yang menjalankannya.

> Lewat `http://` IP lokal, browser tidak menganggapnya *secure context*:
> PWA/service worker nonaktif dan Clipboard API bisa dibatasi (tombol salin
> memakai fallback). Semua fitur lain tetap normal.

### D. Dari mana saja — situs publik (rekomendasi)
**https://hanggersukmapd.github.io/**

Cara memperbarui:
```bash
git add -A
git commit -m "Update konten portofolio"
git push                 # GitHub Actions build + deploy, ±1–2 menit
```
- Pantau di tab **Actions** repo.
- Deploy manual: **Actions → Deploy portfolio ke GitHub Pages → Run workflow**.
- Jika perubahan tidak terlihat: tunggu ±1 menit, lalu hard reload
  (`Ctrl` + `Shift` + `R`). Service worker menyimpan salinan lama.

---

## 5. Verifikasi terakhir (31 Oktober 2026)

| Pemeriksaan | Hasil |
| --- | --- |
| Deploy GitHub Actions | completed / success (2×) |
| `GET /` | 200, 61.227 byte, judul benar |
| Aset CSS/JS/img/manifest/sw/robots/sitemap | 200 semua |
| CV `.docx` | 200, content-type Word |
| HTTP → HTTPS | 301 + `Strict-Transport-Security` |
| CSS ter-deploy | 16.472 byte, berisi variabel Tailwind |
| Referensi CDN | 0 |
| Struktur HTML | tag seimbang, tidak ada ID duplikat |
| Render desktop/tablet/mobile | sesuai (1440/768/390 px) |
| Deep link `#project/credit-ml` | panel terbuka, `2 / 4`, scroll lock aktif |

---

## 6. Batasan & catatan

- **Repo publik** → CV dan source bisa diunduh siapa pun. Ganti tombol "Unduh CV"
  bila ingin CV tidak publik.
- **Belum ada `404.html`** — URL salah menampilkan 404 bawaan GitHub Pages.
- **Cache service worker** perlu dinaikkan versinya (`CACHE_VERSION` di `sw.js`)
  setiap kali aset inti berubah besar.
- **Tailwind**: jika menambah/mengubah kelas utility, jalankan `npm run build`
  lalu commit hasilnya (CI juga membangun ulang, tapi build lokal memudahkan cek).
- **Form kontak** masih `mailto:` (tanpa backend), sehingga pesan dikirim lewat
  aplikasi email pengunjung.
- **Domain** masih `hanggersukmapd.github.io`. Jika memakai domain kustom,
  sesuaikan `canonical`, `og:url`, `og:image`, `robots.txt`, dan `sitemap.xml`.

---

## 7. Rekomendasi lanjutan (prioritas)

1. **Halaman 404** bertema sama agar URL salah tetap rapi.
2. **Backend form kontak** (Formspree/Netlify Forms/API sendiri) + status kirim.
3. **Halaman studi kasus terpisah** dengan URL & metadata masing-masing.
4. **Domain kustom** + pembaruan metadata.
5. **Analytics ringan** (mis. Umami/Plausible) untuk melihat trafik.

---

## 8. Cheat sheet

```bash
npm install            # sekali
npm run dev            # watch Tailwind
npm run build          # build CSS minified
npm run serve          # http://localhost:8000
npm run serve:lan      # http://<IP-LAN>:8080
git push               # deploy otomatis ke GitHub Pages
```
