"use client";
import { useRouter, usePathname } from 'next/navigation';
import React from 'react';

const LANGS = [
  { code: 'ja', label: '日本語' },
  { code: 'en', label: 'English' },
];

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLang = pathname.split('/')[1];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value;
    const rest = pathname.split('/').slice(2).join('/');
    router.push(`/${lang}${rest ? '/' + rest : ''}`);
  };

  return (
    <select
      value={currentLang}
      onChange={handleChange}
      style={{ position: 'absolute', top: 16, right: 24, zIndex: 100 }}
      aria-label="Select language"
    >
      {LANGS.map((l) => (
        <option key={l.code} value={l.code}>{l.label}</option>
      ))}
    </select>
  );
}
