import { Router } from 'express';
import { UserRoutes } from '../modules/user/user.route';
import { AuthRoutes } from '../modules/auth/auth.route';
import { ProductCategoryRoutes } from '../modules/productCategory/productCategory.route';
import { ProductInventoryRoutes } from '../modules/productInventory/productInventory.route';
import { ProductRoutes } from '../modules/product/product.route';
import { ShippingAddressRoutes } from '../modules/shippingAddress/shippingAddress.route';
import { OrderRoutes } from '../modules/order/order.route';
import { PaymentRoutes } from '../modules/payment/payment.route';
import { BlogRoutes } from '../modules/blog/blog.route';
import { ProductDiscountRoutes } from '../modules/productDiscount/productDiscount.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/categories',
    route: ProductCategoryRoutes,
  },
  {
    path: '/inventory',
    route: ProductInventoryRoutes,
  },
  {
    path: '/product',
    route: ProductRoutes,
  },
  {
    path: '/shipping-addresses',
    route: ShippingAddressRoutes,
  },
  {
    path: '/orders',
    route: OrderRoutes,
  },
  {
    path: '/payments',
    route: PaymentRoutes,
  },
  {
    path: '/blogs',
    route: BlogRoutes,
  },
  {
    path: '/product-discounts',
    route: ProductDiscountRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
