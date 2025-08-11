'use client';

import { CookiesNextProvider } from 'cookies-next';

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return <CookiesNextProvider>{children}</CookiesNextProvider>;
}