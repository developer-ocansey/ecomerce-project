"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Routes = void 0;
const auth_1 = require("../middleware/auth");
const AddressBookController_1 = require("../controllers/AddressBookController");
const AuthController_1 = require("../controllers/Auth/AuthController");
const CartController_1 = require("../controllers/CartController");
const CategoryController_1 = require("../controllers/CategoryController");
const ConfigController_1 = require("../controllers/ConfigController");
const CustomerController_1 = require("../controllers/CustomerController");
const DisputeController_1 = require("../controllers/DisputeController");
const FAQController_1 = require("../controllers/FAQController");
const MerchantController_1 = require("../controllers/MerchantController");
const MessagesController_1 = require("../controllers/MessagesController");
const OrderController_1 = require("../controllers/OrderController");
const PasswordController_1 = require("../controllers/Auth/PasswordController");
const ProductController_1 = require("../controllers/ProductController");
const ProductImageController_1 = require("../controllers/ProductImageController");
const PublicController_1 = require("../controllers/PublicController");
const SocialAuthController_1 = require("../controllers/Auth/SocialAuthController");
const SubCategoryController_1 = require("../controllers/SubCategoryController");
const WishlistController_1 = require("../controllers/WishlistController");
const multer_config_1 = __importDefault(require("../config/multer.config"));
class Routes {
    constructor() {
        // Controllers
        this.authController = new AuthController_1.AuthController();
        this.passwordController = new PasswordController_1.PasswordController();
        this.socialAuthController = new SocialAuthController_1.SocialAuthController();
        this.publicController = new PublicController_1.PublicController();
        this.customerController = new CustomerController_1.CustomerController();
        this.categoryController = new CategoryController_1.CategoryController();
        this.subCategoryController = new SubCategoryController_1.SubCategoryController();
        this.productController = new ProductController_1.ProductController();
        this.merchantController = new MerchantController_1.MerchantController();
        this.orderController = new OrderController_1.OrderController();
        this.cartController = new CartController_1.CartController();
        this.wishController = new WishlistController_1.WishController();
        this.disputeController = new DisputeController_1.DisputeController();
        this.productImageController = new ProductImageController_1.ProductImageController();
        this.addressBookController = new AddressBookController_1.AddressBookController();
        this.faqController = new FAQController_1.FAQController();
        this.messagesController = new MessagesController_1.MessagesController();
        this.configController = new ConfigController_1.ConfigController();
        this.baseUrl = process.env.BASE_URL || '/api/v1/';
    }
    routes(app) {
        // Public Routes
        app.get(this.baseUrl + 'healthz', this.publicController.healthz);
        app.post(this.baseUrl + 'upload-to-aws', multer_config_1.default.single('file'), this.publicController.upload);
        app.post(this.baseUrl + 'upload-to-aws-multiple', multer_config_1.default.array('file'), this.publicController.uploadMultiple);
        // Overview
        app.get(this.baseUrl + 'overview', auth_1.adminAccess, this.publicController.overview);
        app.get(this.baseUrl + 'logistics/:partner/:weight/:destination', auth_1.allAccess, this.publicController.getPrices);
        // Authentication.....
        app.post(this.baseUrl + ':user/register', this.authController.register);
        app.post(this.baseUrl + ':user/login', this.authController.login);
        app.post(this.baseUrl + ':user/resend', this.authController.resendToken);
        app.get(this.baseUrl + ':user/verify/:token', this.authController.verify);
        app.post(this.baseUrl + ':user/recover', this.passwordController.recover);
        app.get(this.baseUrl + ':user/reset/:token', this.passwordController.reset);
        app.post(this.baseUrl + ':user/change-password', auth_1.allAccess, this.passwordController.changePassword);
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
        app.get(this.baseUrl + 'cart/count', auth_1.customerAccess, this.cartController.count);
        app.post(this.baseUrl + 'cart/add', auth_1.customerAccess, this.cartController.create);
        app.post(this.baseUrl + 'cart/remove', auth_1.customerAccess, this.cartController.delete);
        app.post(this.baseUrl + 'cart/update/:id', auth_1.customerAccess, this.cartController.update);
        app.get(this.baseUrl + 'cart/all', auth_1.customerAccess, this.cartController.all);
        app.post(this.baseUrl + 'merchant/negotiate-price', auth_1.merchantAccess, this.cartController.merchantAddToCart);
        //Messaging
        app.post(this.baseUrl + 'customer/message/create', auth_1.customerAccess, this.messagesController.createMessage);
        app.get(this.baseUrl + 'customer/messages/list', auth_1.customerAccess, this.messagesController.getMessageList);
        app.post(this.baseUrl + 'messages/add', auth_1.allAccess, this.messagesController.addMessage);
        app.get(this.baseUrl + 'messages/:id', auth_1.allAccess, this.messagesController.getMessages);
        app.get(this.baseUrl + 'merchant/messages/list', auth_1.merchantAccess, this.messagesController.getMessageList_M);
        app.post(this.baseUrl + 'merchant/adjust_price', auth_1.merchantAccess, this.messagesController.createAgreedPrice);
        // app.get(this.baseUrl + 'customer/messages/list', customerAccess, this.messagesController.messageList);
        // app.get(this.baseUrl + 'customer/messages/:id', customerAccess, this.messagesController.getMessages);
        //Wishlist
        app.get(this.baseUrl + 'wishlist/count', auth_1.customerAccess, this.wishController.count);
        app.post(this.baseUrl + 'wishlist/add', auth_1.customerAccess, this.wishController.create);
        app.post(this.baseUrl + 'wishlist/remove', auth_1.customerAccess, this.wishController.delete);
        app.post(this.baseUrl + 'wishlist/update', auth_1.customerAccess, this.wishController.update);
        app.get(this.baseUrl + 'wishlist/all', auth_1.customerAccess, this.wishController.all);
        //Products
        app.get(this.baseUrl + 'product/:id', this.productController.findProduct);
        app.get(this.baseUrl + 'my-products', auth_1.merchantAccess, this.productController.myProducts);
        app.get(this.baseUrl + 'products/market/:market', this.productController.fetchByMarket);
        app.get(this.baseUrl + 'products/category/:id', this.productController.fetchByCategory);
        app.get(this.baseUrl + 'products/sub-category/:id', this.productController.fetchBySubCategory);
        // Orders....
        app.get(this.baseUrl + 'orders/stats', this.orderController.orderStats);
        app.get(this.baseUrl + 'orders/all', auth_1.allAccess, this.orderController.all);
        app.get(this.baseUrl + 'my-orders', auth_1.merchantAccess, this.orderController.myOrders);
        app.get(this.baseUrl + 'customer/orders', auth_1.customerAccess, this.orderController.customerOrders); // merge with top function
        app.post(this.baseUrl + 'orders/create', auth_1.allAccess, this.orderController.createOrder);
        app.get(this.baseUrl + 'orders/view/:orderId', auth_1.allAccess, this.orderController.viewOrder);
        app.get(this.baseUrl + 'orders/view-details/:orderUUID', auth_1.customerAdminAccess, this.orderController.viewOrderUUID);
        app.put(this.baseUrl + 'change-order-status/:orderId', auth_1.allAccess, this.orderController.changeProductOrderStatus);
        app.get(this.baseUrl + 'order-status/all', this.orderController.allOrderStatus);
        app.post(this.baseUrl + 'order-status/create', this.orderController.createOrderStatus);
        app.get(this.baseUrl + 'merchants/all', auth_1.adminAccess, this.merchantController.all);
        app.get(this.baseUrl + 'merchant/:id', auth_1.adminAccess, this.merchantController.viewOne);
        app.get(this.baseUrl + 'merchants/search/:search', auth_1.adminAccess, this.merchantController.searchMerchant);
        app.get(this.baseUrl + 'customers/search/:search', auth_1.adminAccess, this.customerController.searchCustomer);
        app.get(this.baseUrl + 'orders/search/:search', this.orderController.search);
        app.get(this.baseUrl + 'orders/custom', auth_1.allAccess, this.orderController.allCustomOrder);
        app.get(this.baseUrl + 'orders/pending', auth_1.allAccess, this.orderController.allPending);
        app.get(this.baseUrl + 'orders/year/:year', auth_1.adminAccess, this.orderController.filterByYear);
        app.get(this.baseUrl + 'orders/completed', auth_1.adminAccess, this.orderController.allCompleted);
        // Get Disputes..
        app.get(this.baseUrl + 'disputes/all', auth_1.adminAccess, this.disputeController.index);
        app.post(this.baseUrl + 'dispute/new', auth_1.customerAccess, this.disputeController.create);
        app.put(this.baseUrl + 'dispute/update/:id', auth_1.adminAccess, this.disputeController.updateDispute);
        app.get(this.baseUrl + 'dispute/pending', auth_1.adminAccess, this.disputeController.pendingDisputes);
        app.get(this.baseUrl + 'dispute/resolved', auth_1.adminAccess, this.disputeController.resolvedDisputes);
        //TODO FInd dispute by ID, all base on customer and merchant
        // Get user profile based on user group
        app.get(this.baseUrl + ':user/profile', auth_1.allAccess, this.authController.profile);
        app.put(this.baseUrl + ':user/profile', auth_1.allAccess, this.authController.updateProfile);
        app.post(this.baseUrl + ':user/upload-profile-picture', auth_1.allAccess, multer_config_1.default.single('file'), this.authController.uploadProfilePicture);
        // Address book
        app.get(this.baseUrl + 'address-book', auth_1.customerAccess, this.addressBookController.all);
        app.post(this.baseUrl + 'create-address-book', auth_1.customerAccess, this.addressBookController.create);
        // protected customer routes
        // Customers
        app.get(this.baseUrl + 'customers/all', auth_1.adminAccess, this.customerController.index);
        app.get(this.baseUrl + 'customers/approved', auth_1.adminAccess, this.customerController.approved);
        app.get(this.baseUrl + 'customers/disapproved', auth_1.adminAccess, this.customerController.disapproved);
        app.get(this.baseUrl + 'customer/approve/:id', auth_1.adminAccess, this.customerController.approveCustomer);
        app.get(this.baseUrl + 'customer/disapprove/:id', auth_1.adminAccess, this.customerController.disapproveCustomer);
        app.get(this.baseUrl + 'config/:key', auth_1.allAccess, this.configController.find);
        app.put(this.baseUrl + 'config/update/:key', auth_1.adminAccess, this.configController.update);
        app.get(this.baseUrl + 'logistics-partners', auth_1.adminAccess, this.configController.logisticPartners);
        app.get(this.baseUrl + 'logistic-partner/:partner', auth_1.adminAccess, this.configController.fetchLogisticPartner);
        app.get(this.baseUrl + 'logistic-partner/:partner/:destination', auth_1.adminAccess, this.configController.fetchLogisticPartnerAndState);
        app.put(this.baseUrl + 'logistic-partner/update/:id', auth_1.adminAccess, this.configController.updatePriceTable);
        app.post(this.baseUrl + 'logistic-partner/add', auth_1.adminAccess, this.configController.create);
        app.delete(this.baseUrl + 'logistic-partner/delete/:id', auth_1.adminAccess, this.configController.delete);
        // protected admin routes
        // Categories .
        app.post(this.baseUrl + 'categories/create', auth_1.adminAccess, this.categoryController.create);
        app.put(this.baseUrl + 'categories/update/:id', auth_1.adminAccess, this.categoryController.update);
        app.delete(this.baseUrl + 'categories/delete/:id', auth_1.adminAccess, this.categoryController.delete);
        //SUb-categories
        app.post(this.baseUrl + 'sub-categories/create', auth_1.adminAccess, this.subCategoryController.create);
        app.put(this.baseUrl + 'sub-categories/update/:id', auth_1.adminAccess, this.subCategoryController.update);
        app.delete(this.baseUrl + 'sub-categories/delete/:id', auth_1.adminAccess, this.subCategoryController.delete);
        // protected merchant routes..
        app.post(this.baseUrl + 'products/image/add/:productId', auth_1.merchantAccess, multer_config_1.default.array('file'), this.productImageController.create);
        app.post(this.baseUrl + 'products/create', auth_1.merchantAccess, this.productController.create);
        app.put(this.baseUrl + 'products/update/:id', auth_1.merchantAdminAccess, this.productController.updateProduct);
        app.put(this.baseUrl + 'merchant/update/:id', auth_1.adminAccess, this.merchantController.updateMerchant);
        app.delete(this.baseUrl + 'products/delete/:id', auth_1.merchantAdminAccess, this.productController.deleteProduct);
        app.get(this.baseUrl + 'products/approve/:id', auth_1.adminAccess, this.productController.approveProduct);
        app.get(this.baseUrl + 'products/disapprove/:id', auth_1.adminAccess, this.productController.disapproveProduct);
        app.get(this.baseUrl + 'merchant/approve/:id', auth_1.adminAccess, this.merchantController.approveMerchant);
        app.get(this.baseUrl + 'merchant/disapprove/:id', auth_1.adminAccess, this.merchantController.disapproveMerchant);
        app.get(this.baseUrl + 'merchants/approved', auth_1.adminAccess, this.merchantController.approved);
        app.get(this.baseUrl + 'merchants/disapproved', auth_1.adminAccess, this.merchantController.disapproved);
    }
}
exports.Routes = Routes;
//TODO refactor all routes to collect two parameter and 3 if middle are is needed.
