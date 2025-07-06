"use client";
import { useState } from "react";

export default function Footer() {
  const [aboutOpen, setAboutOpen] = useState(false);
  return (
    <>
      <footer className="w-full mt-8 py-6 bg-[#f4f1eb] border-t border-[#e8e8e8] text-center text-[#2c3e50] text-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-4">
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 w-full md:w-auto justify-between">
            <div>
              © {new Date().getFullYear()} Todos os direitos reservados.
            </div>
            <div className="flex items-center gap-4">
              <a href="https://github.com/Maycon-jeferson" target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.78 2.73 1.27 3.4.97.11-.75.41-1.27.74-1.56-2.56-.29-5.26-1.28-5.26-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 2.9-.39c.98 0 1.97.13 2.9.39 2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.41-5.27 5.7.42.36.79 1.09.79 2.2 0 1.59-.01 2.87-.01 3.26 0 .31.21.68.8.56C20.71 21.39 24 17.08 24 12c0-6.27-5.23-11.5-12-11.5z"/></svg>
                GitHub
              </a>
              <a href="https://www.linkedin.com/in/maycon-jeferson-da-silva-63320215b/" target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm13.5 11.28h-3v-5.6c0-1.34-.03-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97v5.7h-3v-10h2.88v1.36h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v5.59z"/></svg>
                LinkedIn
              </a>
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 w-full md:w-auto justify-between">
            <div className="flex items-center gap-3 justify-center">
              {/* Ícones de formas de pagamento */}
              <span title="Visa"><svg className="w-8 h-6" viewBox="0 0 48 32"><rect width="48" height="32" rx="4" fill="#fff"/><text x="24" y="22" textAnchor="middle" fontSize="16" fill="#1a1f71" fontFamily="Arial, sans-serif">VISA</text></svg></span>
              <span title="MasterCard"><svg className="w-8 h-6" viewBox="0 0 48 32"><rect width="48" height="32" rx="4" fill="#fff"/><circle cx="18" cy="16" r="8" fill="#eb001b"/><circle cx="30" cy="16" r="8" fill="#f79e1b" fillOpacity=".8"/></svg></span>
              <span title="Pix"><svg className="w-8 h-6" viewBox="0 0 48 32"><rect width="48" height="32" rx="4" fill="#fff"/><rect x="14" y="8" width="20" height="16" rx="4" fill="#00e676"/><text x="24" y="22" textAnchor="middle" fontSize="12" fill="#fff" fontFamily="Arial, sans-serif">PIX</text></svg></span>
              <span title="Boleto"><svg className="w-8 h-6" viewBox="0 0 48 32"><rect width="48" height="32" rx="4" fill="#fff"/><rect x="10" y="8" width="28" height="16" rx="2" fill="#000"/><text x="24" y="22" textAnchor="middle" fontSize="12" fill="#fff" fontFamily="Arial, sans-serif">BOLETO</text></svg></span>
              <span title="Elo"><svg className="w-8 h-6" viewBox="0 0 48 32"><rect width="48" height="32" rx="4" fill="#fff"/><circle cx="24" cy="16" r="8" fill="#ffcb05"/><text x="24" y="22" textAnchor="middle" fontSize="12" fill="#000" fontFamily="Arial, sans-serif">ELO</text></svg></span>
            </div>
            <button onClick={() => setAboutOpen(true)} className="px-4 py-2 bg-gradient-to-r from-[#8b4513] to-[#d2691e] text-white rounded-full shadow-natura font-semibold hover:from-[#a0522d] hover:to-[#8b4513] transition-all duration-300 ml-0 md:ml-4">Sobre</button>
          </div>
        </div>
      </footer>
      {/* Modal Sobre */}
      {aboutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-2xl shadow-2xl border border-[#e8e8e8] w-[90vw] max-w-md p-8 relative animate-fadeIn">
            <button onClick={() => setAboutOpen(false)} className="absolute top-2 right-2 text-[#8b4513] hover:text-[#d2691e] text-xl font-bold">×</button>
            <h2 className="text-2xl font-bold mb-2 text-[#2c3e50]">Sobre o Sistema</h2>
            <p className="mb-4 text-[#7f8c8d]">Este sistema foi desenvolvido para facilitar a gestão de produtos, com foco em simplicidade, responsividade e integração com Supabase.</p>
            <h3 className="text-lg font-semibold mb-1 text-[#2c3e50]">Desenvolvedor</h3>
            <p className="mb-2 text-[#7f8c8d]">Maycon Jeferson</p>
            <div className="flex gap-4 justify-center">
              <a href="https://github.com/Maycon-jeferson" target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.78 2.73 1.27 3.4.97.11-.75.41-1.27.74-1.56-2.56-.29-5.26-1.28-5.26-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 2.9-.39c.98 0 1.97.13 2.9.39 2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.41-5.27 5.7.42.36.79 1.09.79 2.2 0 1.59-.01 2.87-.01 3.26 0 .31.21.68.8.56C20.71 21.39 24 17.08 24 12c0-6.27-5.23-11.5-12-11.5z"/></svg>
                GitHub
              </a>
              <a href="https://www.linkedin.com/in/maycon-jeferson-da-silva-63320215b/" target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm13.5 11.28h-3v-5.6c0-1.34-.03-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97v5.7h-3v-10h2.88v1.36h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v5.59z"/></svg>
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 