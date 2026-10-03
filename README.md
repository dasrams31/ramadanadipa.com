# ramadanadipa.com

Website portfolio 3D interaktif — tema **Neo-Samurai / Cyberpunk Kyoto**. Gelap, merah vermillion, dan penuh detail estetika Jepang yang dipadukan dengan teknologi web modern.

> **Live:** https://ramadanadipa.com
> **Mirror (GitHub Pages):** https://ramsnotes31.github.io/ramadanadipa.com/

---

## ✨ Fitur

### 3D & Visual (Three.js)
- **Katana 3D melayang** — dirakit dari primitif geometri (bilah, tsuba, tsuka), melayang & berputar perlahan, bereaksi terhadap scroll dan gerakan mouse
- **Kelopak sakura** — 240 partikel instanced yang berguguran (otomatis dikurangi di HP)
- **Kanji 侍 raksasa** — sprite 3D sebagai roh latar
- **Kamera sinematik** — dolly mengikuti scroll + parallax mouse

### Animasi & Interaksi (GSAP)
- **Preloader** dengan progress % → ditutup **tebasan pedang** menyapu layar
- **Transisi unik tiap section** — tentang: circle-wipe, proyek: 3D flip, pengalaman: slide + garis timeline, keahlian: materialize blur, penghargaan: slide kanan, publikasi: unfold, kontak: rise stagger
- **Slash transition** bergantian arah antar section
- **3D tilt** pada kartu proyek mengikuti kursor
- **Animated counter** statistik, **timeline draw** mengikuti scroll
- **Magnetic buttons** — tombol tertarik ke arah kursor
- **Custom cursor** (dot + ring) — kursor bawaan disembunyikan di desktop

### Detail Estetika Jepang
- **Ghost kanji** raksasa per section: 道作歴技誉論絡
- **Hanko stamp** ラマ (cap merah khas Jepang)
- **Enso ring** berputar perlahan di hero
- **Tategaki** — teks vertikal di rel sisi (武士道, 令和八年)
- Nomor section dengan kanji: 一二三四五六七
- Corner brackets 「」 saat hover kartu

### Teknis
- **100% statis** — tanpa build step, tanpa framework, langsung serve
- **Library di-vendor lokal** (`assets/js/vendor/`) — tidak tergantung CDN
- **SEO lengkap** — meta description, canonical, Open Graph + Twitter cards, JSON-LD `Person` schema, `sitemap.xml`, `robots.txt`
- **Responsif penuh** — layout adaptif HP/tablet/desktop
- **Optimasi performa** — pixel ratio adaptif, anti-aliasing & grain dimatikan di HP, render 3D pause saat tab tidak aktif, `prefers-reduced-motion` dihormati

---

## 🛠️ Tech Stack

| Teknologi | Kegunaan |
|---|---|
| HTML5 + CSS3 + Vanilla JS | Struktur, styling, logika (tanpa build) |
| [Three.js](https://threejs.org/) | Scene 3D (katana, sakura, kanji) |
| [GSAP + ScrollTrigger](https://gsap.com/) | Preloader, transisi, animasi scroll |

---

## 📁 Struktur Proyek

```
├── index.html                  # halaman utama (semua section + SEO meta)
├── favicon.svg                 # favicon & avatar (kanji 侍)
├── robots.txt / sitemap.xml    # SEO
├── .nojekyll                   # agar GitHub Pages serve apa adanya
└── assets/
    ├── css/
    │   └── style.css           # seluruh styling (variables di :root)
    ├── js/
    │   ├── main.js             # interaksi & animasi (GSAP)
    │   ├── scene.js            # scene 3D (Three.js)
    │   └── vendor/             # three.module.min.js, gsap, ScrollTrigger
    └── img/
        ├── avatar.svg          # avatar kanji 侍
        ├── og-cover.png        # gambar preview link (1200×630)
        └── github.svg, linkedin.svg, instagram.svg, orcid.svg
```

---

## 🚀 Menjalankan Lokal

```bash
# Python
python3 -m http.server 8080

# atau Node
npx serve .

# buka http://localhost:8080
```

---

## 🌐 Deploy

### GitHub Pages (aktif)
Repo ini otomatis tayang via GitHub Pages dari branch `main`:
`https://ramsnotes31.github.io/ramadanadipa.com/`

### VPS / hosting statis apa pun
Cukup serve folder ini dengan web server statis (Nginx, Caddy, dsb.):

```nginx
root /path/ke/repo;
try_files $uri $uri/ /index.html;
```

---

## 🎨 Kustomisasi

**Warna** — ubah CSS variables di awal `assets/css/style.css`:
```css
:root {
  --sumi: #0a0a0c;      /* hitam tinta */
  --aka: #e23a2e;       /* merah vermillion */
  --kin: #c9a227;       /* emas */
  --paper: #f2ede3;     /* putih kertas */
}
```

**Konten** — edit langsung `index.html`, tiap section punya `id`: `tentang`, `proyek`, `pengalaman`, `keahlian`, `penghargaan`, `publikasi`, `kontak`.

**Scene 3D** — `assets/js/scene.js`: jumlah kelopak (`PETALS`), kecepatan, warna cahaya, posisi katana.

**Ghost kanji** — tiap section punya `<span class="sec-ghost">`, ganti karakternya sesuai selera.

---

## ⚡ Catatan Performa

- Render 3D dibatasi `devicePixelRatio` maks 2 (1.5 di HP)
- Di HP: anti-aliasing mati, kelopak 240 → 110, film grain & blur navbar dimatikan
- Animasi entrance membersihkan inline-style setelah selesai (`clearProps`) agar tidak bentrok dengan hover CSS
- Total halaman < 1 MB (di luar library vendor)

---

## 👤 Author

**Rama Danadipa Putra Wijaya** — Full Stack Developer & Co-Founder [SertiKu](https://sertiku.id), Yogyakarta, Indonesia.

- GitHub: [@RamsNotes31](https://github.com/RamsNotes31)
- LinkedIn: [ramadanadipa](https://www.linkedin.com/in/ramadanadipa)
- Email: ramadanadipa176@gmail.com

---

© 2026 Rama Danadipa Putra Wijaya
