'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import GenericModal from '@/components/GenericComponents/GenericModal';
import Step1Introduction from './auth-steps/Step1_Introduction';
import Step2CategorySelect from './auth-steps/Step2_CategorySelect';
import Step3RolesAndSkills from './auth-steps/Step3_RolesAndSkills';
import Step4ProfileSummary from './auth-steps/Step4_ProfileSummary';
import { Brain } from 'lucide-react';
interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [step, setStep] = useState(1);
  const [roleSearch, setRoleSearch] = useState('');
  const [skillSearch, setSkillSearch] = useState('');
  const [isSignUp, setIsSignUp] = useState(true);
  const router = useRouter();
  // Auth context
  const { login, loginWithGoogle, loginWithFacebook } = useAuth();

  // ── Form states ───────────────────────────────────────
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // ── Onboarding states ─────────────────────────────────
  const [selectedCategory, setSelectedCategory] = useState<
    'it' | 'finance' | null
  >(null);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const handleNext = () => setStep((s) => Math.min(s + 1, 4));
  const handleBack = () => setStep((s) => Math.max(s - 1, 1));

  const resetOnboarding = () => {
    setSelectedCategory(null);
    setSelectedRoles([]);
    setSelectedSkills([]);
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    setIsLoading(true);
    try {
      // Get user info from social provider
      const providerName = `${provider.charAt(0).toUpperCase()}${provider.slice(1)}`;
      const email = `user@${provider}.com`;
      const name = `${providerName} User`;

      // Set the email and name for the onboarding process
      setEmail(email);
      setName(name);
      setIsSignUp(true);

      // Update in-memory auth state
      if (provider === 'google') await loginWithGoogle();
      else await loginWithFacebook();

      // Skip to step 2 (Category Select) - user goes through onboarding
      await new Promise((resolve) => setTimeout(resolve, 500));
      setStep(2);
    } catch (err) {
      setError('Social login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async () => {
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      // For sign up: proceed to onboarding without authenticating yet
      if (isSignUp) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        handleNext();
        return;
      }

      // For sign in: authenticate and go to dashboard
      const userProfile = {
        email,
        name: name || email.split('@')[0],
        category: 'it' as const,
        roles: ['Professional'],
        skills: ['General'],
        loginTime: new Date().toISOString(),
      };

      localStorage.setItem('profectia_user', JSON.stringify(userProfile));
      localStorage.setItem('profectia_auth_token', 'email-token-' + Date.now());

      // Update in-memory auth state
      await login(email, password);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      onClose();
      router.push('/dashboard/connectors');
    } catch (err) {
      setError('Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const commonProps = {
    step,
    setStep,
    isSignUp,
    setIsSignUp,
    email,
    setEmail,
    password,
    setPassword,
    name,
    setName,
    error,
    setError,
    isLoading,
    setIsLoading,
    selectedCategory,
    setSelectedCategory,
    selectedRoles,
    setSelectedRoles,
    selectedSkills,
    setSelectedSkills,
    handleNext,
    handleBack,
    onClose,
    handleSocialLogin,
    handleEmailAuth,
    router,
    resetOnboarding,
  };

  const handleFinalize = async () => {
    setError('');
    setIsLoading(true);
    try {
      // Save user profile to localStorage
      const userProfile = {
        email,
        name: name || email.split('@')[0],
        category: selectedCategory,
        roles: selectedRoles,
        skills: selectedSkills,
        loginTime: new Date().toISOString(),
      };

      localStorage.setItem('profectia_user', JSON.stringify(userProfile));
      localStorage.setItem('profectia_auth_token', 'dummy-token-' + Date.now());

      // Mark user as authenticated in memory
      await login(email, password);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      onClose();
      router.push('/dashboard/connectors');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <Step1Introduction {...commonProps} />;
      case 2:
        return <Step2CategorySelect {...commonProps} />;
      case 3:
        return (
          <Step3RolesAndSkills
            {...commonProps}
            roleSearch={roleSearch}
            setRoleSearch={setRoleSearch}
            skillSearch={skillSearch}
            setSkillSearch={setSkillSearch}
          />
        );
      case 4:
        return (
          <Step4ProfileSummary
            {...commonProps}
            handleFinalize={handleFinalize}
          />
        );
      default:
        return null;
    }
  };

  return (
    <GenericModal
      isOpen={isOpen}
      onClose={onClose}
      stepInfo={{ current: step, total: 4 }}
      maxWidth='max-w-2xl'
      stepInfoClassName='mt-3'
      title={
        <div className='flex items-center gap-3 text-white'>
          <Brain className='w-6 h-6' />
          <div>
            <h1 className='text-xl font-bold'>Profectia.ai</h1>
          </div>
        </div>
      }
    >
      {error && (
        <div className='p-4'>
          <p className='text-sm text-red-400'>{error}</p>
        </div>
      )}
      {renderStep()}
    </GenericModal>
  );
}
