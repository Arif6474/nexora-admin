import { createBrowserRouter } from 'react-router-dom'
import ProtectedRoute from './components/protectedRoute'

const router = createBrowserRouter([
  // Auth routes
  {
    path: '/sign-in',
    lazy: async () => ({
      Component: (await import('./pages/auth/signIn')).default,
    }),
  },
  {
    path: '/sign-up',
    lazy: async () => ({
      Component: (await import('./pages/auth/signUp')).default,
    }),
  },
  {
    path: '/forgot-password',
    lazy: async () => ({
      Component: (await import('./pages/auth/forgotPassword')).default,
    }),
  },
  {
    path: '/recover-password',
    lazy: async () => ({
      Component: (await import('./pages/auth/recoverPassword')).default,
    }),
  },

  // Main routes
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        index: true,
        lazy: async () => ({
          Component: (await import('./pages/dashboard')).default,
        }),
      },
      {
        path: 'products',
        lazy: async () => ({
          Component: (await import('@/pages/products')).default,
        }),
      },
      {
        path: 'product-colors/:productId',
        lazy: async () => ({
          Component: (await import('@/pages/productColors')).default,
        }),
      },
      {
        path: 'product-sizes/:productId',
        lazy: async () => ({
          Component: (await import('@/pages/productSizes')).default,
        }),
      },
      {
        path: 'categories',
        lazy: async () => ({
          Component: (await import('@/pages/categories')).default,
        }),
      },
      {
        path: 'colors',
        lazy: async () => ({
          Component: (await import('@/pages/colors')).default,
        }),
      },
      {
        path: 'sizes',
        lazy: async () => ({
          Component: (await import('@/pages/sizes')).default,
        }),
      },
      {
        path: 'subcategories/:id',
        lazy: async () => ({
          Component: (await import('@/pages/subcategories')).default,
        }),
      },
      {
        path: 'orders',
        lazy: async () => ({
          Component: (await import('@/pages/orders')).default,
        }),
      },
      {
        path: 'ordersByStatus/:orderStatus',
        lazy: async () => ({
          Component: (await import('@/pages/ordersByStatus')).default,
        }),
      },
    ],
  },
])

export default router
