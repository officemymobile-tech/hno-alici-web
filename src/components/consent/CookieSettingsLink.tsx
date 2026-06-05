"use client";

import { CONSENT_STORAGE_KEY } from "@/lib/consent";

type Props = {
  label: string;
  className?: string;
};

export function CookieSettingsLink({ label, className }: Props) {
  const reopen = () => {
    localStorage.removeItem(CONSENT_STORAGE_KEY);
    window.location.reload();
  };

  return (
    <button type="button" onClick={reopen} className={className}>
      {label}
    </button>
  );
}
