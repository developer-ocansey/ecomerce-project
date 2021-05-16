import {
  adminAccess,
  allAccess,
  customerAccess,
  customerAdminAccess,
  merchantAccess,
  merchantAdminAccess,
} from '../middleware/auth';

import { AddressBookController } from '../controllers/AddressBookController';
import { Application } from 'express';
import { AuthController } from '../controllers/Auth/AuthController';
import { CartController } from '../controllers/CartController';
import { CategoryController } from '../controllers/CategoryController';
import { ConfigController } from '../controllers/ConfigController';
import { CustomerController } from '../controllers/CustomerController';
import { DisputeController } from '../controllers/DisputeController';
import { FAQController } from '../controllers/FAQController';
import { MerchantController } from '../controllers/MerchantController';
import { MessagesController } from '../controllers/MessagesController';
import { OrderController } from '../controllers/OrderController';
import { PasswordController } from '../controllers/Auth/PasswordController';
import { ProductController } from '../controllers/ProductController';
import { ProductImageController } from '../controllers/ProductImageController';
import { PublicController } from '../controllers/PublicController';
import { SocialAuthController } from '../controllers/Auth/SocialAuthController';
import { SubCategoryController } from '../controllers/SubCategoryController';
import { WishController } from '../controllers/WishlistController';
import upload from '../config/multer.config';

export class Routes {
  // Controllers
  public authController: AuthController = new AuthController();
  public passwordController: PasswordController = new PasswordController();
  public socialAuthController: SocialAuthController = new SocialAuthController();
  public publicController: PublicController = new PublicController();
  public customerController: CustomerController = new CustomerController();
  public categoryController: CategoryController = new CategoryController();
  public subCategoryController: SubCategoryController = new SubCategoryController();
  public productController: ProductController = new ProductController();
  public merchantController: MerchantController = new MerchantController();
  public orderController: OrderController = new OrderController();
  public cartController: CartController = new CartController();
  public wishController: WishController = new WishController();
  public disputeController: DisputeController = new DisputeController();
  public productImageController: ProductImageController = new ProductImageController();
  public addressBookController: AddressBookController = new AddressBookController();
  public faqController: FAQController = new FAQController();
  public messagesController: MessagesController = new MessagesController();
  public configController: ConfigController = new ConfigController();

  public baseUrl: string = process.env.BASE_URL || '/api/v1/';

