/* =========================================================================
   Hangger Sukma Prima Darsono — Portfolio
   assets/js/data.js

   Sumber data konten interaktif:
   - SITE          : identitas & tautan utama
   - TYPING_PHRASES: kalimat yang diketik pada Hero
   - PROJECTS      : studi kasus lengkap untuk modal/drawer
   - SKILL_GROUPS  : (opsional) dokumentasi grup keahlian untuk filter

   Menambah proyek? Cukup tambahkan objek baru di PROJECTS lalu tambahkan
   kartunya di index.html dengan atribut data-project="id-baru".
   ========================================================================= */

window.SITE = {
  name: "Hangger Sukma Prima Darsono",
  role: "Informatics Engineering Student",
  headline: "Informatics Engineering Student | Data Science & Web Development Enthusiast",
  location: "Jakarta Selatan, DKI Jakarta",
  email: "hanggersukmapd@gmail.com",
  university: "Universitas Mercu Buana",
  gpa: "3.45",

  /* Ganti url bila domain deploy berbeda — dipakai canonical, OG, sitemap. */
  url: "https://hanggersukmapd.github.io",
  cv: "CV_Hangger_Sukma_Prima_Darsono.docx",
};

/** Kalimat yang diketik bergantian pada Hero Section. */
window.TYPING_PHRASES = [
  "Informatics Engineering Student",
  "Data Science & Machine Learning Enthusiast",
  "Web Development Enthusiast",
  "End-to-End Data Analyst",
];

/** Grup keahlian (label filter → dipakai di atribut data-skill-tag). */
window.SKILL_GROUPS = [
  { id: "all", label: "Semua" },
  { id: "ds", label: "Data Science & AI" },
  { id: "web", label: "Web Development" },
  { id: "tools", label: "Tools & Cloud" },
  { id: "soft", label: "Soft Skills" },
];

/* -------------------------------------------------------------------------
   STUDI KASUS PROYEK
   Setiap entri dipakai oleh modal. Struktur:
     id, title, category, year, tagline, tech[], links[], facts{tahun, peran, tipe}
     sections[] → { heading, body?, bullets? }
   ------------------------------------------------------------------------- */
