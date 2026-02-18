import { flag } from 'flags/next';

// Flag definitions with explicit options for toolbar
export const showNewLayout = flag<boolean>({
  key: 'showNewLayout',
  description: 'Show new product layout design (4-column vs 3-column grid)',
  options: [
    { value: true, label: 'Enabled' },
    { value: false, label: 'Disabled' },
  ],
  defaultValue: false,
  decide: () => false,
});

export const enablePromoBanner = flag<boolean>({
  key: 'enablePromoBanner',
  description: 'Display promotional banner on homepage',
  options: [
    { value: true, label: 'Enabled' },
    { value: false, label: 'Disabled' },
  ],
  defaultValue: true,
  decide: () => true,
});

export const toolbarFlags = {
  showNewLayout,
  enablePromoBanner,
} as const;

export const precomputeFlags = [showNewLayout, enablePromoBanner] as const;

