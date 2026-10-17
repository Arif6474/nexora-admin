import {
  IconHome,
  IconPackage,
  IconSettings,
  IconShoppingCart,
  IconUsers,
  IconChartBar,
  IconCategory,
  IconPalette,
  IconRuler2,
  IconTags
} from '@tabler/icons-react';

export const sidelinks = [
  {
    title: 'Dashboard',
    label: '',
    href: '/',
    icon: <IconHome size={19} />,
  },
  {
    title: 'Products',
    label: '',
    href: '/products',
    icon: <IconPackage size={19} />,
  },
  {
    title: 'Product Settings',
    label: '',
    href: '',
    icon: <IconSettings size={19} />,
    sub: [
      {
        title: 'Categories',
        label: '',
        href: '/categories',
        icon: <IconCategory size={18} />,
      },
      {
        title: 'Brands',
        label: '',
        href: '/brands',
        icon: <IconTags size={18} />,
      },
      {
        title: 'Colors',
        label: '',
        href: '/colors',
        icon: <IconPalette size={18} />,
      },
      {
        title: 'Sizes',
        label: '',
        href: '/sizes',
        icon: <IconRuler2 size={18} />,
      },
    ],
  },
  {
    title: 'Orders',
    label: '',
    href: '/orders',
    icon: <IconShoppingCart size={19} />,
  },
  {
    title: 'Customers',
    label: '',
    href: '/customers',
    icon: <IconUsers size={19} />,
  },
  {
    title: 'Reports',
    label: '',
    href: '/reports',
    icon: <IconChartBar size={19} />,
  },
];

