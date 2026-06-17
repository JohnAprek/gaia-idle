# 🌍 GAIA — Idle Terraform

Game idle santai: hidupkan planet mati menjadi dunia penuh kehidupan. Klik untuk
menumbuhkan biomassa, beli generator otomatis, naik stage visual, lalu "lahirkan
planet baru" (prestige) untuk bonus permanen Spora Gaia.

Dibuat dengan **HTML/CSS/JS murni** — tanpa framework, tanpa build step. Satu file
`index.html` + aset PWA (manifest, service worker, ikon).

## ▶️ Cara menjalankan

**Lokal (cara cepat):** buka `index.html` langsung di browser.
> Catatan: service worker & mode offline hanya aktif lewat `http(s)`/localhost,
> bukan `file://`. Game tetap jalan normal tanpa SW.

**Lokal dengan server (untuk tes PWA penuh):**
```bash
python -m http.server 8123
# buka http://localhost:8123
```

## 🎮 Fitur

- Klik planet → biomassa, dengan angka mengambang & efek suara (Web Audio, tanpa file)
- 10 generator bertingkat (Spora → Stasiun Orbit) dengan harga naik 1.15× per beli
- 8 upgrade (pengali klik & produksi global) + beli x1/x10/MAX
- 8 stage visual planet (mati → Dunia Sempurna)
- **Prestige (Spora Gaia)** model *frontier*: hanya dapat spora bila memecahkan rekor
- 14 achievement (masing-masing +1% produksi)
- Offline earnings (cap 8 jam)
- **Monetisasi** (rewarded ads + IAP) — saat ini simulasi, lihat `MONETISASI.md`
- Golden Sprout 🌟 event acak (hadiah klik)
- Auto-save localStorage + PWA installable

## 📦 Struktur

| File | Fungsi |
|------|--------|
| `index.html` | Seluruh game (markup, style, logika) |
| `manifest.webmanifest` | Metadata PWA |
| `sw.js` | Service worker (cache offline) |
| `icon.svg` | Ikon aplikasi |
| `tools/sim.mjs` | Simulator balancing (`node tools/sim.mjs`) |
| `MONETISASI.md` | Panduan menyambungkan iklan & pembayaran asli |

## 🚀 Deploy (GitHub Pages)

Repo ini siap di-deploy sebagai situs statis. Aktifkan GitHub Pages:
**Settings → Pages → Source: `main` branch / root**. URL akan menjadi
`https://<user>.github.io/<repo>/`.

## ⚖️ Balancing

Jalankan `node tools/sim.mjs` untuk mensimulasikan pacing (durasi per planet,
jumlah spora, total waktu main). Ubah konstanta di `index.html` (cari `GAIA_DIV`,
`GAIA_BONUS`, array `GENERATORS`/`UPGRADES`) lalu sim ulang.
