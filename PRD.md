# PRD — GAIA: Idle Terraform (Langkah Selanjutnya)

> Product Requirements Document · v1 · disusun 2026-06-18
> Repo: https://github.com/JohnAprek/gaia-idle · Live: https://johnaprek.github.io/gaia-idle/

---

## 1. Ringkasan Produk

**GAIA: Idle Terraform** adalah idle/incremental game berbasis web (HTML/CSS/JS murni, PWA) bertema menghidupkan planet mati menjadi dunia penuh kehidupan, lalu menjelajah dari planet ke planet. Target platform: **mobile web + PWA**, dengan jalur rilis ke **Google Play via TWA**.

**Pembeda utama:** planet 3D prosedural yang hidup (benua, laut, es, atmosfer, rotasi), jalur eksplorasi banyak planet (gaya Idle Planet Miner), dan kedalaman prestige 3 lapisan yang membuatnya praktis tak bisa "tamat".

---

## 2. Visi & Tujuan

- **Visi:** idle game santai yang memuaskan dipandang (planet hidup) dan dalam secara progresi, retensi tinggi, monetisasi sehat (rewarded ads + IAP).
- **Tujuan rilis pertama (MVP publik):** game stabil, seimbang, terverifikasi visual, terpasang analytics, terbit di Play Store sebagai TWA, monetisasi aktif.

### Metrik sukses (KPI)
| Metrik | Target awal |
|---|---|
| Retensi D1 | ≥ 35% |
| Retensi D7 | ≥ 12% |
| Rata-rata sesi/hari | ≥ 3 |
| Durasi sesi | ≥ 4 menit |
| % pemain menonton rewarded ad | ≥ 25% |
| Konversi IAB "Gaia Guardian Pack" | ≥ 1.5% |
| Crash-free sessions | ≥ 99.5% |

---

## 3. Target Pemain

- Pemain kasual idle/incremental (umur 16–40), suka progresi pasif + sesi pendek berulang.
- Penggemar Idle Planet Miner, AdVenture Capitalist, Cookie Clicker, Cell to Singularity.
- Bermain di HP (Android utama), sesi 2–6 menit, beberapa kali sehari.

---

## 4. Status Saat Ini (sudah dibangun)

✅ Core loop: klik → biomassa → 20 generator → produksi otomatis
✅ Upgrade global (klik & produksi) + buy x1/x10/MAX
✅ Manager per-generator (pengali berlevel) + milestone multiplier (×2 tiap 10/25/50/…)
✅ Prestige 3 lapisan: Planet (Gaia Spores) → Galaxy (Stars) → Universe (Singularities), model frontier
✅ Jelajah 10 planet (Travel, bonus permanen, tema per planet)
✅ Planet kanvas prosedural (benua/laut/es/atmosfer/rotasi, palet per planet)
✅ Achievement (19), offline earnings (cap 10 jam), auto-save localStorage
✅ Audio: SFX + musik ambient generatif; animasi latar (bintang, satelit, meteor) + partikel
✅ Monetisasi (SIMULASI): rewarded ads (boost x2 4 jam, panen instan) + IAP (hapus iklan + x2 permanen)
✅ PWA: manifest, service worker **network-first**, installable
✅ Deploy: GitHub Pages, repo publik
✅ UI bahasa Inggris penuh
✅ Simulator balancing (tools/sim4.mjs)

**Utang teknis / catatan:**
- Tampilan visual belum diverifikasi mata manusia (keterbatasan tool screenshot pengembang) — **butuh playtest visual**.
- Balancing belum di-tune ulang setelah penambahan manager/milestone/planet (game lebih cepat dari sim awal).
- Monetisasi masih placeholder (belum tersambung SDK asli).
- 7 tab di bottom bar mulai padat.

---

## 5. Roadmap Berfase (prioritas)

Urutan dirancang agar **game benar & terasa enak dulu**, baru monetisasi & rilis.

