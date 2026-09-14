'use client';

import Link from "next/link";
import { LegacyPage } from "@/components/LegacyPage";
import { DesktopNavLinks, MobileNavToggle } from "@/components/SiteNav";
import { runInline } from "@/lib/legacy-runtime";
import { css, js } from "@/legacy/detail-produk.legacy";
import { ChatWidget } from "@/components/ChatWidget";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  BreadcrumbSkeleton,
  PageHeadingSkeleton,
  ProductDetailSkeleton,
  SkeletonOverlay,
  useContentReady,
} from "@/components/ContentSkeleton";
import type { ReactNode } from "react";

function DetailMain({ children }: { children: ReactNode }) {
  const ready = useContentReady(650);
  return (
    <SkeletonOverlay ready={ready} skeleton={<ProductDetailSkeleton />}>
      {children}
    </SkeletonOverlay>
  );
}

function DetailHeading() {
  const ready = useContentReady(350);
  return (
    <SkeletonOverlay
      ready={ready}
      skeleton={
        <div className="space-y-3">
          <BreadcrumbSkeleton />
          <PageHeadingSkeleton />
        </div>
      }
    >
      <div className="space-y-3 md:space-y-4">
        <nav className="flex text-xs md:text-sm text-textMuted space-x-2">
          <a className="hover:text-primary transition-colors" href="/">Home</a>
          <span>/</span>
          <a className="hover:text-primary transition-colors" href="#">Meja TV</a>
          <span>/</span>
          <span className="text-primary font-medium">Buffet TV</span>
        </nav>
        <h1 className="font-['Plus_Jakarta_Sans'] font-bold text-xl md:text-3xl text-textDark">
          Meja TV RYUKI TV STAND RIVIERA Rustic Walnut
        </h1>
      </div>
    </SkeletonOverlay>
  );
}

