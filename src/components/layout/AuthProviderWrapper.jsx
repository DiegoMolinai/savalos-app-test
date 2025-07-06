'use client'

import { usePathname } from 'next/navigation';
import Header from '@/layout/Header';
import Footer from '@/layout/Footer';
import { AuthProvider, useAuth } from '@/context/AuthContext';

function ContentWrapper({ children }) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/register';
  const { loading } = useAuth();

  if (loading) {
    return null; // O puedes mostrar un loader centralizado
  }

  return (
    <>
      {!isAuthPage && <Header />}
      <main style={{ flex: 1, padding: "2rem" }}>{children}</main>
      {!isAuthPage && <Footer />}
    </>
  );
}

export function AuthProviderWrapper({ children }) {
  return (
    <AuthProvider>
      <ContentWrapper>{children}</ContentWrapper>
    </AuthProvider>
  );
}