window.PROJECTS = {
  factcheck: {
    id: "factcheck",
    title: "FactCheck News",
    tagline: "Sistem verifikasi data berbasis web yang memusatkan alur cek fakta.",
    category: "Web Development",
    year: "2025",
    tech: ["HTML", "CSS", "JavaScript", "MongoDB", "MS SQL Server", "Git"],
    links: [
      { label: "GitHub", href: "https://github.com/hanggersukmapd" },
    ],
    facts: {
      Tahun: "2025",
      Peran: "Web Developer",
      Tipe: "Web-Based System",
    },
    sections: [
      {
        heading: "Latar Belakang",
        body:
          "Informasi yang beredar di kanal digital bergerak jauh lebih cepat daripada proses verifikasinya. " +
          "FactCheck News dirancang sebagai satu tempat untuk mengumpulkan klaim, menelusuri sumber, dan " +
          "mencatat hasil verifikasi agar proses cek fakta tidak tersebar di banyak dokumen terpisah.",
      },
      {
        heading: "Peran & Tanggung Jawab",
        bullets: [
          "Merancang alur kerja verifikasi: klaim masuk → penelusuran sumber → keputusan → publikasi.",
          "Membangun antarmuka web yang memudahkan verifikator membaca konteks klaim dengan cepat.",
          "Menghubungkan komponen frontend dengan basis data untuk menyimpan klaim dan status verifikasinya.",
        ],
      },
      {
        heading: "Tantangan",
        bullets: [
          "Klaim datang dalam berbagai format, sehingga perlu struktur data yang konsisten sejak awal.",
          "Riwayat perubahan status verifikasi harus dapat ditelusuri agar hasil bisa diaudit ulang.",
          "Antarmuka harus tetap ringan dipakai berulang oleh tim dengan perangkat berbeda.",
        ],
      },
      {
        heading: "Pendekatan",
        bullets: [
          "Memodelkan entitas inti: klaim, sumber rujukan, dan status verifikasi.",
          "Membangun antarmuka bertahap dengan HTML, CSS, dan JavaScript agar alur input tetap sederhana.",
          "Memanfaatkan MongoDB untuk data yang fleksibel dan MS SQL Server untuk data relasional.",
          "Menggunakan Git/GitHub untuk melacak perubahan antar iterasi.",
        ],
      },
      {
        heading: "Hasil & Pembelajaran",
        bullets: [
          "Proses verifikasi menjadi terpusat dan terdokumentasi, bukan lagi catatan tersebar.",
          "Setiap klaim dapat ditelusuri dari sumber hingga kesimpulan akhir.",
          "Menjadi fondasi untuk pengembangan fitur pencarian dan pelaporan lanjutan.",
        ],
      },
    ],
  },

  "credit-ml": {
    id: "credit-ml",
    title: "Random Forest vs XGBoost — Klasifikasi Kelayakan Kredit",
    tagline: "Studi komparasi dua algoritma Machine Learning pada dataset P2P lending.",
    category: "Data Science & ML",
    year: "2026",
    tech: ["Python", "Pandas", "NumPy", "Scikit-learn", "XGBoost", "Matplotlib"],
    links: [
      { label: "Kaggle", href: "https://www.kaggle.com/hanggersukmapd" },
    ],
    facts: {
      Tahun: "2026",
      Peran: "Peneliti / ML Engineer",
      Tipe: "Academic Research Project",
    },
    sections: [
      {
        heading: "Latar Belakang",
        body:
          "Keputusan kelayakan kredit adalah keputusan berisiko tinggi: satu model yang salah menilai peminjam " +
          "berdampak langsung pada kerugian. Penelitian ini membandingkan Random Forest dan XGBoost sebagai " +
          "dua pendekatan berbasis pohon yang populer, menggunakan dataset P2P lending.",
      },
      {
        heading: "Peran & Tanggung Jawab",
        bullets: [
          "Merancang eksperimen end-to-end: pemilihan dataset, praproses, pelatihan, evaluasi, dan pelaporan.",
          "Menyusun metrik evaluasi yang relevan untuk masalah klasifikasi biner yang tidak seimbang.",
          "Mendokumentasikan pipeline agar hasil dapat direproduksi.",
        ],
      },
      {
        heading: "Tantangan",
        bullets: [
          "Distribusi kelas tidak seimbang antara peminjam layak dan tidak layak.",
          "Missing values serta fitur kategorikal yang perlu ditangani sebelum pelatihan.",
          "Risiko overfitting pada model berbasis pohon bila kedalaman tidak dikendalikan.",
        ],
      },
      {
        heading: "Pendekatan",
        bullets: [
          "Eksplorasi data (EDA) dengan Pandas dan NumPy untuk memetakan kualitas data.",
          "Praproses: imputasi, encoding, dan penanganan ketidakseimbangan kelas.",
          "Cross-validation serta penyetelan hyperparameter pada kedua model.",
          "Perbandingan menggunakan accuracy, precision, recall, F1-score, dan ROC-AUC.",
        ],
      },
      {
        heading: "Hasil & Pembelajaran",
        bullets: [
          "Menghasilkan pipeline Machine Learning yang dapat direproduksi dari data mentah sampai evaluasi.",
          "Memberi gambaran trade-off antara precision dan recall pada konteks kredit — metrik akurasi saja tidak cukup.",
          "Memperkuat pemahaman tentang kapan model ensemble boosting lebih sesuai dibanding bagging.",
        ],
      },
    ],
  },

  "research-platform": {
    id: "research-platform",
    title: "Research Data Platform & Backend Integration",
    tagline: "Koordinasi basis data dan integrasi backend untuk mendukung proyek riset.",
    category: "Web Development",
    year: "Maret – September 2025",
    tech: ["MongoDB", "MS SQL Server", "Backend", "Web Integration", "Git"],
    links: [
      { label: "GitHub", href: "https://github.com/hanggersukmapd" },
    ],
    facts: {
      Periode: "Mar – Sep 2025",
      Peran: "Web Development & Project Coordinator",
      Tipe: "Professional Experience",
    },
    sections: [
      {
        heading: "Latar Belakang",
        body:
          "Proyek riset membutuhkan satu sumber data yang dapat diakses tim lintas peran. Tanpa koordinasi, " +
          "data penelitian mudah terpecah antar dokumen, sementara komponen web dan backend berjalan sendiri-sendiri.",
      },
      {
        heading: "Peran & Tanggung Jawab",
        bullets: [
          "Mengoordinasikan pengelolaan basis data pada MongoDB dan MS SQL Server.",
          "Mendukung pengembangan sistem backend serta integrasi komponen web.",
          "Menyelaraskan kebutuhan tim riset dengan kapasitas teknis yang tersedia.",
        ],
      },
      {
        heading: "Tantangan",
        bullets: [
          "Menjaga konsistensi data antara basis data dokumen (MongoDB) dan relasional (MS SQL Server).",
          "Menyelaraskan timeline riset dengan pekerjaan pengembangan.",
          "Memastikan integrasi komponen web tidak mengganggu data yang sedang dipakai tim.",
        ],
      },
      {
        heading: "Pendekatan",
        bullets: [
          "Memetakan kebutuhan data tiap bagian riset sebelum menentukan struktur penyimpanan.",
          "Menetapkan alur integrasi antara backend dan komponen antarmuka.",
          "Menggunakan Git untuk melacak perubahan dan memudahkan koordinasi pekerjaan.",
        ],
      },
      {
        heading: "Hasil & Pembelajaran",
        bullets: [
          "Pengelolaan basis data, backend, dan komponen web berjalan dalam satu alur kerja yang terkoordinasi.",
          "Mendukung efisiensi operasional riset serta memudahkan akses data oleh tim.",
          "Memperkuat kemampuan koordinasi teknis lintas peran, bukan hanya pengerjaan kode.",
        ],
      },
    ],
  },

  "psm-leadership": {
    id: "psm-leadership",
    title: "Wakil Ketua PSM UMB — Program Kompetisi",
    tagline: "Kepemimpinan organisasi yang berujung dua medali emas tingkat internasional & nasional.",
    category: "Leadership",
    year: "2025 – Sekarang",
    tech: ["Kepemimpinan", "Manajemen Tim", "Perencanaan Latihan", "Kolaborasi"],
    links: [],
    facts: {
      Periode: "Jan 2025 – Sekarang",
      Peran: "Wakil Ketua",
      Organisasi: "PSM Universitas Mercu Buana",
    },
    sections: [
      {
        heading: "Latar Belakang",
        body:
          "Paduan Suara Mahasiswa Universitas Mercu Buana mempersiapkan tim untuk kompetisi paduan suara " +
          "tingkat nasional dan internasional. Peran Wakil Ketua menuntut koordinasi jadwal, anggota, " +
          "dan target artistik agar persiapan tetap berjalan di tengah jadwal kuliah.",
      },
      {
        heading: "Peran & Tanggung Jawab",
        bullets: [
          "Mendampingi Ketua dalam mengoordinasikan divisi dan agenda organisasi.",
          "Membantu perencanaan latihan serta menjaga konsistensi target kompetisi.",
          "Menjadi penghubung antara anggota, pelatih, dan pihak universitas.",
        ],
      },
      {
        heading: "Tantangan",
        bullets: [
          "Menyelaraskan jadwal latihan dengan beban akademik seluruh anggota.",
          "Menjaga motivasi tim dalam periode persiapan yang padat.",
          "Mengambil keputusan cepat ketika terjadi perubahan jadwal kompetisi.",
        ],
      },
      {
        heading: "Hasil",
        bullets: [
          "Gold Medal — Malaysian Choral Eisteddfod 2024.",
          "Gold Medal — National Folklore Festival FEB UI 18th.",
          "Terbentuknya ritme koordinasi organisasi yang lebih terstruktur dan terdokumentasi.",
        ],
      },
    ],
  },
};
