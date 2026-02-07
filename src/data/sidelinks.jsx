import {
  IconBarrierBlock,
  IconError404,
  IconExclamationCircle,
  IconHexagonNumber1,
  IconHexagonNumber2,
  IconHexagonNumber3,
  IconHexagonNumber4,
  IconHexagonNumber5,
  IconLayoutDashboard,
  IconServerOff,
  IconSettings,
  IconUserShield,
  IconUsers,
  IconLock,
  IconShoppingCart,
  IconPalette,
  IconRuler2,
} from '@tabler/icons-react';

export const sidelinks = [
  {
    title: 'Dashboard',
    label: '',
    href: '/',
    icon: <IconLayoutDashboard size={18} />,
  },
  {
    title: 'Products',
    label: '',
    href: '/products',
    icon: <IconLayoutDashboard size={18} />,
  },


  {
    title: 'Product Settings',
    label: '',
    href: '',
    icon: <IconHexagonNumber1 size={18} />,
    sub: [

      {
        title: 'Categories',
        label: '',
        href: '/categories',
        icon: <IconHexagonNumber2 size={18} />,
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
    icon: <IconShoppingCart size={18} />,
  },

];
