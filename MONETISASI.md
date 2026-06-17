# 💰 Panduan Monetisasi — dari simulasi ke uang sungguhan

Saat ini iklan & pembelian di `index.html` masih **simulasi** (lihat fungsi
`watchAd()` dan tombol IAP di `renderBoost()`). Dokumen ini menjelaskan cara
menyambungkannya ke sistem asli. Ada dua jalur tergantung cara kamu merilis.

---

## Penting dulu: PWA vs TWA

Game ini PWA. Untuk masuk Google Play, biasanya dibungkus jadi **TWA** (Trusted
Web Activity) lewat PWABuilder/Bubblewrap. Ini memengaruhi pilihan iklan:

- **TWA = wrapper tab Chrome.** SDK native AdMob (banner/interstitial/rewarded)
  **tidak** otomatis tampil di konten web TWA. Jadi untuk iklan di dalam PWA/TWA,
  jalur webnya adalah **Google AdSense / Ad Manager (H5)**, bukan AdMob native.
- **Pembayaran di TWA** justru mudah: pakai **Digital Goods API + Payment Request**
  yang tersambung ke **Google Play Billing**.

---

## 1) Rewarded Ads (hadiah "x2 4 jam" & "panen instan")

### Opsi A — Web (AdSense/Ad Manager H5 Rewarded) — cocok untuk PWA/TWA
1. Daftar & disetujui **Google AdSense** atau **Google Ad Manager**.
2. Buat unit iklan **rewarded** (H5 Games Ads / `adBreak`/`adConfig` API).
3. Muat script: `https://imasdk.googleapis.com/js/sdkloader/gpt.js` atau H5 Ads SDK.
4. Di `index.html`, ganti isi `watchAd(label, reward)`:

```js
function watchAd(label, reward){
  // tampilkan overlay opsional, lalu panggil rewarded ad asli:
  adBreak({
    type: 'reward',
    name: label,
    beforeReward: (showAdFn) => showAdFn(),   // tampilkan iklan
    adViewed:   () => reward(),               // <-- HADIAH diberikan di sini
    adDismissed:() => toast('Iklan dilewati — hadiah batal'),
    adBreakDone:(info) => {/* cleanup */},
  });
}
```

### Opsi B — Native AdMob (kalau kamu bikin app Android beneran, bukan TWA)
Pakai bridge JS↔native (mis. Capacitor/Cordova + plugin AdMob), panggil rewarded
lewat plugin, dan jalankan `reward()` pada callback `onRewarded`.

> Bayaran iklan = eCPM × impresi. Rewarded ads punya eCPM tertinggi. Fokus retensi
> (DAU) karena revenue ≈ DAU × sesi × iklan per sesi × eCPM.

---

## 2) In-App Purchase ("Paket Penjaga Gaia": hapus iklan + x2 permanen)

### Jalur TWA + Google Play Billing (Digital Goods API)
1. **Play Console** → buat produk in-app (mis. SKU `gaia_remove_ads`), tetapkan harga
   (mis. Rp 25.000), status *active*.
2. Build TWA dengan dukungan billing (PWABuilder: aktifkan "Play Billing"; atau
   Bubblewrap dengan fitur `play_billing`).
3. Di `index.html`, ganti handler tombol IAP `c3.querySelector('button').onclick`:

```js
async function buyRemoveAds(){
  if (!('getDigitalGoodsService' in window)) { toast('Pembelian tak tersedia'); return; }
  const svc = await window.getDigitalGoodsService('https://play.google.com/billing');
  const details = await svc.getDetails(['gaia_remove_ads']);
  const sku = details[0];
  const req = new PaymentRequest(
    [{ supportedMethods:'https://play.google.com/billing', data:{ sku:sku.itemId } }],
    { total:{ label:sku.title, amount:{ currency:sku.price.currency, value:sku.price.value } } }
  );
  const resp = await req.show();
  const { purchaseToken } = resp.details;
  // VERIFIKASI di server kamu via Play Developer API, lalu:
  await svc.consume?.(purchaseToken); // utk consumable; remove-ads = jangan consume
  await resp.complete('success');
  state.adsRemoved = true; updateStats(); renderShop(); save(true);
}
```

4. **Verifikasi server-side** token pembelian via **Google Play Developer API**
   sebelum memberi item — wajib untuk cegah pemalsuan.

### Jalur web murni (di luar Play Store)
Pakai **Stripe Checkout / Payment Links** atau penyedia lokal (Midtrans, Xendit).
Setelah webhook pembayaran sukses di server → set entitlement user.

---

## 3) Checklist sebelum rilis berbayar

- [ ] Kebijakan privasi + consent iklan (GDPR/UMP, anak-anak → COPPA jika relevan)
- [ ] Akun AdSense/Ad Manager **atau** AdMob (sesuai jalur) disetujui
- [ ] Produk IAP dibuat & diuji dengan akun tester di Play Console
- [ ] Verifikasi pembelian di server (jangan percaya client)
- [ ] Simpan entitlement di server/cloud save, bukan cuma localStorage
- [ ] Uji `state.adsRemoved` mematikan tampilan iklan & memberi x2 permanen

> Lokasi kode yang perlu diubah sudah ditandai komentar `// CATATAN` di `index.html`.
