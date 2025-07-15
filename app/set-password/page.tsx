import { handleAuthRedirect } from '@/utils/bootstrap-check';
import SetPasswordClient from './set-password-client';

export default async function SetPasswordPage() {
  // Handle bootstrap and auth checks
  await handleAuthRedirect();

  return <SetPasswordClient />;
}