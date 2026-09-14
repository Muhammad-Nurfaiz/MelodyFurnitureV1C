'use client';

import { LegacyPage } from "@/components/LegacyPage";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ChatWidget } from "@/components/ChatWidget";
import { css, js } from "@/legacy/index.legacy";

export default function KebijakanPrivasiPage() {
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
          <span className="text-primary font-medium">Kebijakan Privasi</span>
        </nav>

        {/* Container Utama */}
        <div className="bg-white rounded-xl shadow-sm border border-borderColor p-6 md:p-10 space-y-8">
          {/* Header Halaman */}
          <div className="border-b border-borderColor pb-6">
            <h1 className="font-['Plus_Jakarta_Sans'] font-bold text-2xl md:text-4xl text-textDark tracking-tight mb-2">
              Kebijakan Privasi
            </h1>
            <p className="text-textMuted text-xs md:text-sm">
              Terakhir diperbarui: <span className="font-medium text-textDark">11 Desember 2024</span>
            </p>
          </div>

          {/* Pengantar */}
          <div className="p-4 md:p-5 rounded-lg bg-gray-50 border border-borderColor/60 text-xs md:text-sm text-textMuted leading-relaxed">
            Kami di <strong className="text-textDark">PT Gatra Mapan Indonesia</strong> sangat menghargai privasi Anda. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, melindungi, dan membagikan informasi pribadi yang Anda berikan kepada kami saat menggunakan layanan kami melalui situs web <a href="https://melodyfurniture.com" className="text-primary hover:underline font-medium">melodyfurniture.com</a>. Dengan menggunakan Website ini, Anda menyetujui pengumpulan dan penggunaan informasi sesuai dengan kebijakan ini.
          </div>

          {/* Daftar Kebijakan */}
          <div className="space-y-6">
            {/* 1. Informasi yang Kami Kumpulkan */}
            <div className="flex gap-4 p-4 md:p-5 rounded-lg bg-gray-50 border border-borderColor/60">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-xl md:text-2xl">database</span>
              </div>
              <div className="space-y-2">
                <h2 className="text-base md:text-lg font-bold text-textDark">
                  1. Informasi yang Kami Kumpulkan
                </h2>
                <p className="text-xs md:text-sm text-textMuted leading-relaxed">
                  Kami mengumpulkan berbagai jenis informasi untuk menyediakan dan meningkatkan layanan kami, antara lain:
                </p>
                <ul className="list-disc list-inside space-y-1.5 text-xs md:text-sm text-textMuted leading-relaxed">
                  <li>
                    <strong className="text-textDark">Informasi Pribadi:</strong> Saat Anda mendaftar akun, melakukan pembelian, atau menghubungi kami, kami mungkin mengumpulkan informasi seperti nama, alamat email, alamat pengiriman, nomor telepon, dan informasi pembayaran.
                  </li>
                  <li>
                    <strong className="text-textDark">Informasi Penggunaan:</strong> Kami mengumpulkan data terkait bagaimana Anda menggunakan Website, termasuk alamat IP, jenis perangkat, jenis browser, halaman yang Anda akses, waktu kunjungan, dan informasi lainnya yang membantu kami meningkatkan pengalaman pengguna.
                  </li>
                  <li>
                    <strong className="text-textDark">Cookies:</strong> Kami menggunakan cookies untuk melacak aktivitas di Website kami. Cookies adalah file kecil yang disimpan di perangkat Anda dan memungkinkan kami mengingat preferensi atau pengaturan Anda.
                  </li>
                </ul>
              </div>
            </div>

            {/* 2. Bagaimana Kami Menggunakan Informasi Anda */}
            <div className="flex gap-4 p-4 md:p-5 rounded-lg bg-gray-50 border border-borderColor/60">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-xl md:text-2xl">manage_accounts</span>
              </div>
              <div className="space-y-2">
                <h2 className="text-base md:text-lg font-bold text-textDark">
                  2. Bagaimana Kami Menggunakan Informasi Anda
                </h2>
                <p className="text-xs md:text-sm text-textMuted leading-relaxed">
                  Kami menggunakan informasi yang kami kumpulkan untuk berbagai tujuan, termasuk namun tidak terbatas pada:
                </p>
                <ul className="list-disc list-inside space-y-1.5 text-xs md:text-sm text-textMuted leading-relaxed">
                  <li>Untuk menyediakan, mengoperasikan, dan meningkatkan layanan kami.</li>
                  <li>Untuk memproses pesanan dan pengiriman produk kepada Anda.</li>
                  <li>Untuk memberikan dukungan pelanggan, menjawab pertanyaan, dan menangani permintaan Anda.</li>
                  <li>Untuk mengirimkan pembaruan terkait pesanan, promosi, atau informasi terkait lainnya yang relevan.</li>
                  <li>Untuk memahami dan menganalisis penggunaan Website guna meningkatkan pengalaman pengguna.</li>
                  <li>Untuk mematuhi kewajiban hukum atau regulasi yang berlaku.</li>
                </ul>
              </div>
            </div>

            {/* 3. Keamanan Informasi */}
            <div className="flex gap-4 p-4 md:p-5 rounded-lg bg-gray-50 border border-borderColor/60">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-xl md:text-2xl">lock</span>
              </div>
              <div className="space-y-2">
                <h2 className="text-base md:text-lg font-bold text-textDark">
                  3. Keamanan Informasi
                </h2>
                <p className="text-xs md:text-sm text-textMuted leading-relaxed">
                  Kami mengutamakan keamanan informasi pribadi Anda dan menerapkan langkah-langkah perlindungan yang wajar untuk menjaga kerahasiaan dan integritas data Anda. Meskipun kami berupaya menjaga informasi pribadi Anda tetap aman, tidak ada metode pengiriman data melalui internet atau penyimpanan elektronik yang 100% aman. Kami tidak dapat menjamin keamanan mutlak.
                </p>
              </div>
            </div>

            {/* 4. Berbagi Informasi */}
            <div className="flex gap-4 p-4 md:p-5 rounded-lg bg-gray-50 border border-borderColor/60">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-xl md:text-2xl">share</span>
              </div>
              <div className="space-y-2">
                <h2 className="text-base md:text-lg font-bold text-textDark">
                  4. Berbagi Informasi
                </h2>
                <p className="text-xs md:text-sm text-textMuted leading-relaxed">
                  Kami tidak menjual, menyewa, atau membagikan informasi pribadi Anda dengan pihak ketiga tanpa izin Anda, kecuali dalam kondisi berikut:
                </p>
                <ul className="list-disc list-inside space-y-1.5 text-xs md:text-sm text-textMuted leading-relaxed">
                  <li>
                    <strong className="text-textDark">Layanan Pihak Ketiga:</strong> Kami dapat membagikan informasi dengan penyedia layanan pihak ketiga yang membantu kami menjalankan Website dan layanan terkait, seperti layanan pengiriman atau pembayaran.
                  </li>
                  <li>
                    <strong className="text-textDark">Kepatuhan Hukum:</strong> Kami dapat membagikan informasi Anda jika diperlukan oleh hukum atau peraturan yang berlaku, atau untuk melindungi hak, properti, atau keselamatan kami atau pihak lain.
                  </li>
                  <li>
                    <strong className="text-textDark">Perusahaan Afiliasi:</strong> Kami dapat membagikan informasi dengan perusahaan afiliasi kami, tetapi hanya untuk tujuan yang relevan dengan layanan kami.
                  </li>
                </ul>
              </div>
            </div>

            {/* 5. Pilihan Anda */}
            <div className="flex gap-4 p-4 md:p-5 rounded-lg bg-gray-50 border border-borderColor/60">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-xl md:text-2xl">tune</span>
              </div>
              <div className="space-y-2">
                <h2 className="text-base md:text-lg font-bold text-textDark">
                  5. Pilihan Anda
                </h2>
                <p className="text-xs md:text-sm text-textMuted leading-relaxed">
                  Anda memiliki hak untuk:
                </p>
                <ul className="list-disc list-inside space-y-1.5 text-xs md:text-sm text-textMuted leading-relaxed">
                  <li>Mengakses informasi pribadi Anda yang kami miliki.</li>
                  <li>Memperbarui atau memperbaiki informasi pribadi yang tidak akurat atau sudah usang.</li>
                  <li>Menarik persetujuan Anda untuk pengumpulan atau penggunaan data pribadi, dengan catatan hal ini tidak mempengaruhi kegiatan yang telah dilakukan sebelumnya.</li>
                  <li>Menghapus akun Anda dengan menghubungi kami melalui informasi kontak yang tertera di bawah ini.</li>
                </ul>
                <p className="text-xs md:text-sm text-textMuted leading-relaxed pt-1">
                  Untuk melakukan perubahan terkait preferensi atau pengaturan data Anda, silakan hubungi kami di <a href="mailto:gatra.ecommerce@gmail.com" className="text-primary hover:underline font-medium">gatra.ecommerce@gmail.com</a>.
                </p>
              </div>
            </div>

            {/* 6. Perubahan Kebijakan Privasi */}
            <div className="flex gap-4 p-4 md:p-5 rounded-lg bg-gray-50 border border-borderColor/60">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-xl md:text-2xl">update</span>
              </div>
              <div className="space-y-2">
                <h2 className="text-base md:text-lg font-bold text-textDark">
                  6. Perubahan Kebijakan Privasi
                </h2>
                <p className="text-xs md:text-sm text-textMuted leading-relaxed">
                  Kami berhak untuk memperbarui atau mengubah Kebijakan Privasi ini kapan saja. Jika ada perubahan material, kami akan memberitahukan Anda melalui pemberitahuan di Website kami atau melalui email. Kami mendorong Anda untuk meninjau Kebijakan Privasi ini secara berkala agar tetap mendapatkan informasi terkini mengenai cara kami melindungi data pribadi Anda.
                </p>
              </div>
            </div>

            {/* 7. Tautan ke Situs Pihak Ketiga */}
            <div className="flex gap-4 p-4 md:p-5 rounded-lg bg-gray-50 border border-borderColor/60">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-xl md:text-2xl">open_in_new</span>
              </div>
              <div className="space-y-2">
                <h2 className="text-base md:text-lg font-bold text-textDark">
                  7. Tautan ke Situs Pihak Ketiga
                </h2>
                <p className="text-xs md:text-sm text-textMuted leading-relaxed">
                  Website ini mungkin berisi tautan ke situs web pihak ketiga yang tidak kami kendalikan. Kami tidak bertanggung jawab atas kebijakan privasi atau konten dari situs pihak ketiga. Kami menyarankan Anda untuk membaca kebijakan privasi situs web tersebut sebelum memberikan informasi pribadi.
                </p>
              </div>
            </div>

            {/* 8. Hubungi Kami */}
            <div className="flex gap-4 p-4 md:p-5 rounded-lg bg-gray-50 border border-borderColor/60">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-xl md:text-2xl">contact_support</span>
              </div>
              <div className="space-y-3 w-full">
                <h2 className="text-base md:text-lg font-bold text-textDark">
                  8. Hubungi Kami
                </h2>
                <p className="text-xs md:text-sm text-textMuted leading-relaxed">
                  Jika Anda memiliki pertanyaan atau komentar terkait Kebijakan Privasi ini, atau ingin mengakses, memperbarui, atau menghapus informasi pribadi Anda, silakan hubungi kami di:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                  <div className="p-3 bg-white rounded border border-borderColor flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-primary text-lg mt-0.5">mail</span>
                    <div>
                      <p className="text-[11px] font-semibold text-textMuted uppercase">Email</p>
                      <a href="mailto:gatra.ecommerce@gmail.com" className="text-xs text-textDark hover:text-primary font-medium break-all">
                         gatra.ecommerce@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded border border-borderColor flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-primary text-lg mt-0.5">call</span>
                    <div>
                      <p className="text-[11px] font-semibold text-textMuted uppercase">Telepon</p>
                      <a href="tel:081133302007" className="text-xs text-textDark hover:text-primary font-medium">
                        0811-3330-2007
                      </a>
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded border border-borderColor flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-primary text-lg mt-0.5">location_on</span>
                    <div>
                      <p className="text-[11px] font-semibold text-textMuted uppercase">Alamat</p>
                      <p className="text-xs text-textDark leading-tight">
                        Jl. Tegal Mapan no 18, Pakisjajar, Pakis, Malang, Jawa Timur 65154
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Catatan Penutup */}
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 text-center">
            <p className="text-xs md:text-sm text-textMuted italic">
              Dengan menggunakan Website kami, Anda menyetujui Kebijakan Privasi ini dan pengumpulan serta penggunaan informasi pribadi Anda sesuai dengan ketentuan yang telah dijelaskan.
            </p>
          </div>
        </div>
      </main>

      <Footer />
      <ChatWidget />
    </LegacyPage>
  );
}