import { handleLoginRedirect } from '@/utils/bootstrap-check';
import LoginClient from './login-client';

export default async function LoginPage() {
  // Handle all bootstrap and auth redirect logic
  await handleLoginRedirect();

  return <LoginClient />;
}