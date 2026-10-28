'use client';

import React from 'react';
import { Locale, SiteSettings } from '@/types/portfolio';
import { Phone, MessageCircle } from 'lucide-react';

interface FloatingWhatsAppProps {
  locale: Locale;
  settings: SiteSettings;
}

export function FloatingWhatsApp({ locale, settings }: FloatingWhatsAppProps) {
  const starterMessage = settings.whatsappStarterMessage?.[locale] || (
    locale === 'fr'
      ? "Bonjour Houssam, j'aimerais échanger avec vous au sujet d'un projet de montage vidéo."
      : "Hi Houssam, I'd like to discuss a video editing project."
  );

  const whatsappUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(starterMessage)}`;

  return (
    <aside aria-label="WhatsApp Direct Contact" className="fixed bottom-6 right-6 z-40 group">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={locale === 'en' ? 'Chat on WhatsApp with Houssam' : 'Discuter sur WhatsApp avec Houssam'}
        className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-purple-600 hover:bg-purple-500 text-white shadow-xl shadow-purple-950/40 border border-purple-400/30 hover:scale-105 active:scale-95 transition-all duration-300"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-300 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
        </span>

        {/* WhatsApp Icon */}
        <svg
          className="w-5 h-5 fill-current"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M20.52 3.449A11.927 11.927 0 0012.062 0C5.466 0 .094 5.372.094 11.971c0 2.108.549 4.167 1.594 5.979L0 24l6.237-1.636a11.933 11.933 0 005.825 1.503h.005c6.594 0 11.968-5.372 11.968-11.973 0-3.197-1.246-6.202-3.515-8.445zM12.067 21.83h-.004a9.92 9.92 0 01-5.05-1.385l-.362-.215-3.755.985 1.002-3.66-.236-.375a9.897 9.897 0 01-1.52-5.209c0-5.466 4.45-9.914 9.926-9.914 2.648 0 5.137 1.031 7.009 2.903a9.865 9.865 0 012.903 7.01c0 5.468-4.449 9.915-9.913 9.915zm5.438-7.426c-.298-.15-1.765-.87-2.039-.97-.273-.099-.472-.15-.67.15-.199.299-.77 1.02-.944 1.219-.174.198-.348.223-.646.074-.298-.15-1.26-.465-2.399-1.482-.888-.792-1.487-1.77-1.661-2.068-.174-.298-.019-.459.13-.608.134-.134.298-.348.447-.521.149-.174.198-.298.298-.497.099-.199.05-.373-.025-.522-.075-.149-.67-1.616-.918-2.213-.242-.582-.487-.503-.67-.512l-.571-.01c-.198 0-.522.074-.795.373s-1.043 1.02-1.043 2.487c0 1.467 1.068 2.885 1.217 3.084.15.199 2.102 3.21 5.093 4.502.711.308 1.266.492 1.699.63.714.227 1.364.195 1.878.118.572-.085 1.765-.721 2.013-1.417.248-.696.248-1.293.174-1.418-.074-.124-.273-.198-.571-.347z"/>
        </svg>

        <span className="hidden sm:inline-block font-semibold text-xs tracking-wide">
          {locale === 'en' ? 'WhatsApp' : 'WhatsApp'}
        </span>
      </a>
    </aside>
  );
}
