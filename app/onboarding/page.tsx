import { redirect } from 'next/navigation';
import { hasAnyUsers } from '../../db/queries/users';
import OnboardingClient from './onboarding-client';

export default async function OnboardingPage() {
  // Check if system needs bootstrap first
  try {
    const systemHasUsers = await hasAnyUsers();
    if (!systemHasUsers) {
      redirect('/bootstrap');
    }
  } catch (error) {
    console.error('Failed to check system state:', error);
    // If database tables don't exist, redirect to bootstrap
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.includes('users_table') || errorMessage.includes('relation') || errorMessage.includes('does not exist')) {
      redirect('/bootstrap');
    }
  }

  return <OnboardingClient />;
}