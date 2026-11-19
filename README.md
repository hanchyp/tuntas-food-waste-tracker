# TUNTAS

Prototipe interaktif TUNTAS, dibangun dengan Next.js 16, React 19, TypeScript, dan Tailwind CSS 4. Mengikuti konsep B yang dipilih pengguna: Porsi sebagai pemandu alur foto, analisis, dan rencana belanja.

## Menjalankan

    npm install
    npm run dev

Buka http://localhost:3001. Build produksi: npm run build. Hasil statis berada di folder out; untuk menyajikannya secara lokal gunakan npm run start setelah build.

Konfigurasi menggunakan static export, sehingga next start tidak digunakan. Skrip npm run start menyajikan direktori out menggunakan Python.

## Halaman

- /: landing page, alur Porsi, fitur, rencana paket, dan FAQ.
- /dasbor/: filter sekolah/periode, ringkasan, tren, sisa per komponen.
- /foto/: tiga tahap pencatatan dengan foto perangkat atau contoh.
- /hasil/?id=...: rincian per komponen, koreksi estimasi, ekspor CSV.
- /riwayat/: pencarian, filter, tautan detail, ekspor.
- /belanja/: kalkulasi bahan mentah berdasarkan porsi, cadangan, stok, dan harga; ekspor CSV.
- /laporan/: periode/sekolah, ringkasan, ekspor CSV, cetak/simpan PDF melalui browser, pengaturan ulang data.

## Batasan demo

Analisis tidak memanggil AI: setiap pencatatan baru memakai persentase simulasi 18/8/32/5 untuk nasi/lauk/sayur/buah. Foto tidak dianalisis. Berat porsi, resep mentah, dan harga merupakan contoh. Data sisa tidak otomatis mengurangi porsi gizi.

Foto diperkecil di browser menjadi JPEG dengan sisi terpanjang 900 px. Catatan dan foto disimpan di localStorage perangkat, tanpa backend atau unggahan ke server. Kapasitas penyimpanan bergantung pada browser; kegagalan simpan ditampilkan kepada pengguna. Rencana belanja hanya berlaku selama halaman dibuka dan dapat diekspor.

Sisa sampel (kg) = gram porsi × persen sisa / 100 × jumlah sampel / 1000.

Kebutuhan bahan (kg) = jumlah porsi × gram bahan mentah / 1000 × (1 + cadangan / 100). Belanja = maksimum(0, kebutuhan − stok). Ini bukan rekomendasi atau validasi gizi.

## Aset dan arah desain

Logo dan Porsi berasal dari aset asli pengguna, disalin tanpa perubahan visual. Foto sebelum makan menggunakan foto asli yang diberikan pengguna. Foto sesudah makan adalah hasil edit AI dari foto tersebut, dengan ompreng dan latar yang dipertahankan. Asal dan prompt ada di public/images/PROVENANCE.json. Font Plus Jakarta Sans disajikan lokal, bersumber dari cache font proyek WANA. Konsep yang disetujui dan catatan proses ada di folder .impeccable satu tingkat di atas proyek.

## Pengembangan berikutnya

Backend dan akun dapur, penyimpanan foto terpisah per tenant, model segmentasi terkalibrasi, dataset uji berlabel/ditimbang, persetujuan ahli gizi, serta pelaporan sesuai format yang telah diverifikasi adalah pekerjaan lanjutan. Semua klaim akurasi dan dampak membutuhkan validasi lapangan.
