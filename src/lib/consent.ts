export const CONSENT_STORAGE_KEY = "hno-alici-cookie-consent-v1";

export type ConsentState = {
  essential: true;
  externalMedia: boolean;
  updatedAt: string;
};

export const defaultConsent: ConsentState = {
  essential: true,
  externalMedia: false,
  updatedAt: "",
};

export function parseConsent(raw: string | null): ConsentState | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as ConsentState;
    if (typeof parsed.externalMedia !== "boolean") return null;
    return { essential: true, externalMedia: parsed.externalMedia, updatedAt: parsed.updatedAt ?? "" };
  } catch {
    return null;
  }
}

export function saveConsent(externalMedia: boolean): ConsentState {
  const state: ConsentState = {
    essential: true,
    externalMedia,
    updatedAt: new Date().toISOString(),
  };
  if (typeof window !== "undefined") {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(state));
  }
  return state;
}
