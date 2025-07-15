import { handleAuthRedirect } from '@/utils/bootstrap-check';
import OnboardingClient from './onboarding-client';

export default async function OnboardingPage() {
  // Handle bootstrap and auth checks
  await handleAuthRedirect();

  return <OnboardingClient />;
}