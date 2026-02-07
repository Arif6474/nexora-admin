export const BASE_URL = import.meta.env.VITE_REACT_APP_BACKEND_URL;

export const PUBLIC_INSTANCE_ROUTE = BASE_URL + 'api/employeeApp/public/';
export const PROTECTED_INSTANCE_ROUTE = BASE_URL + 'api/employeeApp/protected/';

export const CATEGORY_API = PROTECTED_INSTANCE_ROUTE + 'category';
export const SUBCATEGORY_API = PROTECTED_INSTANCE_ROUTE + 'subcategory';
export const PRODUCT_API = PROTECTED_INSTANCE_ROUTE + 'product';
export const PRODUCT_COLOR_API = PROTECTED_INSTANCE_ROUTE + 'productColor';
export const PRODUCT_SIZE_API = PROTECTED_INSTANCE_ROUTE + 'productSize';
export const PRODUCT_IMAGE_API = PROTECTED_INSTANCE_ROUTE + 'productImage';
export const COLOR_API = PROTECTED_INSTANCE_ROUTE + 'color';
export const SIZE_API = PROTECTED_INSTANCE_ROUTE + 'size';

//orders
export const ORDERS_API = PROTECTED_INSTANCE_ROUTE + 'order';

// Promo Code
export const PROMO_CODE_API = PROTECTED_INSTANCE_ROUTE + 'promoCode';