### FASE 0 — Verifikasi & Polish Visual *(blocking, cepat)*
Tujuan: pastikan game terlihat & terasa bagus di perangkat nyata sebelum lanjut.
- [ ] Playtest visual di HP asli: planet, menu drawer, animasi, semua tab.
- [ ] Kumpulkan screenshot kondisi nyata → jadi acuan setel visual.
- [ ] Setel planet prosedural (ukuran benua, kontras laut/darat, kecerahan, kecepatan rotasi, atmosfer) berdasar screenshot.
- [ ] Perbaiki bug visual/responsif yang muncul.
- **Acceptance:** pemilik produk menyetujui tampilan di ≥2 ukuran layar.

### FASE 1 — Balancing & Quality of Life
Tujuan: kurva progresi terasa pas, kontrol nyaman.
- [ ] Re-sim ekonomi penuh (generator + manager + milestone + planet + 3 prestige) → tetapkan target pacing.
- [ ] Tune `GAIA_DIV/BINTANG_DIV/SING_DIV`, biaya, bonus agar: prestige pertama ~30–45 mnt, konten terdalam pertama ~minggu kalender (pemain kasual).
- [ ] QoL: rapikan navigasi 7 tab (mis. menu ⚙️ untuk Music/Sound/Save/Reset; atau kelompokkan).
- [ ] Indikator "siap prestige/travel" yang jelas; angka besar diformat konsisten.
- [ ] Big-number safety: pastikan tak overflow di late-game (pertimbangkan format e-notation di ekstrem).
- **Acceptance:** sim menunjukkan kurva sesuai target; tak ada dead-end/overflow.

### FASE 2 — Retensi
Tujuan: alasan pemain kembali tiap hari.
- [ ] **Daily reward** (streak harian: biomassa/boost/Gaia).
- [ ] **Offline summary** lebih kaya (progress, event terlewat).
- [ ] Perluas **achievement** + reward bermakna.
- [ ] **Golden event** divariasikan (sudah ada Golden Sprout; tambah jenis).
- [ ] (Opsional) **Quest/misi** harian sederhana.
- **Acceptance:** ada minimal 1 alasan harian (daily reward) + notifikasi balik (lihat Fase 4).

### FASE 3 — Monetisasi Nyata
Tujuan: ubah simulasi jadi pendapatan. (Lihat `MONETISASI.md`.)
- [ ] Integrasi **rewarded ads** asli (AdSense/Ad Manager H5 untuk PWA, atau AdMob bila jalur native).
- [ ] Integrasi **IAP** "Gaia Guardian Pack" via **Google Play Billing (Digital Goods API)** di TWA.
- [ ] **Verifikasi server-side** pembelian (anti-fraud) + simpan entitlement.
- [ ] Tambah penawaran: starter pack, time-skip, paket Gaia.
- [ ] Consent iklan (UMP/GDPR), kebijakan privasi.
- **Acceptance:** rewarded ad memberi reward nyata; pembelian remove-ads persisten & terverifikasi.

### FASE 4 — Rilis & Infrastruktur
Tujuan: terbit & terukur.
- [ ] **Paket TWA** (PWABuilder/Bubblewrap) + `assetlinks.json` di `/.well-known/`.
- [ ] Listing Play Store: ikon, screenshot, deskripsi, rating konten.
- [ ] **Analytics** (event: sesi, prestige, travel, ad view, purchase) — mis. GA4/Firebase/Plausible.
- [ ] **Cloud save** + export/import (cegah kehilangan progress).
- [ ] Crash/error logging.
- [ ] Closed test → open test → produksi.
- **Acceptance:** build TWA lolos validasi; analytics mengalir; cloud save berfungsi.

### FASE 5 — Konten & Live-Ops *(pasca-rilis)*
Tujuan: umur panjang.
- [ ] Lapisan prestige ke-4 / big-number rewrite (break_infinity) bila pemain hardcore butuh.
- [ ] Sistem **Research/Lab** (pohon riset).
- [ ] **Rarity/tier** generator atau kartu.
- [ ] Event musiman & leaderboard.
- [ ] Lokalisasi (ID, dll.) bila pasar menuntut.

---

## 6. Requirement Detail (fitur prioritas dekat)