export default function DetailProdukPage() {
  return (
    <LegacyPage
      theme="shop"
      css={css}
      js={js}
      bodyClassName="bg-bgLight text-textDark antialiased leading-relaxed font-['Inter']"
      bodyStyle={{  }}
      dataAttrs={{}}
    >
      <>
    <Navbar />
    <main className="max-w-[1200px] mx-auto px-4 py-8 md:py-12"><DetailMain>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            <div id="sidebarOverlay" className="fixed inset-0 bg-black/50 z-50 hidden opacity-0 transition-opacity duration-300 md:hidden"></div>
            
            <div className="space-y-4 md:space-y-6">
                <div id="heroMediaContainer" className="relative bg-white rounded-lg overflow-hidden aspect-square border border-borderColor shadow-sm">

                    
                    <div id="heroViewport" className="w-full h-full overflow-hidden touch-pan-y">

                        
                        <div id="heroTrack" className="flex h-full will-change-transform">

                            
                            <div data-index="0" className="hero-slide w-full h-full shrink-0 flex items-center justify-center bg-white">

                                <video id="heroVideo" className="max-w-full max-h-full" autoPlay={true} muted={true} loop={true} playsInline={true}>

                                    <source src="https://down-ws-id.vod.susercontent.com/api/v4/11110105/mms/id-11110105-6jt76-liv5i1rx3cv253.16003251711950497.mp4" type="video/mp4" />

                                </video>

                            </div>

                            
                            <div data-index="1" className="hero-slide w-full h-full shrink-0">

                                <img className="hero-image w-full h-full object-cover" src="https://down-id.img.susercontent.com/file/id-11134207-8224v-mg3dq7xthuz203.webp" />

                            </div>

                            
                            <div data-index="2" className="hero-slide w-full h-full shrink-0">

                                <img className="hero-image w-full h-full object-cover" src="https://down-id.img.susercontent.com/file/id-11134207-8224z-mg3dq7wdemtob2.webp" />

                            </div>

                            
                            <div data-index="3" className="hero-slide w-full h-full shrink-0">

                                <img className="hero-image w-full h-full object-cover" src="https://down-id.img.susercontent.com/file/id-11134207-82250-mg3dq7xtf1u626.webp" />

                            </div>

                            
                            <div data-index="4" className="hero-slide w-full h-full shrink-0">

                                <img className="hero-image w-full h-full object-cover" src="https://down-id.img.susercontent.com/file/id-11134207-8224y-mg3dq7wymrrjfc.webp" />

                            </div>

                        </div>

                    </div>

                    
                    <button id="heroPrev" className={"hidden lg:block absolute left-4 top-1/2 -translate-y-1/2\n                        w-10 h-10 rounded-full\n                        bg-white/80 hover:bg-white\n                        shadow-lg flex items-center justify-center z-30"}>

                        <span className="material-symbols-outlined">
                            chevron_left
                        </span>

                    </button>

                    
                    <button id="heroNext" className={"hidden lg:block absolute right-4 top-1/2 -translate-y-1/2\n                        w-10 h-10 rounded-full\n                        bg-white/80 hover:bg-white\n                        shadow-lg flex items-center justify-center z-30"}>

                        <span className="material-symbols-outlined">
                            chevron_right
                        </span>

                    </button>

                </div>
                <div className="grid grid-cols-5 gap-2 md:gap-4">
                        <div data-index="1" className="media-thumb cursor-pointer bg-white rounded border-2 border-primary overflow-hidden aspect-square" data-type="video">

                            <video className="w-full h-full object-contain pointer-events-none" muted={true} preload="metadata">
                                <source src="https://down-ws-id.vod.susercontent.com/api/v4/11110105/mms/id-11110105-6jt76-liv5i1rx3cv253.16003251711950497.mp4" type="video/mp4" />
                            </video>

                        </div>
                        <div data-index="2" className="media-thumb cursor-pointer bg-white rounded border-2 border-transparent overflow-hidden aspect-square opacity-60 hover:opacity-100 transition-all">
                            <img className="w-full h-full object-cover thumbnail" src="https://down-id.img.susercontent.com/file/id-11134207-8224v-mg3dq7xthuz203.webp" alt="Thumb 1" />
                        </div>
                        <div data-index="3" className="media-thumb cursor-pointer bg-white rounded border-2 border-transparent overflow-hidden aspect-square opacity-60 hover:opacity-100 transition-all">
                            <img className="w-full h-full object-cover thumbnail" src="https://down-id.img.susercontent.com/file/id-11134207-8224z-mg3dq7wdemtob2.webp" alt="Thumb 2" />
                        </div>
                        <div data-index="4" className="media-thumb cursor-pointer bg-white rounded border-2 border-transparent overflow-hidden aspect-square opacity-60 hover:opacity-100 transition-all">
                            <img className="w-full h-full object-cover thumbnail" src="https://down-id.img.susercontent.com/file/id-11134207-82250-mg3dq7xtf1u626.webp" alt="Thumb 3" />
                        </div>
                        <div data-index="5" className="media-thumb cursor-pointer bg-white rounded border-2 border-transparent overflow-hidden aspect-square opacity-60 hover:opacity-100 transition-all">
                            <img className="w-full h-full object-cover thumbnail" src="https://down-id.img.susercontent.com/file/id-11134207-8224y-mg3dq7wymrrjfc.webp" alt="Thumb 4" />
                        </div>
                </div>
            </div>

            
            <div className="lg:sticky lg:top-28 self-start space-y-6 md:space-y-8">
                <div className="space-y-3 md:space-y-4">
                    <DetailHeading />
                    <Link href="/produk?series=ryuki" className="inline-flex items-center gap-1.5 text-primary text-xs md:text-sm font-semibold hover:underline self-start">
                        <span>Lihat series lainnya</span>
                        <span className="material-symbols-outlined text-base md:text-lg">arrow_forward</span>
                    </Link>
                    <div className="flex items-baseline space-x-3 md:space-x-4">
                        <p className="text-lg md:text-2xl font-bold text-secondary">
                            Rp 1.091.000
                        </p>
                        <span className="text-xs md:text-sm text-textMuted line-through">Rp 1.515.000</span>
                        <span className="bg-[#FFECE8] text-secondary px-2 py-0.5 rounded text-[10px] md:text-xs font-bold">SALE</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                        <div className="inline-flex items-center gap-2 bg-[#E8F7EE] text-[#1B7F4C] px-3 py-1.5 rounded-full self-start">
                            <span className="material-symbols-outlined text-base md:text-lg">inventory_2</span>
                            <span className="text-xs md:text-sm font-bold">Stok tersedia: 24 unit</span>
                        </div>
                        <span className="text-[11px] md:text-xs text-textMuted">Stok terbatas, siap kirim dari gudang Malang</span>
                    </div>
                    <p className="text-xs md:text-sm text-textMuted leading-relaxed max-w-lg">
                        Ryuki TV Stand adalah Meja TV. Dilengkapi dengan 2 lemari penyimpanan sliding dan 2 tempat kosong yang secara fungsi dapat digunakan untuk menyimpan barang keperluan anda, di desain minimalis dan soft looking, cocok di ruangan kekinian anda. Tersedia dalam jumlah terbatas.
                    </p>

                </div>

                
                <div className="flex flex-col space-y-3">
                    <div className="flex space-x-4">
                        <button className="flex-1 bg-secondary text-white text-sm md:text-base font-bold py-3.5 md:py-4 rounded hover:bg-opacity-90 active:scale-[0.99] transition-all flex items-center justify-center space-x-2">
                            <span className="material-symbols-outlined">shopping_cart</span>
                            <span>Masukkan Keranjang</span>
                        </button>
                    </div>
                    <a href="/checkout" className="w-full border-2 border-primary text-primary text-sm md:text-base font-bold py-3.5 md:py-4 rounded hover:bg-primary hover:text-white active:scale-[0.99] transition-all text-center">
                        Beli Sekarang
                    </a>
                    <a href="https://www.youtube.com/watch?v=VIDEO_ID_DISINI" target="_blank" rel="noopener noreferrer" className="w-full border border-borderColor bg-white text-textDark text-xs md:text-sm font-medium py-3 rounded hover:bg-gray-50 hover:text-primary active:scale-[0.99] transition-all flex items-center justify-center space-x-2 shadow-sm">
                        <span className="material-symbols-outlined text-[#FF0000]">play_circle</span>
                        <span>Lihat Video Tutorial Pemasangan (YouTube)</span>
                    </a>
                </div>

                
                <div className="border-t border-borderColor pt-6 space-y-4">
                    
                    <div className="accordion-item border border-borderColor rounded overflow-hidden active bg-white shadow-sm">
                        <button className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors" onClick={(event) => runInline(event, `toggleAccordion(this)`)}>
                            <span className="text-sm md:text-base font-bold text-textDark flex items-center space-x-3">
                                <span className="material-symbols-outlined text-primary">straighten</span>
                                <span>Spesifikasi Produk</span>
                            </span>
                            <span className="material-symbols-outlined text-textMuted transition-transform duration-300 chevron-icon">expand_more</span>
                        </button>
                        <div className="accordion-content px-4 bg-white text-xs md:text-sm">
                            <div className="space-y-3 pt-2 pb-2">
                                <div className="flex justify-between border-b border-borderColor pb-2">
                                    <span className="text-textMuted">Dimensi</span>
                                    <span className="font-medium">159 x 39.6 x 48 cm</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-textMuted">Kapasitas Beban</span>
                                    <span className="font-medium">34.5 kg</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    
                    <div className="accordion-item border border-borderColor rounded overflow-hidden bg-white shadow-sm">
                        <button className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors" onClick={(event) => runInline(event, `toggleAccordion(this)`)}>
                            <span className="text-sm md:text-base font-bold text-textDark flex items-center space-x-3">
                                <span className="material-symbols-outlined text-primary">inventory_2</span>
                                <span>Detail Material</span>
                            </span>
                            <span className="material-symbols-outlined text-textMuted transition-transform duration-300 chevron-icon">expand_more</span>
                        </button>
                        <div className="accordion-content px-4 bg-white text-xs md:text-sm">
                            <div className="pt-2 pb-2">
                                <ul className="space-y-2 text-textMuted">
                                    <li className="flex items-start space-x-2">
                                        <span className="text-secondary mt-1">•</span>
                                        <span>Warna: Riviera - Rustic walnut</span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <span className="text-secondary mt-1">•</span>
                                        <span>Finishing: Paper</span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <span className="text-secondary mt-1">•</span>
                                        <span>Semua produk kami bersertifikat dunia: ISO Sertified 9001-2015, FSC, Indonesian Legal Wood</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    
                    <div className="accordion-item border border-borderColor rounded overflow-hidden bg-white shadow-sm">
                        <button className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors" onClick={(event) => runInline(event, `toggleAccordion(this)`)}>
                            <span className="text-sm md:text-base font-bold text-textDark flex items-center space-x-3">
                                <span className="material-symbols-outlined text-primary">local_shipping</span>
                                <span>Informasi Pengiriman</span>
                            </span>
                            <span className="material-symbols-outlined text-textMuted transition-transform duration-300 chevron-icon">expand_more</span>
                        </button>
                        <div className="accordion-content px-4 bg-white text-xs md:text-sm">
                            <div className="grid grid-cols-1 gap-4 pt-2 pb-2">
                                <div className="p-3 border border-borderColor rounded bg-bgLight">
                                    <p className="text-xs text-textMuted mt-1">PENGIRIMAN KE JAWA DAN DENPASAR MOHON PILIH ONGKOS KIRIM 0 RUPIAH! GRATIS ONGKIR!!</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        
        <section className="mt-16 md:mt-24">
            <div className="flex justify-between items-center mb-6 bg-white p-3.5 border-b-2 border-primary rounded-t shadow-sm">
                <div className="text-sm md:text-lg font-bold text-primary uppercase tracking-wide">Produk Rekomendasi</div>
                <a href="#" className="text-secondary no-underline text-xs md:text-sm font-medium hover:opacity-85 transition">Lihat Koleksi →</a>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
                
                <a href="/detail-produk" className="product-card flex-1 bg-white rounded overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-lg border border-transparent hover:border-secondary shadow-sm flex flex-col justify-between group">
                    <div className="w-full pt-[100%] bg-[#FAFAFA] relative overflow-hidden">
                        <img className="absolute inset-0 w-full h-full object-cover" src="https://brdsg.com/img/600/bw5d48ohbw5elgecxb_3/LdjLHL4h9lVwiIcLdmikNHu05JUCtRTC6OKxLtxrPbg.webp" alt="Oakland Table" />
                    </div>
                    <div className="p-3">
                        <h3 className="text-xs md:text-sm font-bold mb-2 text-textDark line-clamp-2 h-9 group-hover:text-primary transition-colors">Lemari Serbaguna Lemari Sideboard RYUKI SIDEBOARD RIVIERA EICHI</h3>
                        <div className="text-gray-500 line-through">Rp 3.416.000</div>
                        <div className="flex items-center justify-between mt-1.5">
                            <span className="text-secondary text-sm md:text-base font-bold">Rp 1.685.000</span>
                            <span className="bg-[#FFECE8] text-secondary text-[10px] md:text-xs px-1.5 py-0.5 rounded font-medium">Populer</span>
                        </div>
                        <div className="text-[10px] md:text-xs text-textMuted mt-2 pt-1.5 border-t border-[#F0F0F0] flex justify-between">
                            <span>⭐ 4.9 | Terjual 30+</span>
                            <span>Kota Jkt</span>
                        </div>
                    </div>
                </a>

                
                <a href="/detail-produk" className="product-card flex-1 bg-white rounded overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-lg border border-transparent hover:border-secondary shadow-sm flex flex-col justify-between group">
                    <div className="w-full pt-[100%] bg-[#FAFAFA] relative overflow-hidden">
                        <img className="absolute inset-0 w-full h-full object-cover" src="https://brdsg.com/img/600/bw5d48ohbw5elgecxb_3/LdXyUmiudNzvhQcLdXNysAaxX2TnQ1TTuondpTDGJ38w.webp" alt="Pendant Lamp" />
                    </div>
                    <div className="p-3">
                        <h3 className="text-xs md:text-sm font-bold mb-2 text-textDark line-clamp-2 h-9 group-hover:text-primary transition-colors">Meja Sudut Meja Kerja Meja Komputer Meja Belajar - Stuva Desk - Sonroma Oak White Glosssy</h3>
                        <div className="text-gray-500 line-through">Rp 3.058.000</div>
                        <div className="flex items-center justify-between mt-1.5">
                            <span className="text-secondary text-sm md:text-base font-bold">Rp 1.421.000</span>
                            <span className="bg-[#FFECE8] text-secondary text-[10px] md:text-xs px-1.5 py-0.5 rounded font-medium">Aksen</span>
                        </div>
                        <div className="text-[10px] md:text-xs text-textMuted mt-2 pt-1.5 border-t border-[#F0F0F0] flex justify-between">
                            <span>⭐ 4.8 | Terjual 100+</span>
                            <span>Kota Jkt</span>
                        </div>
                    </div>
                </a>

                
                <a href="/detail-produk" className="product-card flex-1 bg-white rounded overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-lg border border-transparent hover:border-secondary shadow-sm flex flex-col justify-between group">
                    <div className="w-full pt-[100%] bg-[#FAFAFA] relative overflow-hidden">
                        <img className="absolute inset-0 w-full h-full object-cover" src="https://brdsg.com/img/600/bw5d48ohbw5elgecxb_3/Ldjp9MqfzHkNXmLdXtOCTqjUqzfrKQpAxtrrX5FQFQ.webp" alt="Grey Rug" />
                    </div>
                    <div className="p-3">
                        <h3 className="text-xs md:text-sm font-bold mb-2 text-textDark line-clamp-2 h-9 group-hover:text-primary transition-colors">Meja Kerja Meja Belajar LIBRE 122 RIVIERA - WHITE</h3>
                        <div className="text-gray-500 line-through">Rp 1.714.000</div>
                        <div className="flex items-center justify-between mt-1.5">
                            <span className="text-secondary text-sm md:text-base font-bold">Rp 1.137.000</span>
                            <span className="bg-[#FFECE8] text-secondary text-[10px] md:text-xs px-1.5 py-0.5 rounded font-medium">Baru</span>
                        </div>
                        <div className="text-[10px] md:text-xs text-textMuted mt-2 pt-1.5 border-t border-[#F0F0F0] flex justify-between">
                            <span>⭐ 5.0 | Terjual 15+</span>
                            <span>Kota Jkt</span>
                        </div>
                    </div>
                </a>

                
                <a href="/detail-produk" className="product-card flex-1 bg-white rounded overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-lg border border-transparent hover:border-secondary shadow-sm flex flex-col justify-between group">
                    <div className="w-full pt-[100%] bg-[#FAFAFA] relative overflow-hidden">
                        <img className="absolute inset-0 w-full h-full object-cover" src="https://cf.shopee.co.id/file/sg-11134201-7rbm3-lo6cri7mkt5x77" alt="Studio Shelf" />
                    </div>
                    <div className="p-3">
                        <h3 className="text-xs md:text-sm font-bold mb-2 text-textDark line-clamp-2 h-9 group-hover:text-primary transition-colors">Laci Nakas Minimalis 40171 CETR 47 WHITE-GREY</h3>
                        <div className="text-gray-500 line-through">Rp 988.000</div>
                        <div className="flex items-center justify-between mt-1.5">
                            <span className="text-secondary text-sm md:text-base font-bold">Rp 540.000</span>
                            <span className="bg-[#FFECE8] text-secondary text-[10px] md:text-xs px-1.5 py-0.5 rounded font-medium">Premium</span>
                        </div>
                        <div className="text-[10px] md:text-xs text-textMuted mt-2 pt-1.5 border-t border-[#F0F0F0] flex justify-between">
                            <span>⭐ 4.9 | Terjual 40+</span>
                            <span>Kota Jkt</span>
                        </div>
                    </div>
                </a>

        </div></section>
    </DetailMain></main>

    <Footer/>

    <div id="imageLightbox" className="fixed inset-0 z-50 hidden bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity duration-300 opacity-0">
        <button id="closeLightbox" className="absolute top-4 right-4 text-white hover:text-secondary transition-colors bg-black/40 hover:bg-black/60 p-2 rounded-full flex items-center justify-center z-50 focus:outline-none" aria-label="Tutup Mode Fokus">
            <span className="material-symbols-outlined !text-3xl md:!text-4xl">close</span>
        </button>
        <div className="max-w-4xl max-h-[85vh] w-full h-full flex items-center justify-center select-none">
            <img id="lightboxImage" src={undefined} alt="Mode Fokus Produk" className="max-w-full max-h-full object-contain rounded-lg shadow-2xl transform scale-95 transition-transform duration-300" />
        </div>
    </div>

    <div id="videoLightbox" className={"fixed inset-0 z-50 hidden bg-black/90\n        flex items-center justify-center\n        opacity-0 transition-opacity duration-300"}>

        <button id="closeVideoLightbox" className="absolute top-5 right-5 text-white z-50">

            <span className="material-symbols-outlined !text-4xl">
                close
            </span>

        </button>

        <video id="lightboxVideo" className="max-w-[90vw] max-h-[90vh] rounded-lg" controls={true} playsInline={true}>
            <source src="https://down-ws-id.vod.susercontent.com/api/v4/11110105/mms/id-11110105-6jt76-liv5i1rx3cv253.16003251711950497.mp4" type="video/mp4" />
        </video>

    </div>

    
    <ChatWidget />
      </>
    </LegacyPage>
  );
}

void runInline;
