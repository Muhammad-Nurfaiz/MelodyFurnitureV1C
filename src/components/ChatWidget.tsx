'use client';

import { useState, useRef, useEffect } from "react";

interface Message {
  id: number;
  sender: 'user' | 'admin';
  text: string;
  time: string;
}

const TEMPLATE_QUESTIONS = [
  {
    id: 1,
    question: "📦 Apakah kursi Nordic Oak ready stok?",
    answer: "Tentu saja! Kursi Nordic Oak Chair saat ini berstatus ready siap kirim dari gudang kami. Silakan klik tombol 'Beli Sekarang' untuk langsung memesan sebelum kehabisan kuota diskon bulanan!"
  },
  {
    id: 2,
    question: "🚚 Berapa ongkos kirim ke kota saya?",
    answer: "Untuk wilayah Malang Kota, pengiriman gratis atau bisa ambil langsung di showroom kami. Di luar itu, kami bekerja sama dengan kargo terpercaya untuk memastikan tarif termurah yang akan dihitung otomatis saat pengisian checkout."
  },
  {
    id: 3,
    question: "🛡️ Apakah ada jaminan garansi produk?",
    answer: "Setiap pembelian produk premium di Melody Furniture dilengkapi garansi konstruksi & rangka kayu selama 1 tahun penuh. Kepuasan serta rasa aman Anda adalah prioritas utama kami."
  },
  {
    id: 4,
    question: "🔧 Bagaimana sistem perakitan kursinya?",
    answer: "Sangat mudah! Kursi ini dikirim dengan modul semi-knockdown yang presisi. Di dalam paket sudah tersedia kunci L dan buku panduan lengkap. Anda juga bisa menonton video panduan praktis yang disematkan di halaman produk ini."
  },
  {
    id: 5,
    question: "🎨 Bisa kustomisasi warna kain atau kayu?",
    answer: "Untuk koleksi mass-production seperti ini, warna kayu oak natural dan stainless steel adalah standar paten terbaik kami. Namun jika Anda membutuhkan kuantitas proyek besar (min. 10 pcs), opsi kustomisasi warna khusus dapat dibuka."
  }
];

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatBodyRef = useRef<HTMLDivElement>(null);

  // Auto scroll ke paling bawah setiap ada pesan baru
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const toggleChat = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSelectQuestion = (question: string, answer: string) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // 1. Tambah pesan user
    const userMsgId = Date.now();
    setMessages((prev) => [
      ...prev,
      { id: userMsgId, sender: 'user', text: question, time: timeNow }
    ]);

    // 2. Tampilkan indikator mengetik
    setIsTyping(true);

    // 3. Simulasi respon admin setelah 1 detik
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), sender: 'admin', text: answer, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      {/* Container Jendela Chat */}
      <div
        id="chatWindow"
        className={`w-[330px] sm:w-[360px] h-[480px] bg-slate-50/90 backdrop-blur-md rounded-2xl shadow-2xl border border-border-subtle flex flex-col overflow-hidden mb-4 transition-all duration-300 transform origin-bottom-right ${
          isOpen
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-95 translate-y-4 pointer-events-none hidden"
        }`}
      >
        {/* Header Chat */}
        <div className="bg-primary text-white p-4 flex items-center justify-between shadow-md relative shrink-0">
          <div className="flex items-center space-x-3">
            <div className="relative w-10 h-10 rounded-full bg-white/20 flex items-center justify-center border border-white/20 shrink-0">
              <span className="material-symbols-outlined text-white text-2xl">
                account_circle
              </span>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-primary rounded-full"></span>
            </div>
            <div>
              <div className="flex items-center space-x-1">
                <span className="font-bold text-sm tracking-wide text-white">
                  Admin Melody Furniture
                </span>
                <span
                  className="material-symbols-outlined text-xs text-amber-300"
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
            onClick={toggleChat}
            className="text-white/70 hover:text-white hover:bg-white/10 p-1 rounded-full transition focus:outline-none"
            aria-label="Tutup Obrolan"
          >
            <span className="material-symbols-outlined text-xl block">close</span>
          </button>
        </div>

        {/* Body Chat */}
        <div
          id="chatBody"
          ref={chatBodyRef}
          className="flex-1 p-4 overflow-y-auto space-y-3 flex flex-col text-xs sm:text-sm scrollbar-thin"
        >
          {/* Bubble Pesan Sambutan */}
          <div className="flex flex-col items-start max-w-[85%] space-y-1 shrink-0">
            <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm text-textDark border border-border-subtle leading-relaxed">
              Halo! 👋 Ada yang bisa kami bantu? Silakan pilih salah satu opsi di bawah ini untuk respon kilat dari kami.
            </div>
            <span className="text-[10px] text-textMuted ml-1 font-medium">Baru saja</span>
          </div>

          {/* Area Pesan Dinamis */}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col space-y-1 shrink-0 ${
                msg.sender === 'user'
                  ? 'items-end self-end max-w-[85%]'
                  : 'items-start self-start max-w-[85%]'
              }`}
            >
              <div
                className={`p-3 rounded-2xl leading-relaxed shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-secondary text-white rounded-tr-none'
                    : 'bg-white text-textDark border border-border-subtle rounded-tl-none'
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[10px] text-textMuted px-1 font-medium">
                {msg.time}
              </span>
            </div>
          ))}

          {/* Indicator Typing */}
          {isTyping && (
            <div className="flex flex-col items-start max-w-[85%] space-y-1 shrink-0">
              <div className="bg-white px-4 py-2.5 rounded-2xl rounded-tl-none shadow-sm text-textMuted border border-border-subtle flex items-center space-x-1">
                <span
                  className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></span>
                <span
                  className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></span>
                <span
                  className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></span>
              </div>
            </div>
          )}

          {/* Opsi Template Pertanyaan */}
          <div id="chatTemplates" className="space-y-1.5 pt-2 shrink-0 border-t border-border-subtle/50 mt-2">
            <p className="text-[10px] font-bold text-textMuted uppercase tracking-wider mb-1">
              Pilih Pertanyaan:
            </p>
            {TEMPLATE_QUESTIONS.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelectQuestion(item.question, item.answer)}
                className="w-full text-left bg-white border border-border-subtle hover:border-primary hover:text-primary hover:shadow-md px-3 py-2.5 rounded-xl text-[11px] sm:text-xs font-medium text-textDark shadow-sm transition-all duration-200 active:scale-[0.98] cursor-pointer"
              >
                {item.question}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tombol Pemicu Floating Chat */}
      <button
        id="chatToggleBtn"
        onClick={toggleChat}
        className="w-14 h-14 bg-primary hover:bg-primary/90 text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none cursor-pointer ring-4 ring-primary/20"
        aria-label="Buka Obrolan"
      >
        <span
          id="chatToggleIcon"
          className="material-symbols-outlined text-2xl transition-transform duration-300"
        >
          {isOpen ? "close" : "chat"}
        </span>
      </button>
    </div>
  );
}