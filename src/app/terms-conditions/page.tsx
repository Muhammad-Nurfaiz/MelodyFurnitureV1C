'use client';

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { LegacyPage } from "@/components/LegacyPage";
import { css } from "@/legacy/produk.legacy";
import { ChatWidget } from "@/components/ChatWidget";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  BreadcrumbSkeleton,
  PageHeadingSkeleton,
  SkeletonOverlay,
  useContentReady,
} from "@/components/ContentSkeleton";

function TermsBreadcrumb() {
  const ready = useContentReady(350);
  return (
    <div className="bg-white border-b border-borderColor py-3 mb-6">
      <div className="max-w-[1200px] mx-auto px-4 text-xs md:text-sm text-textMuted">
        <SkeletonOverlay ready={ready} skeleton={<BreadcrumbSkeleton />}>
          <div className="flex items-center gap-2">
            <Link href="/" className="hover:text-primary transition">Home</Link>
            <span>›</span>
            <span className="text-textDark font-medium">Syarat & Ketentuan</span>
          </div>
        </SkeletonOverlay>
      </div>
    </div>
  );
}

function TermsHeader() {
  const ready = useContentReady(450);

  return (
    <section className="max-w-[1200px] mx-auto px-4 mb-8">
      <div className="bg-white border border-borderColor rounded-lg p-6 md:p-8 shadow-sm">
        <SkeletonOverlay ready={ready} skeleton={<PageHeadingSkeleton />}>
          <span className="inline-block text-[10px] md:text-xs font-bold uppercase tracking-wide text-primary bg-[#F3F0FF] px-2.5 py-1 rounded mb-3">
            Kebijakan & Ketentuan
          </span>
          <h1 className="text-2xl md:text-3xl font-bold text-textDark">SYARAT & KETENTUAN</h1>
          <p className="mt-3 text-xs md:text-sm text-textMuted leading-relaxed max-w-3xl">
            Selamat datang di website resmi Melody Furniture. Syarat & Ketentuan ini mengatur penggunaan website, proses pemesanan produk, pembayaran, pengiriman, serta ketentuan lainnya terkait layanan Melody Furniture.
          </p>
        </SkeletonOverlay>
      </div>
    </section>
  );
}

