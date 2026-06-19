# RELEASE — Handoff Checklist (GAIA)

Hal-hal yang **butuh akun / keputusan kamu** (tidak bisa diselesaikan dari sesi coding). Kode/hook-nya sudah disiapkan; tinggal isi kredensial.

---

## A. Monetisasi (Fase 3)
Status kode: **placeholder siap** (lihat `// NOTE`/`// PLACEHOLDER` di `index.html` + panduan lengkap di `MONETISASI.md`).

- [ ] **Rewarded Ads** — daftar & approve **Google AdSense / Ad Manager (H5)** (untuk PWA/TWA) ATAU AdMob (jalur native). Ganti isi `watchAd()` dengan SDK asli; panggil `reward()` di callback "onRewarded".
- [ ] **IAP "Gaia Guardian Pack"** — buat produk `gaia_remove_ads` di **Google Play Console**; pakai **Digital Goods API + Payment Request** di TWA. Ganti handler tombol IAP.
- [ ] **Verifikasi server-side** pembelian via Google Play Developer API (wajib anti-fraud).
- [ ] **Consent iklan** (UMP/GDPR) + **kebijakan privasi**.

## B. Rilis ke Play Store (Fase 4)
- [ ] **Paket TWA** via PWABuilder (https://pwabuilder.com, masukkan URL live) atau Bubblewrap. Aktifkan "Play Billing" jika pakai IAP.
- [ ] Host **`/.well-known/assetlinks.json`** (dari hasil paket) di domain GitHub Pages → agar TWA fullscreen tanpa address bar.
- [ ] Listing: ikon, screenshot, deskripsi, **rating konten**.
- [ ] Closed test → open test → produksi.

## C. Analytics (Fase 4)
Status kode: **hook `track(event, data)` sudah ada** (no-op sampai GA dipasang). Event contoh sudah dipasang: `travel`, `export_save`, `import_save`.

- [ ] Buat properti **GA4 / Firebase / Plausible**, dapatkan Measurement ID.
- [ ] Tambah snippet `gtag.js` + ID di `<head>` `index.html`. Setelah itu `track()` otomatis mengirim event.
- [ ] (Opsional) tambah `track()` di event lain: prestige, daily claim, ad view, purchase.

## D. Cloud Save (Fase 4)
Status kode: **Export/Import lokal sudah ada** (tombol ⚙️ Data — backup manual via kode base64).

- [ ] Pilih backend (Firebase/Supabase/worker KV) untuk sinkron otomatis lintas perangkat.
- [ ] Akun anonim + key; simpan entitlement IAP di server (bukan hanya localStorage).
- [ ] Aturan merge (jangan timpa progres lebih maju tanpa konfirmasi).

## E. Keputusan desain tertunda
- [ ] **Per-planet persistence**: saat ini prestige (rebirth) menghapus generator di SEMUA planet → kerajaan multi-planet tak bertahan antar-prestige. Jika ingin tiap planet jadi operasi awet (gaya Idle Planet Miner), perlu desain ulang reset + **re-balance** (berisiko mengubah kurva). Putuskan dulu sebelum diimplementasi.

---

## Sudah selesai (kode, dari sesi ini)
- ✅ Core loop, 20 generator, manager, milestone, prestige 3 lapisan (balanced)
- ✅ Jelajah 10 planet (bolak-balik) + generator per-planet, biomassa bersama
- ✅ Planet WebGL shader (benua/awan/lampu kota/atmosfer) + orbiter 3D (moon/sun bola, asteroid belt, ring, satelit)
- ✅ UI premium glass + nav + musik ambient
- ✅ **Daily Reward** (streak + bonus hari ke-7)
- ✅ **Export/Import save** (⚙️ Data)
- ✅ **Analytics hook** (`track()`, siap GA)
- ✅ PWA network-first, live di GitHub Pages
