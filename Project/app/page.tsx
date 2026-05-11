'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import AuthModal from '@/components/auth/AuthModal';
import {
  HeaderNav,
  AnimatedGridBackground,
  HeroSection,
  ProblemSection,
  SolutionSection,
  FeaturesSection,
  FeatureDomainsSection,
  UseCasesSection,
  FinalCTASection,
} from '@/components/LandingPageComponents';

const sections = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'Problem' },
  { id: 'solution', label: 'Solution' },
  { id: 'domains', label: 'Domains' },
  { id: 'services', label: 'Features' },
] as const;

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('home');
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // if (isAuthenticated) {
    //   router.push("/dashboard/executive-summary");
    // }
    // mark landing page to exclude global body styles
    document.body.setAttribute('data-landing', 'true');
    return () => {
      document.body.removeAttribute('data-landing');
    };
  }, [isAuthenticated, router]);

  useEffect(() => {
    const ids = sections.map((s) => s.id);
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) {
          setActiveSection(visible.target.id);
        }
      },
      { threshold: 0.6 },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className='min-h-screen bg-black text-white overflow-hidden scroll-smooth'>
      <HeaderNav
        sections={sections as unknown as { id: string; label: string }[]}
        activeSection={activeSection}
        onSignUp={() => setIsModalOpen(true)}
      />

      <AnimatedGridBackground />

      <div className='relative z-10'>
        <HeroSection onPrimaryAction={() => setIsModalOpen(true)} />
        <ProblemSection />
        <SolutionSection />
        <FeatureDomainsSection />
        <FeaturesSection />
        <UseCasesSection />
        <FinalCTASection onPrimaryAction={() => setIsModalOpen(true)} />
      </div>

      <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Home;
