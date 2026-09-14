'use client';

import { LegacyPage } from "@/components/LegacyPage";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ChatWidget } from "@/components/ChatWidget";
import { css, js } from "@/legacy/index.legacy";

export default function TentangKamiPage() {
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
          <span className="text-primary font-medium">Tentang Kami</span>
        </nav>

        {/* Container Utama */}
        <div className="bg-white rounded-xl shadow-sm border border-borderColor p-6 md:p-10 space-y-10">
          
          {/* Header & Tagline */}
          <div className="border-b border-borderColor pb-8 text-center md:text-left space-y-3">
            <h1 className="font-['Plus_Jakarta_Sans'] font-bold text-3xl md:text-5xl text-textDark tracking-tight">
              Tentang Kami
            </h1>
            <p className="font-['Plus_Jakarta_Sans'] font-semibold text-lg md:text-xl text-primary leading-snug">
              Menghadirkan Solusi Hunian yang Fungsional, Estetis, dan Terjangkau.
            </p>
            <p className="text-xs md:text-sm text-textMuted leading-relaxed pt-2">
              Mewujudkan rumah yang nyaman dan tertata rapi tidak harus rumit. Di Melody Furniture, kami percaya bahwa setiap elemen dalam ruangan harus mampu memberikan nilai tambah, baik dari segi fungsi, estetika, maupun ketahanan jangka panjang.
            </p>
            <p className="text-xs md:text-sm text-textMuted leading-relaxed">
              Sebagai merek lini dari <strong className="text-textDark">PT GALANGCITRAMITRA MAJUMAPAN</strong>, perusahaan manufaktur furnitur berbasis kayu olahan yang berpusat di Malang, Jawa Timur, Melody Furniture berdiri di atas fondasi pengalaman manufaktur yang telah teruji dalam melayani kebutuhan pasar domestik maupun internasional.
            </p>
          </div>

          {/* Section: Berpengalaman di Pasar Global */}
          <div className="p-6 md:p-8 bg-gray-50 rounded-xl border border-borderColor/60 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-xl md:text-2xl">public</span>
              </div>
              <h2 className="font-['Plus_Jakarta_Sans'] font-bold text-xl md:text-2xl text-textDark">
                Berpengalaman di Pasar Global
              </h2>
            </div>
            <p className="text-xs md:text-sm text-textMuted leading-relaxed">
              Sebagai bagian dari perusahaan manufaktur yang berorientasi pada pasar ekspor, produk kami telah dipercaya dan dikirim ke lebih dari 20 negara. Pengalaman tersebut membentuk standar produksi kami untuk memenuhi tuntutan pasar global, mulai dari konsistensi kualitas, ketepatan produksi, presisi komponen, hingga efisiensi proses distribusi.
            </p>
            <p className="text-xs md:text-sm text-textMuted leading-relaxed">
              Pengalaman melayani pasar internasional menjadi salah satu fondasi kami dalam menghadirkan produk untuk masyarakat Indonesia, membawa standar manufaktur yang telah teruji di pasar global ke dalam kebutuhan hunian sehari-hari.
            </p>
            <p className="text-xs md:text-sm text-textMuted leading-relaxed">
              Kami mengombinasikan keahlian produksi berskala besar dengan pemahaman mendalam terhadap kebutuhan dan gaya hidup masyarakat modern, sehingga setiap produk tidak hanya dirancang untuk terlihat baik, tetapi juga memiliki fungsi dan nilai guna yang nyata.
            </p>
          </div>

          {/* Section: Pendekatan Kami dalam Merancang Produk */}
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="font-['Plus_Jakarta_Sans'] font-bold text-xl md:text-2xl text-textDark">
                Pendekatan Kami dalam Merancang Produk
              </h2>
              <p className="text-xs md:text-sm text-textMuted leading-relaxed">
                Perkembangan tata ruang hunian saat ini menuntut furnitur yang semakin adaptif. Kami merancang setiap produk dengan fokus pada efisiensi, kepraktisan, dan kemudahan penggunaan tanpa mengorbankan kualitas visual maupun struktur produk.
              </p>
            </div>

            {/* Grid 4 Pilar Pendekatan */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Pillar 1 */}
              <div className="p-5 rounded-lg border border-borderColor bg-white space-y-2 hover:border-primary/50 transition-colors">
                <div className="flex items-center gap-2.5 text-primary">
                  <span className="material-symbols-outlined text-2xl">design_services</span>
                  <h3 className="font-bold text-base text-textDark">Desain Modern &amp; Efisien</h3>
                </div>
                <p className="text-xs md:text-sm text-textMuted leading-relaxed">
                  Koleksi kami mengusung garis desain yang bersih dan minimalis, sehingga mudah diintegrasikan ke dalam berbagai gaya interior—mulai dari rumah tinggal, apartemen, hingga ruang kerja.
                </p>
              </div>

              {/* Pillar 2 */}
              <div className="p-5 rounded-lg border border-borderColor bg-white space-y-2 hover:border-primary/50 transition-colors">
                <div className="flex items-center gap-2.5 text-primary">
                  <span className="material-symbols-outlined text-2xl">precision_manufacturing</span>
                  <h3 className="font-bold text-base text-textDark">Standar Manufaktur Presisi</h3>
                </div>
                <p className="text-xs md:text-sm text-textMuted leading-relaxed">
                  Dengan memanfaatkan material <em>engineered wood</em> pilihan yang diproses melalui teknologi manufaktur terintegrasi, kami menjaga tingkat presisi komponen, konsistensi produksi, serta kestabilan struktur produk. Pengalaman dalam memenuhi kebutuhan pasar ekspor juga mendorong kami untuk mempertahankan standar produksi yang konsisten.
                </p>
              </div>

              {/* Pillar 3 */}
              <div className="p-5 rounded-lg border border-borderColor bg-white space-y-2 hover:border-primary/50 transition-colors">
                <div className="flex items-center gap-2.5 text-primary">
                  <span className="material-symbols-outlined text-2xl">extension</span>
                  <h3 className="font-bold text-base text-textDark">Sistem Bongkar-Pasang (Knock-Down)</h3>
                </div>
                <p className="text-xs md:text-sm text-textMuted leading-relaxed">
                  Seluruh produk dirancang dengan sistem knock-down untuk memudahkan proses distribusi, pengiriman, penyimpanan, dan perakitan. Setiap produk dilengkapi dengan instruksi perakitan yang jelas sehingga dapat dirakit secara efisien di tempat tujuan.
                </p>
              </div>

              {/* Pillar 4 */}
              <div className="p-5 rounded-lg border border-borderColor bg-white space-y-2 hover:border-primary/50 transition-colors">
                <div className="flex items-center gap-2.5 text-primary">
                  <span className="material-symbols-outlined text-2xl">payments</span>
                  <h3 className="font-bold text-base text-textDark">Nilai Investasi yang Logis</h3>
                </div>
                <p className="text-xs md:text-sm text-textMuted leading-relaxed">
                  Melalui optimalisasi proses manufaktur dan rantai produksi internal, kami berupaya menghadirkan furnitur dengan kualitas dan standar produksi yang baik dengan harga yang tetap rasional bagi pasar. Kami percaya furnitur yang baik adalah keseimbangan antara desain, fungsi, kualitas, daya tahan, dan nilai yang didapatkan.
                </p>
              </div>

            </div>
          </div>

          {/* Section: Dari Manufaktur untuk Hunian Anda */}
          <div className="p-6 md:p-8 bg-[#F4F8F5] rounded-xl border border-primary/20 space-y-3">
            <h2 className="font-['Plus_Jakarta_Sans'] font-bold text-lg md:text-xl text-textDark">
              Dari Manufaktur untuk Hunian Anda
            </h2>
            <p className="text-xs md:text-sm text-textMuted leading-relaxed">
              Pengalaman kami sebagai manufaktur yang melayani pasar internasional memberikan perspektif yang berbeda dalam mengembangkan produk. Standar yang kami terapkan tidak berhenti pada bagaimana sebuah produk terlihat, tetapi juga bagaimana produk tersebut diproduksi, dikemas, dikirim, dirakit, dan digunakan dalam jangka panjang.
            </p>
            <p className="text-xs md:text-sm text-textMuted leading-relaxed">
              Melalui Melody Furniture, kami membawa pengalaman dan kapabilitas manufaktur tersebut lebih dekat dengan kebutuhan masyarakat Indonesia.
            </p>
          </div>

          {/* Section: Komitmen Pelayanan */}
          <div className="space-y-4">
            <h2 className="font-['Plus_Jakarta_Sans'] font-bold text-xl md:text-2xl text-textDark">
              Komitmen Pelayanan
            </h2>
            <p className="text-xs md:text-sm text-textMuted leading-relaxed">
              Bagi kami, peran Melody Furniture tidak berhenti saat produk keluar dari lini produksi. Kami berkomitmen untuk menjadi mitra tepercaya dalam membantu menciptakan ruang hidup yang lebih nyaman dan tertata melalui ketersediaan produk yang konsisten, proses pembelian yang transparan, serta dukungan layanan pelanggan yang responsif.
            </p>
          </div>

          {/* Penutup / Quote Highlight */}
          <div className="p-6 bg-gray-50 rounded-xl border border-borderColor text-center space-y-3">
            <p className="text-sm md:text-base text-textDark font-medium italic leading-relaxed">
              &ldquo;Karena pada akhirnya, furnitur bukan sekadar benda yang mengisi ruangan. Furnitur adalah bagian dari bagaimana sebuah ruang digunakan, dinikmati, dan menjadi tempat untuk menjalani kehidupan.&rdquo;
            </p>
            <p className="text-xs md:text-sm text-primary font-bold">
              Terima kasih telah mempercayakan kebutuhan penataan ruang Anda kepada Melody Furniture.
            </p>
          </div>

        </div>
      </main>

      <Footer />
      <ChatWidget />
    </LegacyPage>
  );
}