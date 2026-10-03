# ramadanadipa.com

Website portfolio 3D — tema **Neo-Samurai / Cyberpunk Kyoto**.

**Stack:** HTML + CSS + JavaScript statis · Three.js (katana 3D melayang, kelopak sakura, kanji raksasa) · GSAP (preloader, transisi slash antar section, animasi scroll)

**Live:** https://ramadanadipa.com

## Struktur

```
├── index.html              # halaman utama
├── favicon.svg
├── robots.txt / sitemap.xml
└── assets/
    ├── css/style.css
    ├── js/main.js          # animasi & interaksi (GSAP)
    ├── js/scene.js         # scene 3D (Three.js)
    ├── js/vendor/          # three, gsap (lokal, tanpa CDN)
    └── img/                # ikon brand, avatar, og-cover
```

## Jalankan lokal

```bash
python3 -m http.server 8080
# buka http://localhost:8080
```

Situs 100% statis — cukup serve folder ini apa adanya. File `.nojekyll` disertakan agar GitHub Pages menayangkan tanpa proses Jekyll.
