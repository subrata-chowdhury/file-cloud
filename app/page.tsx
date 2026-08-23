import Header from '@/components/landing/Header';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import TrustedBy from '@/components/landing/TrustedBy';
import Footer from '@/components/landing/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-white selection:bg-blue-200">
      <Header />
      <main className="isolate">
        <Hero />
        <TrustedBy />
        <Features />
      </main>
      <Footer />
    </div>
  );
}