  public routes(app: Application): void {
    // Public Routes
    app.get(this.baseUrl + 'healthz', this.publicController.healthz);
    app.post(this.baseUrl + 'upload-to-aws', upload.single('file'), this.publicController.upload);
    app.post(this.baseUrl + 'upload-to-aws-multiple', upload.array('file'), this.publicController.uploadMultiple);

    // Overview
    app.get(this.baseUrl + 'overview', adminAccess, this.publicController.overview);
    app.get(this.baseUrl + 'logistics/:partner/:weight/:destination', allAccess, this.publicController.getPrices);

    // Authentication.....
    app.post(this.baseUrl + ':user/register', this.authController.register);
    app.post(this.baseUrl + ':user/login', this.authController.login);
    app.post(this.baseUrl + ':user/resend', this.authController.resendToken);
    app.get(this.baseUrl + ':user/verify/:token', this.authController.verify);
    app.post(this.baseUrl + ':user/recover', this.passwordController.recover);
    app.get(this.baseUrl + ':user/reset/:token', this.passwordController.reset);
    app.post(this.baseUrl + ':user/change-password', allAccess, this.passwordController.changePassword);
    app.post(this.baseUrl + ':user/reset-password/:token', this.passwordController.resetPassword);
    //Test Email
    app.get(this.baseUrl + 'test/:users/:email', this.passwordController.testMail);

    // Social Auth Routes TODO
    // app.get(this.baseUrl + ':user/login/facebook', this.socialAuthController.FBAuthenticate);
    // app.get(this.baseUrl + ':user/callback/facebook', /*redirectSocialUser,*/ this.socialAuthController.FBCallback);
    // app.get(this.baseUrl + ':user/login/google', this.socialAuthController.GoogleAuthenticate);
    // app.get(this.baseUrl + ':user/callback/google', /*redirectSocialUser,*/ this.socialAuthController.GoogleCallback);

    // Categories
    app.get(this.baseUrl + 'categories', this.categoryController.all);
    app.get(this.baseUrl + 'category/:id', this.categoryController.viewOne);
    app.get(this.baseUrl + 'markets', this.publicController.getMarkets);
    app.get(this.baseUrl + 'pickup-details', this.publicController.getPickupDetails);

    app.get(this.baseUrl + 'import_merchant', this.publicController.merchantImport);
    app.get(this.baseUrl + 'import_products', this.publicController.productImport);

    // Sub Categories...
    app.get(this.baseUrl + 'sub-categories/all', this.subCategoryController.index);
    app.get(this.baseUrl + 'sub-categories/:id', this.subCategoryController.fetchByCategoryId);

    // FAQ...
    app.get(this.baseUrl + 'faq-categories/all', this.faqController.all);
    app.get(this.baseUrl + 'faq-categories/:id', this.faqController.findCategory);
    app.get(this.baseUrl + 'faq/:id', this.faqController.findFAQ);

    // Products
    app.get(this.baseUrl + 'products/all', this.productController.all);
    app.get(this.baseUrl + 'all/products', this.productController.allWithCount);
    app.get(this.baseUrl + 'products/merchant/:merchant/:merchantId', this.productController.merchant);
    app.get(this.baseUrl + 'products/search/:search', this.productController.search);
    app.get(this.baseUrl + 'products/approved', this.productController.approved);
    app.get(this.baseUrl + 'products/disapproved', this.productController.disapproved);
    app.get(this.baseUrl + 'products-without-subcat', this.productController.productsWithoutSubCat); //

    //Cart
    app.get(this.baseUrl + 'cart/count', customerAccess, this.cartController.count);
    app.post(this.baseUrl + 'cart/add', customerAccess, this.cartController.create);
    app.post(this.baseUrl + 'cart/remove', customerAccess, this.cartController.delete);
    app.post(this.baseUrl + 'cart/update/:id', customerAccess, this.cartController.update);
    app.get(this.baseUrl + 'cart/all', customerAccess, this.cartController.all);
    app.post(this.baseUrl + 'merchant/negotiate-price', merchantAccess, this.cartController.merchantAddToCart);

    //Messaging
    app.post(this.baseUrl + 'customer/message/create', customerAccess, this.messagesController.createMessage);
    app.get(this.baseUrl + 'customer/messages/list', customerAccess, this.messagesController.getMessageList);
    app.post(this.baseUrl + 'messages/add', allAccess, this.messagesController.addMessage);
    app.get(this.baseUrl + 'messages/:id', allAccess, this.messagesController.getMessages);

    app.get(this.baseUrl + 'merchant/messages/list', merchantAccess, this.messagesController.getMessageList_M);

    app.post(this.baseUrl + 'merchant/adjust_price', merchantAccess, this.messagesController.createAgreedPrice);
    // app.get(this.baseUrl + 'customer/messages/list', customerAccess, this.messagesController.messageList);
    // app.get(this.baseUrl + 'customer/messages/:id', customerAccess, this.messagesController.getMessages);

    //Wishlist
    app.get(this.baseUrl + 'wishlist/count', customerAccess, this.wishController.count);
    app.post(this.baseUrl + 'wishlist/add', customerAccess, this.wishController.create);
    app.post(this.baseUrl + 'wishlist/remove', customerAccess, this.wishController.delete);
    app.post(this.baseUrl + 'wishlist/update', customerAccess, this.wishController.update);
    app.get(this.baseUrl + 'wishlist/all', customerAccess, this.wishController.all);

    //Products
    app.get(this.baseUrl + 'product/:id', this.productController.findProduct);
    app.get(this.baseUrl + 'my-products', merchantAccess, this.productController.myProducts);
    app.get(this.baseUrl + 'products/market/:market', this.productController.fetchByMarket);
    app.get(this.baseUrl + 'products/category/:id', this.productController.fetchByCategory);
    app.get(this.baseUrl + 'products/sub-category/:id', this.productController.fetchBySubCategory);

    // Orders....
    app.get(this.baseUrl + 'orders/stats', this.orderController.orderStats);
    app.get(this.baseUrl + 'orders/all', allAccess, this.orderController.all);
    app.get(this.baseUrl + 'my-orders', merchantAccess, this.orderController.myOrders);
    app.get(this.baseUrl + 'customer/orders', customerAccess, this.orderController.customerOrders); // merge with top function
    app.post(this.baseUrl + 'orders/create', allAccess, this.orderController.createOrder);
    app.get(this.baseUrl + 'orders/view/:orderId', allAccess, this.orderController.viewOrder);
    app.get(this.baseUrl + 'orders/view-details/:orderUUID', customerAdminAccess, this.orderController.viewOrderUUID);
    app.put(this.baseUrl + 'change-order-status/:orderId', allAccess, this.orderController.changeProductOrderStatus);
    app.get(this.baseUrl + 'order-status/all', this.orderController.allOrderStatus);
    app.post(this.baseUrl + 'order-status/create', this.orderController.createOrderStatus);
    app.get(this.baseUrl + 'merchants/all', adminAccess, this.merchantController.all);
    app.get(this.baseUrl + 'merchant/:id', adminAccess, this.merchantController.viewOne);
    app.get(this.baseUrl + 'merchants/search/:search', adminAccess, this.merchantController.searchMerchant);
    app.get(this.baseUrl + 'customers/search/:search', adminAccess, this.customerController.searchCustomer);
    app.get(this.baseUrl + 'orders/search/:search', this.orderController.search);
    app.get(this.baseUrl + 'orders/custom', allAccess, this.orderController.allCustomOrder);
    app.get(this.baseUrl + 'orders/pending', allAccess, this.orderController.allPending);
    app.get(this.baseUrl + 'orders/year/:year', adminAccess, this.orderController.filterByYear);
    app.get(this.baseUrl + 'orders/completed', adminAccess, this.orderController.allCompleted);

    // Get Disputes..
    app.get(this.baseUrl + 'disputes/all', adminAccess, this.disputeController.index);
    app.post(this.baseUrl + 'dispute/new', customerAccess, this.disputeController.create);
    app.put(this.baseUrl + 'dispute/update/:id', adminAccess, this.disputeController.updateDispute);
    app.get(this.baseUrl + 'dispute/pending', adminAccess, this.disputeController.pendingDisputes);
    app.get(this.baseUrl + 'dispute/resolved', adminAccess, this.disputeController.resolvedDisputes);
    //TODO FInd dispute by ID, all base on customer and merchant

    // Get user profile based on user group
    app.get(this.baseUrl + ':user/profile', allAccess, this.authController.profile);
    app.put(this.baseUrl + ':user/profile', allAccess, this.authController.updateProfile);
    app.post(
      this.baseUrl + ':user/upload-profile-picture',
      allAccess,
      upload.single('file'),
      this.authController.uploadProfilePicture,
    );

    // Address book
    app.get(this.baseUrl + 'address-book', customerAccess, this.addressBookController.all);
    app.post(this.baseUrl + 'create-address-book', customerAccess, this.addressBookController.create);

    // protected customer routes
    // Customers
    app.get(this.baseUrl + 'customers/all', adminAccess, this.customerController.index);
    app.get(this.baseUrl + 'customers/approved', adminAccess, this.customerController.approved);
    app.get(this.baseUrl + 'customers/disapproved', adminAccess, this.customerController.disapproved);
    app.get(this.baseUrl + 'customer/approve/:id', adminAccess, this.customerController.approveCustomer);
    app.get(this.baseUrl + 'customer/disapprove/:id', adminAccess, this.customerController.disapproveCustomer);

    app.get(this.baseUrl + 'config/:key', allAccess, this.configController.find);
    app.put(this.baseUrl + 'config/update/:key', adminAccess, this.configController.update);
    app.get(this.baseUrl + 'logistics-partners', adminAccess, this.configController.logisticPartners);
    app.get(this.baseUrl + 'logistic-partner/:partner', adminAccess, this.configController.fetchLogisticPartner);
    app.get(
      this.baseUrl + 'logistic-partner/:partner/:destination',
      adminAccess,
      this.configController.fetchLogisticPartnerAndState,
    );
    app.put(this.baseUrl + 'logistic-partner/update/:id', adminAccess, this.configController.updatePriceTable);
    app.post(this.baseUrl + 'logistic-partner/add', adminAccess, this.configController.create);
    app.delete(this.baseUrl + 'logistic-partner/delete/:id', adminAccess, this.configController.delete);

    // protected admin routes
    // Categories .
    app.post(this.baseUrl + 'categories/create', adminAccess, this.categoryController.create);
    app.put(this.baseUrl + 'categories/update/:id', adminAccess, this.categoryController.update);
    app.delete(this.baseUrl + 'categories/delete/:id', adminAccess, this.categoryController.delete);

    //SUb-categories
    app.post(this.baseUrl + 'sub-categories/create', adminAccess, this.subCategoryController.create);
    app.put(this.baseUrl + 'sub-categories/update/:id', adminAccess, this.subCategoryController.update);
    app.delete(this.baseUrl + 'sub-categories/delete/:id', adminAccess, this.subCategoryController.delete);

    // protected merchant routes..
    app.post(
      this.baseUrl + 'products/image/add/:productId',
      merchantAccess,
      upload.array('file'),
      this.productImageController.create,
    );
    app.post(this.baseUrl + 'products/create', merchantAccess, this.productController.create);
    app.put(this.baseUrl + 'products/update/:id', merchantAdminAccess, this.productController.updateProduct);
    app.put(this.baseUrl + 'merchant/update/:id', adminAccess, this.merchantController.updateMerchant);
    app.delete(this.baseUrl + 'products/delete/:id', merchantAdminAccess, this.productController.deleteProduct);
    app.get(this.baseUrl + 'products/approve/:id', adminAccess, this.productController.approveProduct);
    app.get(this.baseUrl + 'products/disapprove/:id', adminAccess, this.productController.disapproveProduct);
    app.get(this.baseUrl + 'merchant/approve/:id', adminAccess, this.merchantController.approveMerchant);
    app.get(this.baseUrl + 'merchant/disapprove/:id', adminAccess, this.merchantController.disapproveMerchant);
    app.get(this.baseUrl + 'merchants/approved', adminAccess, this.merchantController.approved);
    app.get(this.baseUrl + 'merchants/disapproved', adminAccess, this.merchantController.disapproved);
  }
}

//TODO refactor all routes to collect two parameter and 3 if middle are is needed.
