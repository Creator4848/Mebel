import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AiChat from '@/components/AiChat';

export const metadata: Metadata = {
  title: "MebelAkademiya — O'zbekistondagi #1 Mebel Maktabi",
  description: "Professional mebel ishlab chiqarish kurslari. Sertifikat, ustaxona va ish topishda yordam.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz">
      <body>
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <AiChat />
        </AuthProvider>
      </body>
    </html>
  );
}
