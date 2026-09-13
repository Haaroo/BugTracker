import Link from "next/link";
import { APP_NAME, APP_VERSION } from "@/config/env";

function BugMark() {
  return (
    <div className="relative group flex items-center justify-center">
      {/* Glow / Resplandor sutil al hacer hover */}
      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 opacity-20 blur transition duration-300 group-hover:opacity-40" />
      
      {/* Logotipo contenedor */}
      <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-md shadow-slate-900/10 transition-transform duration-200 group-hover:scale-[1.03]">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          className="text-white/90 group-hover:text-white transition-colors"
        >
          <path
            d="M9 7V5.5a3 3 0 0 1 6 0V7M6 10h12M6 14h12M8 20l-2-2m10 2 2-2M4 10 2 8m20 2-2-2M12 8a5 5 0 0 1 5 5v3a5 5 0 0 1-10 0v-3a5 5 0 0 1 5-5Z"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </div>
  );
}

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-md transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        
        {/* Marca / Logo */}
        <Link href="/" className="group flex items-center gap-3.5">
          <BugMark />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-slate-900 group-hover:text-brand-600 transition-colors">
                {APP_NAME}
              </span>
              
              {/* Badge de Versión Elegante con indicador de estado */}
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-slate-50 px-2.5 py-0.5 text-[11px] font-medium text-slate-600">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                v{APP_VERSION}
              </span>
            </div>
            
            <p className="text-[12px] font-normal leading-tight text-slate-400">
              Bug tracking, minus the ceremony
            </p>
          </div>
        </Link>
      </div>
    </header>
  );
}