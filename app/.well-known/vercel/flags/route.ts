import { toolbarFlags } from '@/lib/flags';
import { createFlagsDiscoveryEndpoint, getProviderData } from 'flags/next';

export const GET = createFlagsDiscoveryEndpoint(async () => {
  return getProviderData(toolbarFlags);
});
