sekerang pada bagian komponen ini ketika diklik tidak muncul, perbaiki bugnya, perbaiki juga cssnya, sesuaikan css nya dengan tema warna pada website ini.

'use client';

import { runInline } from "@/lib/legacy-runtime";

export function ChatWidget() {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-['Inter']">
      {/* Container Jendela Chat */}
      <div
        id="chatWindow"
        className="hidden w-[330px] sm:w-[360px] h-[480px] bg-[#F8F9FA] rounded-2xl shadow-2xl border border-borderColor flex flex-col overflow-hidden mb-4 transition-all duration-300 transform translate-y-4 opacity-0"
      >
        {/* Header Chat */}
        <div className="bg-primary text-white p-4 flex items-center justify-between shadow-sm relative">
          <div className="flex items-center space-x-3">
            <div className="relative w-10 h-10 rounded-full bg-white/20 flex items-center justify-center border border-white/10 shrink-0">
              <span className="material-symbols-outlined text-white !text-2xl">
                account_circle
              </span>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-[#4E46E5] rounded-full"></span>
            </div>
            <div>
              <div className="flex items-center space-x-1">
                <span className="font-bold text-sm tracking-wide">
                  Admin Melody Furniture
                </span>
                <span
                  className="material-symbols-outlined !text-xs text-blue-200"
                  style={{ fontVariationSettings: '"FILL" 1' }}
                >
                  verified
                </span>
              </div>
              <p className="text-[11px] text-white/80 font-light">
                Online &amp; Siap Membantu
              </p>
            </div>
          </div>

          <button
            id="closeChatHeader"
            className="text-white/70 hover:text-white transition focus:outline-none"
          >
            <span className="material-symbols-outlined !text-xl">close</span>
          </button>
        </div>

        {/* Body Chat */}
        <div
          id="chatBody"
          className="flex-1 p-4 overflow-y-auto space-y-3 flex flex-col text-xs sm:text-sm"
        >
          {/* Bubble Pesan Sambutan */}
          <div className="flex flex-col items-start max-w-[85%] space-y-1 shrink-0">
            <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm text-textDark border border-borderColor/60 leading-relaxed">
              Halo! 👋 Ada yang bisa kami bantu? Silakan pilih salah satu opsi
              di bawah ini untuk respon kilat dari sistem kami.
            </div>
            <span className="text-[10px] text-textMuted ml-1">Baru saja</span>
          </div>

          {/* Area Pesan Dinamis */}
          <div id="dynamicMessages" className="space-y-3 flex flex-col"></div>

          {/* Indicator Typing */}
          <div
            id="typingIndicator"
            className="hidden flex flex-col items-start max-w-[85%] space-y-1"
          >
            <div className="bg-white px-3 py-2 rounded-2xl rounded-tl-none shadow-sm text-textMuted border border-borderColor/60 flex items-center space-x-1">
              <span
                className="w-1.5 h-1.5 bg-textMuted/60 rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              ></span>
              <span
                className="w-1.5 h-1.5 bg-textMuted/60 rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              ></span>
              <span
                className="w-1.5 h-1.5 bg-textMuted/60 rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              ></span>
            </div>
          </div>

          {/* Opsi Template Pertanyaan */}
          <div id="chatTemplates" className="space-y-1.5 pt-2 shrink-0">
            <p className="text-[11px] font-semibold text-textMuted uppercase tracking-wider mb-1">
              Pilih Pertanyaan:
            </p>
            <button
              onClick={(event) =>
                runInline(
                  event,
                  `
                triggerTemplateChat(
                  1,
                  '📦 Apakah kursi Nordic Oak ready stok?',
                  'Tentu saja! Kursi Nordic Oak Chair saat ini berstatus ready siap kirim dari gudang kami. Silakan klik tombol \\'Beli Sekarang\\' untuk langsung memesan sebelum kehabisan kuota diskon bulanan!',
                )
              `
                )
              }
              className="w-full text-left bg-white border border-borderColor hover:border-primary hover:text-primary px-3 py-2 rounded-xl text-[11px] sm:text-xs font-medium shadow-sm transition active:scale-[0.99]"
            >
              📦 Apakah kursi Nordic Oak ready stok?
            </button>
            <button
              onClick={(event) =>
                runInline(
                  event,
                  `
                triggerTemplateChat(
                  2,
                  '🚚 Berapa ongkos kirim ke kota saya?',
                  'Untuk wilayah Malang Kota, pengiriman gratis atau bisa ambil langsung di showroom kami. Di luar itu, kami bekerja sama dengan kargo terpercaya untuk memastikan tarif termurah yang akan dihitung otomatis saat pengisian checkout.',
                )
              `
                )
              }
              className="w-full text-left bg-white border border-borderColor hover:border-primary hover:text-primary px-3 py-2 rounded-xl text-[11px] sm:text-xs font-medium shadow-sm transition active:scale-[0.99]"
            >
              🚚 Berapa ongkos kirim ke kota saya?
            </button>
            <button
              onClick={(event) =>
                runInline(
                  event,
                  `
                triggerTemplateChat(
                  3,
                  '🛡️ Apakah ada jaminan garansi produk?',
                  'Setiap pembelian produk premium di Melody Furniture dilengkapi garansi konstruksi & rangka kayu selama 1 tahun penuh. Kepuasan serta rasa aman Anda adalah prioritas utama kami.',
                )
              `
                )
              }
              className="w-full text-left bg-white border border-borderColor hover:border-primary hover:text-primary px-3 py-2 rounded-xl text-[11px] sm:text-xs font-medium shadow-sm transition active:scale-[0.99]"
            >
              🛡️ Apakah ada jaminan garansi produk?
            </button>
            <button
              onClick={(event) =>
                runInline(
                  event,
                  `
                triggerTemplateChat(
                  4,
                  '🔧 Bagaimana sistem perakitan kursinya?',
                  'Sangat mudah! Kursi ini dikirim dengan modul semi-knockdown yang presisi. Di dalam paket sudah tersedia kunci L dan buku panduan lengkap. Anda juga bisa menonton video panduan praktis yang disematkan di halaman produk ini.',
                )
              `
                )
              }
              className="w-full text-left bg-white border border-borderColor hover:border-primary hover:text-primary px-3 py-2 rounded-xl text-[11px] sm:text-xs font-medium shadow-sm transition active:scale-[0.99]"
            >
              🔧 Bagaimana sistem perakitan kursinya?
            </button>
            <button
              onClick={(event) =>
                runInline(
                  event,
                  `
                triggerTemplateChat(
                  5,
                  '🎨 Bisa kustomisasi warna kain atau kayu?',
                  'Untuk koleksi mass-production seperti ini, warna kayu oak natural dan stainless steel adalah standar paten terbaik kami. Namun jika Anda membutuhkan kuantitas proyek besar (min. 10 pcs), opsi kustomisasi warna khusus dapat dibuka.',
                )
              `
                )
              }
              className="w-full text-left bg-white border border-borderColor hover:border-primary hover:text-primary px-3 py-2 rounded-xl text-[11px] sm:text-xs font-medium shadow-sm transition active:scale-[0.99]"
            >
              🎨 Bisa kustomisasi warna kain atau kayu?
            </button>
          </div>
        </div>
      </div>

      {/* Tombol Pemicu Floating Chat */}
      <button
        id="chatToggleBtn"
        className="w-14 h-14 bg-[#2C3E50] text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-opacity-95 transition transform hover:scale-105 active:scale-95 focus:outline-none"
        aria-label="Buka Obrolan"
      >
        <span
          id="chatToggleIcon"
          className="material-symbols-outlined !text-2xl"
        >
          chat
        </span>
      </button>
    </div>
  );
}
