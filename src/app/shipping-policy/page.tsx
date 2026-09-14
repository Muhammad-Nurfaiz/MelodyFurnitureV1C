'use client';

import { LegacyPage } from "@/components/LegacyPage";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ChatWidget } from "@/components/ChatWidget";
import { css, js } from "@/legacy/index.legacy"; // Menggunakan stylesheet/script dasar shop

export default function KebijakanPengirimanPage() {
  return (
    <LegacyPage
      theme="shop"
      css={css}
      js={js}
      bodyClassName="bg-bgLight text-textDark antialiased leading-relaxed font-['Inter']"
    >
      <Navbar />

      <main className="max-w-[1000px] mx-auto px-4 py-8 md:py-14">
        {/* Breadcrumb Navigation */}
        <nav className="flex text-xs md:text-sm text-textMuted space-x-2 mb-6">
          <a className="hover:text-primary transition-colors" href="/">
            Home
          </a>
          <span>/</span>
          <span className="text-primary font-medium">Kebijakan Pengiriman</span>
        </nav>

        {/* Container Utama */}
        <div className="bg-white rounded-xl shadow-sm border border-borderColor p-6 md:p-10 space-y-8">
          {/* Header Halaman */}
          <div className="border-b border-borderColor pb-6">
            <h1 className="font-['Plus_Jakarta_Sans'] font-bold text-2xl md:text-4xl text-textDark tracking-tight mb-2">
              Kebijakan Pengiriman
            </h1>
            <p className="text-textMuted text-sm md:text-base">
              Informasi lengkap mengenai ketentuan pengiriman, estimasi waktu, dan garansi keamanan produk Anda.
            </p>
          </div>

          {/* Daftar Kebijakan */}
          <div className="space-y-6">
            {/* 1. Pengiriman Gratis */}
            <div className="flex gap-4 p-4 md:p-5 rounded-lg bg-gray-50 border border-borderColor/60">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-xl md:text-2xl">local_shipping</span>
              </div>
              <div className="space-y-2">
                <h2 className="text-base md:text-lg font-bold text-textDark">
                  1. Pengiriman Gratis
                </h2>
                <ul className="list-disc list-inside space-y-1.5 text-xs md:text-sm text-textMuted leading-relaxed">
                  <li>
                    <strong className="text-textDark">Jawa dan Bali:</strong> Pengiriman gratis untuk seluruh area di Jawa dan Bali.
                  </li>
                  <li>
                    <strong className="text-textDark">Luar Jawa dan Bali:</strong> Untuk pengiriman di luar wilayah Jawa dan Bali, harap menghubungi admin terlebih dahulu melalui nomor yang sudah kami lampirkan. Kami akan menghitungkan ongkir serta subsidi ongkir yang kami tawarkan.
                  </li>
                </ul>
              </div>
            </div>

            {/* 2. Waktu Pengiriman */}
            <div className="flex gap-4 p-4 md:p-5 rounded-lg bg-gray-50 border border-borderColor/60">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-xl md:text-2xl">schedule</span>
              </div>
              <div className="space-y-2">
                <h2 className="text-base md:text-lg font-bold text-textDark">
                  2. Waktu Pengiriman
                </h2>
                <ul className="list-disc list-inside space-y-1.5 text-xs md:text-sm text-textMuted leading-relaxed">
                  <li>
                    <strong className="text-textDark">Order sebelum jam 11.00 WIB:</strong> Pesanan yang diterima sebelum pukul 11.00 WIB akan diproses dan dikirimkan di hari yang sama.
                  </li>
                  <li>
                    <strong className="text-textDark">Order setelah jam 11.00 WIB:</strong> Pesanan yang diterima setelah pukul 11.00 WIB akan diproses dan dikirimkan pada hari berikutnya.
                  </li>
                </ul>
              </div>
            </div>

            {/* 3. Metode Pengiriman */}
            <div className="flex gap-4 p-4 md:p-5 rounded-lg bg-gray-50 border border-borderColor/60">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-xl md:text-2xl">departure_board</span>
              </div>
              <div className="space-y-2">
                <h2 className="text-base md:text-lg font-bold text-textDark">
                  3. Metode Pengiriman
                </h2>
                <p className="text-xs md:text-sm text-textMuted leading-relaxed">
                  Pengiriman barang akan menggunakan kargo, dengan pengiriman yang aman dan tepat waktu.
                </p>
              </div>
            </div>

            {/* 4. Informasi Resi */}
            <div className="flex gap-4 p-4 md:p-5 rounded-lg bg-gray-50 border border-borderColor/60">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-xl md:text-2xl">receipt_long</span>
              </div>
              <div className="space-y-2">
                <h2 className="text-base md:text-lg font-bold text-textDark">
                  4. Informasi Resi
                </h2>
                <p className="text-xs md:text-sm text-textMuted leading-relaxed">
                  Setelah barang dikirim, kami akan mengirimkan nomor resi kepada Anda. Resi dapat digunakan untuk melacak status pengiriman melalui website kargo yang telah diinformasikan oleh kami.
                </p>
              </div>
            </div>

            {/* 5. Quality Control dan Packing */}
            <div className="flex gap-4 p-4 md:p-5 rounded-lg bg-gray-50 border border-borderColor/60">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-xl md:text-2xl">verified</span>
              </div>
              <div className="space-y-2">
                <h2 className="text-base md:text-lg font-bold text-textDark">
                  5. Quality Control dan Packing
                </h2>
                <ul className="list-disc list-inside space-y-1.5 text-xs md:text-sm text-textMuted leading-relaxed">
                  <li>Sebelum dikirim, setiap paket akan melalui proses Quality Control untuk memastikan kualitas produk.</li>
                  <li>Produk akan dipacking dengan standar ekspor yang sesuai untuk pengiriman ke seluruh dunia, guna memastikan barang sampai dengan aman.</li>
                </ul>
              </div>
            </div>

            {/* 6. Klaim Kerusakan */}
            <div className="flex gap-4 p-4 md:p-5 rounded-lg bg-gray-50 border border-borderColor/60">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-xl md:text-2xl">shield</span>
              </div>
              <div className="space-y-2">
                <h2 className="text-base md:text-lg font-bold text-textDark">
                  6. Klaim Kerusakan
                </h2>
                <p className="text-xs md:text-sm text-textMuted leading-relaxed">
                  Kami memahami bahwa kerusakan barang mungkin terjadi selama proses pengiriman. Oleh karena itu, kami menyediakan <strong className="text-textDark">klaim garansi ganti baru tanpa biaya tambahan</strong> untuk kerusakan yang terjadi selama pengiriman <em>(syarat dan ketentuan berlaku)</em>.
                </p>
              </div>
            </div>
          </div>

          {/* Footer Bantuan / Layanan Pelanggan */}
          <div className="mt-8 p-6 bg-[#E8F7EE] rounded-lg border border-[#1B7F4C]/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="space-y-1">
              <h3 className="font-bold text-textDark text-sm md:text-base">Punya Pertanyaan Lebih Lanjut?</h3>
              <p className="text-textMuted text-xs md:text-sm">
                Jika Anda membutuhkan informasi tambahan, jangan ragu untuk menghubungi tim customer service kami.
              </p>
            </div>
            <a
              href="https://wa.me/6281133302007"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-primary text-white font-medium text-xs md:text-sm rounded-lg hover:bg-opacity-90 transition-all shrink-0 shadow-sm flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">support_agent</span>
              <span>Hubungi Kami</span>
            </a>
          </div>
        </div>
      </main>

      <Footer />
      <ChatWidget />
    </LegacyPage>
  );
}