function TermsContent() {
  return (
    <main className="max-w-4xl mx-auto px-4 my-8 mb-16 text-textDark text-sm leading-relaxed">
      {/* Banner Informasi Awal */}
      <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-5 text-gray-700 leading-relaxed mb-6">
        <p className="font-medium text-blue-950 mb-1">Pemberitahuan Pengguna</p>
        Dengan mengakses dan menggunakan website ini, Anda dianggap telah membaca, memahami, dan menyetujui Syarat & Ketentuan yang berlaku di bawah ini.
      </div>

      <div className="space-y-6">
        {/* 1. Tentang Melody Furniture */}
        <section className="bg-white border border-borderColor rounded-xl p-6 md:p-8 shadow-xs">
          <h2 className="text-base md:text-lg font-bold text-textDark mb-4 pb-2 border-b border-gray-100">
            1. Tentang Melody Furniture
          </h2>
          <p className="mb-3 text-gray-700">
            Melody Furniture merupakan lini merek dari <strong>PT GALANGCITRAMITRA MAJUMAPAN</strong> yang bergerak di bidang manufaktur dan distribusi furniture.
          </p>
          <p className="text-gray-700">
            Melody Furniture menghadirkan berbagai produk furniture untuk kebutuhan hunian maupun ruang kerja dengan mengutamakan fungsi, estetika, kualitas material, serta standar produksi yang sesuai dengan kebutuhan pasar lokal dan ekspor.
          </p>
        </section>

        {/* 2. Penggunaan Website */}
        <section className="bg-white border border-borderColor rounded-xl p-6 md:p-8 shadow-xs">
          <h2 className="text-base md:text-lg font-bold text-textDark mb-4 pb-2 border-b border-gray-100">
            2. Penggunaan Website
          </h2>
          <p className="mb-3 text-gray-700">Dengan menggunakan website Melody Furniture, Anda menyetujui untuk:</p>
          <ul className="list-disc pl-5 space-y-2 text-gray-700 mb-4">
            <li>Menggunakan website untuk tujuan yang sah dan tidak melanggar peraturan perundang-undangan yang berlaku.</li>
            <li>Tidak melakukan tindakan yang dapat mengganggu, merusak, atau menghambat operasional website.</li>
            <li>Tidak melakukan penyalahgunaan terhadap informasi, konten, gambar, maupun materi yang tersedia di website.</li>
            <li>Memberikan informasi yang benar dan dapat dipertanggungjawabkan apabila diperlukan dalam proses pemesanan.</li>
          </ul>
          <p className="text-gray-700">
            Melody Furniture berhak membatasi atau menghentikan akses terhadap pengguna yang terbukti melakukan penyalahgunaan website.
          </p>
        </section>

        {/* 3. Informasi Produk */}
        <section className="bg-white border border-borderColor rounded-xl p-6 md:p-8 shadow-xs">
          <h2 className="text-base md:text-lg font-bold text-textDark mb-4 pb-2 border-b border-gray-100">
            3. Informasi Produk
          </h2>
          <p className="mb-3 text-gray-700">Kami berusaha memberikan informasi produk seakurat mungkin, termasuk:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-gray-700 mb-4">
            <li>Nama dan deskripsi produk</li>
            <li>Ukuran dan spesifikasi</li>
            <li>Material</li>
            <li>Warna dan finishing</li>
            <li>Harga</li>
            <li>Foto dan ilustrasi produk</li>
          </ul>
          <p className="mb-3 text-gray-700">
            Namun, terdapat kemungkinan perbedaan kecil antara tampilan produk pada layar dengan produk fisik, khususnya terkait warna akibat pengaturan layar perangkat, pencahayaan saat pemotretan, maupun karakteristik material.
          </p>
          <p className="text-gray-700">
            Ukuran dan spesifikasi produk mengikuti informasi yang tercantum pada halaman masing-masing produk.
          </p>
        </section>

        {/* 4. Harga Produk */}
        <section className="bg-white border border-borderColor rounded-xl p-6 md:p-8 shadow-xs">
          <h2 className="text-base md:text-lg font-bold text-textDark mb-4 pb-2 border-b border-gray-100">
            4. Harga Produk
          </h2>
          <p className="mb-3 text-gray-700">
            Harga yang tercantum pada website merupakan harga yang berlaku pada saat ditampilkan dan dapat berubah sewaktu-waktu.
          </p>
          <p className="mb-2 text-gray-700 font-medium">Harga dapat berbeda berdasarkan:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-gray-700 mb-4">
            <li>Periode promosi</li>
            <li>Program diskon</li>
            <li>Wilayah pengiriman</li>
            <li>Metode pembayaran</li>
            <li>Kebijakan penjualan yang sedang berlaku</li>
          </ul>
          <p className="text-gray-700">
            Harga yang telah dibayarkan dan dikonfirmasi oleh Melody Furniture mengikuti harga pada saat transaksi tersebut dikonfirmasi, kecuali terdapat kesalahan harga yang jelas atau kondisi lain yang diinformasikan kepada pelanggan.
          </p>
        </section>

        {/* 5. Pemesanan Produk */}
        <section className="bg-white border border-borderColor rounded-xl p-6 md:p-8 shadow-xs">
          <h2 className="text-base md:text-lg font-bold text-textDark mb-4 pb-2 border-b border-gray-100">
            5. Pemesanan Produk
          </h2>
          <p className="mb-3 text-gray-700">
            Pelanggan wajib memastikan bahwa seluruh informasi pemesanan telah benar sebelum melakukan pembayaran, termasuk:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-gray-700 mb-4">
            <li>Produk dan varian</li>
            <li>Jumlah produk</li>
            <li>Nama penerima</li>
            <li>Nomor telepon</li>
            <li>Alamat pengiriman</li>
            <li>Pilihan layanan pengiriman</li>
          </ul>
          <p className="mb-3 text-gray-700">
            Pesanan dianggap valid setelah pembayaran diterima dan pesanan berhasil dikonfirmasi oleh Melody Furniture.
          </p>
          <p className="text-gray-700">
            Melody Furniture berhak melakukan pembatalan pesanan apabila terjadi kondisi tertentu, seperti kesalahan sistem, ketidaksesuaian harga yang signifikan, stok tidak tersedia, pembayaran tidak terverifikasi, atau kondisi lain yang menyebabkan pesanan tidak dapat diproses.
          </p>
        </section>

        {/* 6. Pembayaran */}
        <section className="bg-white border border-borderColor rounded-xl p-6 md:p-8 shadow-xs">
          <h2 className="text-base md:text-lg font-bold text-textDark mb-4 pb-2 border-b border-gray-100">
            6. Pembayaran
          </h2>
          <p className="mb-3 text-gray-700">Pembayaran dilakukan melalui metode pembayaran yang tersedia pada website.</p>
          <p className="mb-3 text-gray-700">Pelanggan wajib memastikan pembayaran dilakukan sesuai nominal dan instruksi yang diberikan.</p>
          <p className="mb-3 text-gray-700">Pesanan dapat diproses setelah pembayaran berhasil diverifikasi oleh sistem atau tim Melody Furniture.</p>
          <p className="text-gray-700">
            Apabila terdapat perbedaan nominal pembayaran, pembayaran tidak teridentifikasi, atau kendala transaksi lainnya, pelanggan dapat menghubungi layanan pelanggan Melody Furniture.
          </p>
        </section>

        {/* 7. Stok Produk */}
        <section className="bg-white border border-borderColor rounded-xl p-6 md:p-8 shadow-xs">
          <h2 className="text-base md:text-lg font-bold text-textDark mb-4 pb-2 border-b border-gray-100">
            7. Stok Produk
          </h2>
          <p className="mb-3 text-gray-700">Ketersediaan stok pada website dapat berubah sewaktu-waktu.</p>
          <p className="mb-3 text-gray-700">
            Informasi "tersedia" atau "stok tersedia" menunjukkan kondisi stok berdasarkan data yang tercatat pada sistem pada saat tertentu dan dapat berubah karena adanya transaksi dari kanal penjualan lainnya.
          </p>
          <p className="text-gray-700">
            Apabila terjadi ketidaksesuaian stok setelah pesanan dibuat, Melody Furniture akan menghubungi pelanggan untuk memberikan informasi mengenai opsi penyelesaian yang tersedia.
          </p>
        </section>

        {/* 8. Pengiriman */}
        <section className="bg-white border border-borderColor rounded-xl p-6 md:p-8 shadow-xs">
          <h2 className="text-base md:text-lg font-bold text-textDark mb-4 pb-2 border-b border-gray-100">
            8. Pengiriman
          </h2>
          <p className="mb-3 text-gray-700">Produk akan dikirim ke alamat yang diberikan pelanggan pada saat melakukan pemesanan.</p>
          <p className="mb-2 text-gray-700 font-medium">Estimasi waktu pengiriman dapat berbeda berdasarkan:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-gray-700 mb-4">
            <li>Lokasi tujuan</li>
            <li>Jenis produk</li>
            <li>Metode pengiriman</li>
            <li>Jasa ekspedisi</li>
            <li>Kondisi operasional ekspedisi</li>
            <li>Kondisi lalu lintas, cuaca, hari libur, atau keadaan lain di luar kendali Melody Furniture</li>
          </ul>
          <p className="mb-3 text-gray-700 italic bg-gray-50 p-3 rounded-lg border border-gray-100">
            Estimasi pengiriman bukan merupakan jaminan waktu tiba.
          </p>
          <p className="text-gray-700">
            Untuk produk furniture berukuran besar atau berat, metode dan biaya pengiriman dapat berbeda berdasarkan wilayah tujuan.
          </p>
        </section>

        {/* 9. Pemeriksaan Produk Saat Diterima */}
        <section className="bg-white border border-borderColor rounded-xl p-6 md:p-8 shadow-xs">
          <h2 className="text-base md:text-lg font-bold text-textDark mb-4 pb-2 border-b border-gray-100">
            9. Pemeriksaan Produk Saat Diterima
          </h2>
          <p className="mb-4 text-gray-700">Pelanggan wajib melakukan pemeriksaan kondisi paket dan produk pada saat barang diterima.</p>
          <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg mb-4 text-amber-900">
            <p className="font-semibold mb-1">Ketentuan Penting Klaim Unboxing:</p>
            Untuk keperluan klaim kerusakan atau kekurangan komponen, pelanggan diwajibkan memiliki dokumentasi unboxing yang jelas dan tidak terputus sejak paket masih dalam kondisi tertutup hingga produk selesai diperiksa.
          </div>
          <p className="text-gray-700">Dokumentasi dapat digunakan sebagai bukti dalam proses investigasi dan penyelesaian klaim.</p>
        </section>

        {/* 10. Kerusakan atau Kekurangan Komponen */}
        <section className="bg-white border border-borderColor rounded-xl p-6 md:p-8 shadow-xs">
          <h2 className="text-base md:text-lg font-bold text-textDark mb-4 pb-2 border-b border-gray-100">
            10. Kerusakan atau Kekurangan Komponen
          </h2>
          <p className="mb-3 text-gray-700">
            Apabila terdapat kerusakan akibat proses pengiriman, kekurangan komponen, atau kendala produk lainnya, pelanggan dapat menghubungi layanan pelanggan Melody Furniture dengan menyertakan:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-gray-700 mb-4">
            <li>Nomor pesanan</li>
            <li>Nama produk</li>
            <li>Foto produk & foto kemasan</li>
            <li>Video unboxing</li>
            <li>Foto atau video bagian yang mengalami masalah</li>
            <li>Informasi pendukung lainnya apabila diperlukan</li>
          </ul>
          <p className="mb-3 text-gray-700">Setiap laporan akan diperiksa terlebih dahulu oleh tim terkait.</p>
          <p className="text-gray-700">
            Bentuk penyelesaian dapat berupa pengiriman sparepart, penggantian komponen, perbaikan, penggantian produk, atau bentuk penyelesaian lainnya sesuai hasil pemeriksaan dan kebijakan yang berlaku.
          </p>
        </section>

        {/* 11. Retur dan Pengembalian Produk */}
        <section className="bg-white border border-borderColor rounded-xl p-6 md:p-8 shadow-xs">
          <h2 className="text-base md:text-lg font-bold text-textDark mb-4 pb-2 border-b border-gray-100">
            11. Retur dan Pengembalian Produk
          </h2>
          <p className="mb-3 text-gray-700">Pengajuan retur tidak dapat dilakukan secara otomatis untuk seluruh kondisi.</p>
          <p className="mb-3 text-gray-700">
            Permintaan retur akan diproses berdasarkan alasan pengajuan, kondisi produk, bukti pendukung, serta hasil pemeriksaan oleh Melody Furniture.
          </p>
          <p className="mb-3 text-gray-700">
            Produk yang telah dirakit, digunakan, dimodifikasi, atau mengalami kerusakan akibat kesalahan penggunaan pelanggan dapat memiliki ketentuan berbeda dalam proses retur atau klaim.
          </p>
          <p className="text-gray-700">Pelanggan disarankan menghubungi layanan pelanggan terlebih dahulu sebelum mengirimkan produk kembali.</p>
        </section>

        {/* 12. Garansi Produk */}
        <section className="bg-white border border-borderColor rounded-xl p-6 md:p-8 shadow-xs">
          <h2 className="text-base md:text-lg font-bold text-textDark mb-4 pb-2 border-b border-gray-100">
            12. Garansi Produk
          </h2>
          <p className="mb-3 text-gray-700">Ketentuan garansi mengikuti jenis produk dan kebijakan garansi yang berlaku.</p>
          <p className="mb-4 text-gray-700">Garansi dapat mencakup cacat produksi atau kendala tertentu yang berasal dari proses produksi.</p>
          <p className="mb-2 text-gray-700 font-medium">Garansi tidak mencakup kerusakan yang disebabkan oleh:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-gray-700 mb-4">
            <li>Kesalahan pemasangan</li>
            <li>Penggunaan yang tidak sesuai fungsi produk</li>
            <li>Modifikasi produk</li>
            <li>Benturan atau kecelakaan</li>
            <li>Penggunaan beban yang melebihi kapasitas</li>
            <li>Perawatan yang tidak sesuai</li>
            <li>Kerusakan akibat faktor eksternal lainnya</li>
          </ul>
          <p className="text-gray-700">Ketentuan garansi dapat berbeda untuk setiap produk.</p>
        </section>

        {/* 13. Promo dan Diskon */}
        <section className="bg-white border border-borderColor rounded-xl p-6 md:p-8 shadow-xs">
          <h2 className="text-base md:text-lg font-bold text-textDark mb-4 pb-2 border-b border-gray-100">
            13. Promo dan Diskon
          </h2>
          <p className="mb-3 text-gray-700">Setiap program promosi memiliki syarat dan periode yang berbeda.</p>
          <p className="mb-3 text-gray-700">
            Informasi mengenai periode promo, produk yang berpartisipasi, besaran diskon, voucher, minimum transaksi, maupun ketentuan lainnya akan dicantumkan pada materi promosi terkait.
          </p>
          <p className="mb-3 text-gray-700">Promo tidak dapat digabungkan dengan promo lain kecuali dinyatakan secara khusus.</p>
          <p className="text-gray-700">Melody Furniture berhak mengubah, memperpanjang, atau mengakhiri program promosi sesuai ketentuan yang berlaku.</p>
        </section>

        {/* 14. Konten Website */}
        <section className="bg-white border border-borderColor rounded-xl p-6 md:p-8 shadow-xs">
          <h2 className="text-base md:text-lg font-bold text-textDark mb-4 pb-2 border-b border-gray-100">
            14. Konten Website
          </h2>
          <p className="mb-3 text-gray-700">
            Seluruh foto, video, desain, logo, tulisan, grafis, dan materi lainnya yang terdapat pada website Melody Furniture merupakan bagian dari aset Melody Furniture atau digunakan dengan izin yang sesuai.
          </p>
          <p className="text-gray-700">
            Dilarang menyalin, memperbanyak, mengubah, mendistribusikan, atau menggunakan materi tersebut untuk kepentingan komersial tanpa izin tertulis dari pihak yang berwenang.
          </p>
        </section>

        {/* 15. Tautan dan Layanan Pihak Ketiga */}
        <section className="bg-white border border-borderColor rounded-xl p-6 md:p-8 shadow-xs">
          <h2 className="text-base md:text-lg font-bold text-textDark mb-4 pb-2 border-b border-gray-100">
            15. Tautan dan Layanan Pihak Ketiga
          </h2>
          <p className="mb-3 text-gray-700">
            Website Melody Furniture dapat menyediakan tautan atau integrasi menuju platform pihak ketiga, termasuk marketplace, jasa pembayaran, maupun jasa pengiriman.
          </p>
          <p className="mb-3 text-gray-700">
            Melody Furniture tidak bertanggung jawab atas kebijakan, keamanan, ketersediaan, maupun layanan yang sepenuhnya berada di bawah pengelolaan pihak ketiga tersebut.
          </p>
          <p className="text-gray-700">Penggunaan layanan pihak ketiga mengikuti syarat dan ketentuan masing-masing penyedia layanan.</p>
        </section>

        {/* 16. Keadaan di Luar Kendali */}
        <section className="bg-white border border-borderColor rounded-xl p-6 md:p-8 shadow-xs">
          <h2 className="text-base md:text-lg font-bold text-textDark mb-4 pb-2 border-b border-gray-100">
            16. Keadaan di Luar Kendali
          </h2>
          <p className="text-gray-700">
            Melody Furniture tidak bertanggung jawab atas keterlambatan atau kegagalan pemenuhan layanan yang disebabkan oleh keadaan di luar kendali yang wajar, termasuk namun tidak terbatas pada bencana alam, gangguan jaringan atau sistem, gangguan transportasi, kebijakan pemerintah, kerusuhan, keadaan darurat, atau gangguan operasional pihak ketiga.
          </p>
        </section>

        {/* 17. Perubahan Syarat & Ketentuan */}
        <section className="bg-white border border-borderColor rounded-xl p-6 md:p-8 shadow-xs">
          <h2 className="text-base md:text-lg font-bold text-textDark mb-4 pb-2 border-b border-gray-100">
            17. Perubahan Syarat & Ketentuan
          </h2>
          <p className="mb-3 text-gray-700">
            Melody Furniture dapat memperbarui Syarat & Ketentuan ini dari waktu ke waktu untuk menyesuaikan dengan perkembangan layanan, operasional, maupun peraturan yang berlaku.
          </p>
          <p className="text-gray-700">Perubahan akan berlaku sejak tanggal pembaruan yang tercantum pada halaman ini.</p>
        </section>

        {/* 18. Hubungi Kami */}
        <section className="bg-white border border-borderColor rounded-xl p-6 md:p-8 shadow-xs">
          <h2 className="text-base md:text-lg font-bold text-textDark mb-4 pb-2 border-b border-gray-100">
            18. Hubungi Kami
          </h2>
          <p className="mb-5 text-gray-700">
            Apabila Anda memiliki pertanyaan mengenai Syarat & Ketentuan, pemesanan, pengiriman, retur, atau layanan lainnya, silakan menghubungi tim Melody Furniture melalui kontak resmi yang tersedia pada website.
          </p>
          <div className="bg-[#F8F9FA] border border-borderColor p-5 rounded-xl">
            <p className="font-bold text-textDark text-base">Melody Furniture</p>
            <p className="text-xs text-textMuted mt-1">PT GALANGCITRAMITRA MAJUMAPAN</p>
            <div className="mt-4 pt-3 border-t border-gray-200 text-xs text-textMuted flex justify-between items-center">
              <span>Status Dokumen: Resmi</span>
              <span>Terakhir diperbarui: 22 September 2026</span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default function TermsAndConditionsPage() {
  return (
    <LegacyPage
      theme="shop"
      css={css}
      js=""
      bodyClassName="bg-bgLight text-textDark antialiased leading-relaxed font-['inter']"
      bodyStyle={{}}
      dataAttrs={{}}
    >
      <Navbar />
      <TermsBreadcrumb />
      <Suspense fallback={<div className="text-center py-10">Memuat Syarat & Ketentuan...</div>}>
        <TermsHeader />
        <TermsContent />
      </Suspense>
      <Footer />
      <ChatWidget />
    </LegacyPage>
  );
}