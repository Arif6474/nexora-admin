import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import { authApi } from './features/auth/authApi';
import { categoryApi } from './features/categories/categoryApi';
import categoryReducer from './features/categories/categorySlice';
import { productApi } from './features/products/productApi';
import productReducer from './features/products/productSlice';
import { productColorApi } from './features/productColors/productColorApi';
import productColorReducer from './features/productColors/productColorSlice';
import { productSizeApi } from './features/productSizes/productSizeApi';
import productSizeReducer from './features/productSizes/productSizeSlice';
import { orderApi } from './features/orders/orderApi';
import orderReducer from './features/orders/orderSlice';
import { subcategoryApi } from './features/subcategories/subcategoryApi';
import { colorApi } from './features/colors/colorApi';
import { sizeApi } from './features/sizes/sizeApi';
import { productImageApi } from './features/productImages/productImageApi';

const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    category: categoryReducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    product: productReducer,
    [productApi.reducerPath]: productApi.reducer,
    productColor: productColorReducer,
    [productColorApi.reducerPath]: productColorApi.reducer,
    productSize: productSizeReducer,
    [productSizeApi.reducerPath]: productSizeApi.reducer,
    order: orderReducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [subcategoryApi.reducerPath]: subcategoryApi.reducer,
    [colorApi.reducerPath]: colorApi.reducer,
    [sizeApi.reducerPath]: sizeApi.reducer,
    [productImageApi.reducerPath]: productImageApi.reducer,

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      categoryApi.middleware,
      productApi.middleware,
      productColorApi.middleware,
      productSizeApi.middleware,
      orderApi.middleware,
      subcategoryApi.middleware,
      colorApi.middleware,
      sizeApi.middleware,
      productImageApi.middleware,

    ),
});

export default store;
