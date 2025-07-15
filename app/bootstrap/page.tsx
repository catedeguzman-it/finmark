import { handleBootstrapProtection } from '@/utils/bootstrap-check';
import BootstrapClient from './bootstrap-client';

export default async function BootstrapPage() {
  // Handle bootstrap protection - redirect to login if already bootstrapped
  await handleBootstrapProtection();

  return <BootstrapClient />;
}