### 6.1 Daily Reward (Fase 2)
- **Deskripsi:** pemain klaim hadiah harian; streak meningkatkan nilai; reset bila lewat.
- **Requirement:**
  - Simpan `lastClaimDate`, `streak` di state.
  - Tabel reward 7 hari (mis. biomassa skala perSec×waktu, boost, Gaia spore).
  - UI modal saat hadiah tersedia; tombol klaim + animasi.
- **Acceptance:** klaim 1×/hari; streak naik/turun benar; tahan reload & offline.

### 6.2 Rapikan Navigasi (Fase 1)
- **Deskripsi:** kurangi kepadatan 7 tab.
- **Opsi:** pindah Music/Sound/Save/Reset ke menu ⚙️; atau gabung Manager ke dalam tab Generator (sub-toggle).
- **Acceptance:** bottom bar ≤6 elemen utama; semua fungsi tetap terjangkau ≤2 tap.

### 6.3 Rewarded Ads Nyata (Fase 3)
- **Requirement:** abstraksi `watchAd(label, onReward)` tersambung SDK; fallback bila gagal/tak tersedia; cooldown tetap; hormati `adsRemoved`.
- **Acceptance:** reward hanya diberi pada callback "rewarded"; tak ada reward saat skip/gagal.

### 6.4 IAP + Verifikasi (Fase 3)
- **Requirement:** Digital Goods API + Payment Request; produk `gaia_remove_ads`; verifikasi token via Play Developer API di server; entitlement persisten (cloud).
- **Acceptance:** beli → x2 permanen + iklan hilang; restore di perangkat lain (via cloud save).

### 6.5 Cloud Save (Fase 4)
- **Requirement:** sinkron state ke backend (mis. akun anonim + key); export/import string base64 sebagai cadangan offline.
- **Acceptance:** progress pulih di perangkat baru; tak menimpa progress lebih maju tanpa konfirmasi.

---

## 7. Risiko & Mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Visual belum tervalidasi (tak ada screenshot dev) | Tampilan kurang/aneh lolos | Fase 0 wajib: playtest + screenshot dari pemilik |
| Balancing meleset (terlalu cepat/lambat) | Retensi turun | Sim4 + playtest; tuning iteratif |
| Iklan di PWA/TWA terbatas (AdMob native ≠ web) | Revenue iklan kecil | Pakai AdSense/Ad Manager H5; atau jalur native |
| Stale cache (sebelumnya terjadi) | Update tak sampai | Sudah diperbaiki: SW network-first |
| Kehilangan progress (localStorage) | Pemain kecewa | Cloud save + export/import (Fase 4) |
| Number overflow late-game | Game macet | Uji ekstrem; big-number bila perlu (Fase 5) |
| Kebijakan Play (iklan/anak) | Tolak rilis | Consent, rating konten, kebijakan privasi |

---

## 8. Out of Scope (untuk sekarang)
- Multiplayer / PvP.
- Backend berat (selain cloud save & verifikasi IAP).
- 3D engine (WebGL) — kanvas 2D prosedural cukup.
- Lokalisasi penuh (tunggu sinyal pasar).
- Berbulan-bulan waktu-aktif hardcore (big-number) — tunda sampai ada pemain.

---

## 9. Keputusan Teknis (tetap)
- **Stack:** HTML/CSS/JS murni, satu file `index.html` + aset; tanpa build step.
- **PWA:** service worker **network-first** (update selalu sampai), cache untuk offline.
- **Planet:** kanvas 2D prosedural (heightmap noise 3D + shading bola), bukan tumpukan CSS.
- **Save:** localStorage (kunci `gaia_save_v3`), nanti + cloud.
- **Monetisasi placeholder ditandai** komentar `// NOTE`/`// PLACEHOLDER` di `index.html`; panduan di `MONETISASI.md`.
- **Balancing** divalidasi via `tools/sim4.mjs`.

---

## 10. Definisi "Siap Rilis" (MVP publik)
1. Tampilan disetujui (Fase 0).
2. Balancing terverifikasi (Fase 1).
3. Daily reward + 1 hook retensi (Fase 2).
4. Rewarded ads + IAP nyata & terverifikasi (Fase 3).
5. TWA terbit (closed→open→prod), analytics + cloud save aktif (Fase 4).
6. Crash-free ≥ 99.5%, tanpa dead-end ekonomi.
