export function CertificationSection() {
  return (
    <section className="bg-white border-b border-borderColor py-3.5 md:py-4 mb-5">
      <div className="max-w-[1200px] mx-auto px-4 grid grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-2 sm:gap-4 items-center">
        <div className="flex items-center gap-2 sm:gap-3 justify-start lg:justify-center">
          <img 
            src="/assets/img/download (2).png" 
            alt="ISO 9001 Certified" 
            className="h-7 sm:h-8 md:h-9 w-auto object-contain shrink-0" 
          />
          <div className="flex flex-col">
            <span className="text-[11px] sm:text-xs md:text-sm font-semibold text-textDark leading-tight">
              ISO 9001 Certified
            </span>
            <span className="text-[10px] sm:text-[11px] md:text-xs text-textMuted leading-tight mt-0.5">
              Cert No. ID02/16479
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 justify-start lg:justify-center">
          <img 
            src="/assets/img/SVLK-LOGO-INDONESIA 2.png" 
            alt="Material Ramah Lingkungan" 
            className="h-7 sm:h-8 md:h-9 w-auto object-contain shrink-0" 
          />
          <div className="flex flex-col">
            <span className="text-[11px] sm:text-xs md:text-sm font-semibold text-textDark leading-tight">
              Material Ramah Lingkungan
            </span>
            <span className="text-[10px] sm:text-[11px] md:text-xs text-textMuted leading-tight mt-0.5">
              SVLK No. VLK00147
            </span>
          </div>
        </div>

        <div className="col-span-2 justify-self-center lg:col-span-1 lg:justify-self-auto flex items-center gap-2 sm:gap-3 justify-start lg:justify-center">
          <img 
            src="/assets/img/TKDN.png" 
            alt="Bangga Buatan Indonesia" 
            className="h-7 sm:h-8 md:h-9 w-auto object-contain shrink-0" 
          />
          <div className="flex flex-col">
            <span className="text-[11px] sm:text-xs md:text-sm font-semibold text-textDark leading-tight">
              Bangga Buatan Indonesia
            </span>
            <span className="text-[10px] sm:text-[11px] md:text-xs text-textMuted leading-tight mt-0.5">
              Produk Asli Dalam Negeri
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}