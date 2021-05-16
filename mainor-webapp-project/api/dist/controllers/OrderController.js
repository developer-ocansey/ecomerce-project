"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const Config_1 = require("../models/Config");
const sequelize_1 = require("sequelize");
const Order_1 = require("../models/Order");
const OrderStatus_1 = require("../models/OrderStatus");
const Cart_1 = require("../models/Cart");
const Category_1 = require("../models/Category");
const Customer_1 = require("../models/Customer");
const Merchant_1 = require("../models/Merchant");
const Product_1 = require("../models/Product");
const ProductImage_1 = require("../models/ProductImage");
const SubCategory_1 = require("../models/SubCategory");
const index_1 = require("../utils/index");
const utils = new index_1.Utils();
class OrderController {
    constructor() {
        // Al Mercant Orders
        this.myOrders = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const offset = req.query.offset ? req.query.offset : 0;
            const limit = req.query.limit ? req.query.limit : 15;
            //
            try {
                const userId = req.user.id;
                yield Order_1.Order.findAndCountAll({
                    where: {
                        merchantId: userId,
                    },
                    offset: Number(offset),
                    limit: Number(limit),
                    include: [
                        {
                            model: Product_1.Product,
                            as: 'product',
                            include: [
                                { model: Category_1.Category, as: 'categories' },
                                { model: SubCategory_1.SubCategory, as: 'subCategories' },
                                { model: Merchant_1.Merchant, as: 'merchantInfo' },
                                { model: ProductImage_1.ProductImage, as: 'productImage' },
                            ],
                        },
                        { model: Customer_1.Customer, as: 'customer' },
                        { model: OrderStatus_1.OrderStatus, as: 'orderStatus' },
                    ],
                })
                    .then((data) => {
                    res.json({ status: true, message: data });
                })
                    .catch((err) => {
                    res.json({ status: false, message: err });
                });
            }
            catch (err) {
                console.log(err);
                res.json({ status: false, message: err });
            }
        });
        this.customerOrders = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const offset = req.query.offset ? req.query.offset : 0;
            const limit = req.query.limit ? req.query.limit : 15;
            try {
                const userId = req.user.id;
                yield Order_1.Order.findAndCountAll({
                    where: {
                        customerId: userId,
                    },
                    offset: Number(offset),
                    limit: Number(limit),
                    attributes: [
                        'orderId',
                        [sequelize_1.Sequelize.fn('SUM', sequelize_1.Sequelize.col('agreedPrice')), 'totalPrice'],
                        'deliveryPrice',
                        'meta',
                        'createdAt'
                    ],
                    group: ['orderId'],
                    include: [
                        {
                            model: Product_1.Product,
                            as: 'product',
                            include: [
                                { model: Category_1.Category, as: 'categories' },
                                { model: SubCategory_1.SubCategory, as: 'subCategories' },
                                { model: Merchant_1.Merchant, as: 'merchantInfo' },
                                { model: ProductImage_1.ProductImage, as: 'productImage' },
                            ],
                        },
                        { model: Customer_1.Customer, as: 'customer' },
                        { model: OrderStatus_1.OrderStatus, as: 'orderStatus' },
                    ],
                })
                    .then((data) => {
                    res.json({ status: true, data: data });
                })
                    .catch((err) => {
                    res.json({ status: false, message: err });
                });
            }
            catch (err) {
                console.log(err);
                res.json({ status: false, message: err });
            }
        });
    }
    all(req, res) {
        const offset = req.query.offset ? req.query.offset : 0;
        const limit = req.query.limit ? req.query.limit : 100;
        Order_1.Order.findAll({
            offset: Number(offset),
            limit: Number(limit),
            group: ['orderId'],
            attributes: {
                include: [[sequelize_1.Sequelize.fn('SUM', sequelize_1.Sequelize.literal(`agreedPrice * quantity`)), 'totalPrice']],
            },
            include: [
                {
                    model: Product_1.Product,
                    as: 'product',
                    include: [
                        { model: Category_1.Category, as: 'categories' },
                        { model: SubCategory_1.SubCategory, as: 'subCategories' },
                        { model: Merchant_1.Merchant, as: 'merchantInfo' },
                        { model: ProductImage_1.ProductImage, as: 'productImage' },
                    ],
                },
                { model: Customer_1.Customer, as: 'customer' },
                { model: OrderStatus_1.OrderStatus, as: 'orderStatus' },
            ],
            order: [['createdAt', 'DESC']],
        })
            .then((orders) => {
            res.status(200).json({ status: true, orders });
        })
            .catch((err) => {
            console.log(err);
            return res.status(500).json({ err: err.toString() });
        });
    }
    filterByYear(req, res) {
        const year = req.params.year;
        const offset = req.query.offset ? req.query.offset : 0;
        const limit = req.query.limit ? req.query.limit : 15;
        Order_1.Order.findAll({
            offset: Number(offset),
            limit: Number(limit),
            where: {
                // createdAt: { [Op.like]: '%' + year + '%' },
                createdAt: {
                    [sequelize_1.Op.gte]: new Date(`${year}-01-01`),
                    [sequelize_1.Op.lt]: new Date(`${year}-12-31`),
                },
            },
        })
            .then((orders) => {
            res.status(200).json({ status: true, orders });
        })
            .catch((err) => {
            return res.status(500).json({ err });
        });
    }
    allPending(req, res) {
        const offset = req.query.offset ? req.query.offset : 0;
        const limit = req.query.limit ? req.query.limit : 15;
        Order_1.Order.findAll({
            offset: Number(offset),
            limit: Number(limit),
            where: {
                orderStatusId: 1,
            },
            include: [
                {
                    model: Product_1.Product,
                    as: 'product',
                    include: [
                        { model: Category_1.Category, as: 'categories' },
                        { model: SubCategory_1.SubCategory, as: 'subCategories' },
                        { model: Merchant_1.Merchant, as: 'merchantInfo' },
                    ],
                },
                { model: Customer_1.Customer, as: 'customer' },
                { model: OrderStatus_1.OrderStatus, as: 'orderStatus' },
            ],
            order: [['createdAt', 'DESC']],
        })
            .then((orders) => {
            res.status(200).json({ status: true, orders });
        })
            .catch((err) => {
            return res.status(500).json({ err });
        });
    }
    allCustomOrder(req, res) {
        const offset = req.query.offset ? req.query.offset : 0;
        const limit = req.query.limit ? req.query.limit : 15;
        Order_1.Order.findAll({
            offset: Number(offset),
            limit: Number(limit),
            where: {
                orderType: 'Custom',
            },
            include: [
                {
                    model: Product_1.Product,
                    as: 'product',
                    include: [
                        { model: Category_1.Category, as: 'categories' },
                        { model: SubCategory_1.SubCategory, as: 'subCategories' },
                        { model: Merchant_1.Merchant, as: 'merchantInfo' },
                    ],
                },
                { model: Customer_1.Customer, as: 'customer' },
                { model: OrderStatus_1.OrderStatus, as: 'orderStatus' },
            ],
            order: [['createdAt', 'DESC']],
        })
            .then((orders) => {
            res.status(200).json({ status: true, orders });
        })
            .catch((err) => {
            return res.status(500).json({ err });
        });
    }
    viewOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const orderId = req.params.orderId;
            if (!orderId) {
                res.status(400).json({ status: false, message: 'OrderId not passed' });
            }
            else {
                Order_1.Order.findOne({
                    where: {
                        id: orderId,
                    },
                    include: [
                        {
                            model: Product_1.Product,
                            as: 'product',
                            include: [
                                { model: Category_1.Category, as: 'categories' },
                                { model: SubCategory_1.SubCategory, as: 'subCategories' },
                                { model: Merchant_1.Merchant, as: 'merchantInfo' },
                                { model: ProductImage_1.ProductImage, as: 'productImage' },
                            ],
                        },
                        { model: Customer_1.Customer, as: 'customer' },
                        { model: OrderStatus_1.OrderStatus, as: 'orderStatus' },
                    ],
                })
                    .then((order) => {
                    res.status(200).json({ status: true, order });
                })
                    .catch((err) => {
                    res.status(500).json({ err, status: false });
                });
            }
        });
    }
    viewOrderUUID(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const orderId = req.params.orderUUID;
            if (!orderId) {
                res.status(400).json({ status: false, message: 'OrderId not passed' });
            }
            else {
                Order_1.Order.findAll({
                    where: {
                        orderId: orderId,
                    },
                    include: [
                        {
                            model: Product_1.Product,
                            as: 'product',
                            include: [
                                { model: Category_1.Category, as: 'categories' },
                                { model: SubCategory_1.SubCategory, as: 'subCategories' },
                                { model: Merchant_1.Merchant, as: 'merchantInfo' },
                                { model: ProductImage_1.ProductImage, as: 'productImage' },
                            ],
                        },
                        { model: Customer_1.Customer, as: 'customer' },
                        { model: OrderStatus_1.OrderStatus, as: 'orderStatus' },
                    ],
                })
                    .then((order) => {
                    res.status(200).json({ status: true, order });
                })
                    .catch((err) => {
                    res.status(500).json({ err, status: false });
                });
            }
        });
    }
    createOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = req.body;
            // Check that all fields are filled
            if (!req.body.orderId ||
                !req.body.productId ||
                !req.body.merchantId ||
                !req.body.agreedPrice ||
                !req.body.quantity ||
                !req.body.deliveryInformation ||
                !req.body.deliveryPartnerId ||
                !req.body.deliveryPrice ||
                !req.body.paymentStatus ||
                !req.body.paymentMethod ||
                !req.body.orderType ||
                !req.body.orderStatusId) {
                // console.log("parameter still dy miss")
                return res.status(400).json({
                    status: false,
                    message: 'All fields are required',
                });
            }
            else {
                const productId = req.body.productId;
                const merchantId = req.body.merchantId;
                const customerId = req.body.customerId ? req.body.customerId : req.user.id;
                const orderStatusId = req.body.orderStatusId;
                // Make sure that ProductId, CustomerId, OrderStatusId are valid
                const productIdExist = yield Product_1.Product.findOne({ where: { id: productId } });
                const customerIdExist = yield Customer_1.Customer.findOne({ where: { id: customerId } });
                const merchantIdExist = yield Merchant_1.Merchant.findOne({ where: { id: merchantId } });
                const orderStatusIdExist = yield OrderStatus_1.OrderStatus.findOne({ where: { id: orderStatusId } });
                // console.log("order code got here")
                let notExist = '';
                if (productIdExist === null) {
                    notExist += 'productID, ';
                }
                if (customerIdExist === null) {
                    notExist += 'customerId, ';
                }
                if (orderStatusIdExist === null) {
                    notExist += 'orderStatusId, ';
                }
                if (merchantIdExist === null) {
                    notExist += 'merchantId, ';
                }
                if (productIdExist === null ||
                    customerIdExist === null ||
                    merchantIdExist === null ||
                    orderStatusIdExist === null) {
                    console.log(`${notExist}does not exist`);
                    return res.status(400).json({
                        status: false,
                        message: `${notExist}does not exist`,
                    });
                }
                else {
                    // Get the available goods in stock and check if it meets order quantity
                    const availableGIS = productIdExist.goodsInStock;
                    if (availableGIS === 0) {
                        return res.json({ status: false, message: 'No Goods In Stock for this product' });
                    }
                    else if (req.body.quantity > availableGIS) {
                        return res.json({
                            status: false,
                            message: 'Not enough Goods In Stock for this product',
                            quantityDemanded: req.body.quantity,
                            goodsInStock: availableGIS,
                        });
                    }
                    else {
                        const newGIS = availableGIS - req.body.quantity;
                        yield Product_1.Product.update({ goodsInStock: newGIS }, {
                            where: {
                                id: req.body.productId,
                            },
                        });
                        // Create Order
                        params.customerId = customerId;
                        Order_1.Order.create(params)
                            .then((order) => {
                            //both the merchant and customer receives an email when an order is created
                            const Maildata = {};
                            Maildata['subject'] = 'Bcd.ng: New Order';
                            Maildata['to'] = merchantIdExist.email;
                            Maildata['customeremail'] = customerIdExist.email;
                            Maildata['from'] = process.env.FROM_EMAIL;
                            Maildata['MerchantfirstName'] = merchantIdExist.firstName;
                            Maildata['CustomerfirstName'] = customerIdExist.firstName;
                            Maildata['productName'] = productIdExist.name;
                            Maildata['templatehtml'] = 'customerMerchantOrder.html';
                            utils.sendEmail(Maildata);
                            const Maildata1 = {};
                            Maildata1['subject'] = 'Bcd.ng: New Order';
                            // Maildata1['merchantemail'] = merchantIdExist.email;
                            Maildata1['to'] = customerIdExist.email;
                            Maildata1['from'] = process.env.FROM_EMAIL;
                            Maildata1['CustomerfirstName'] = customerIdExist.firstName;
                            Maildata1['orderId'] = req.body.orderId;
                            Maildata1['templatehtml'] = 'customerOrder.html';
                            utils.sendEmail(Maildata1);
                            // console.log("cartID",req.body.cartId)
                            if (req.body.cartId !== 0 || req.body.cartId !== '0') {
                                Cart_1.Cart.destroy({
                                    where: { customerId: customerId },
                                })
                                    .then(() => {
                                    return res.status(201).json(order);
                                })
                                    .catch((err) => {
                                    return res.status(500).json({
                                        err,
                                        status: false,
                                    });
                                });
                            }
                        })
                            .catch((err) => {
                            return res.status(500).json({ err });
                        });
                    }
                }
            }
        });
    }
    orderStats(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let profitPercentage = 0.05;
            const insurance = yield Config_1.Config.findOne({ where: { id: 2 } });
            const stats = yield Order_1.Order.findAll({
                attributes: [[sequelize_1.Sequelize.fn('sum', sequelize_1.Sequelize.col('agreedPrice')), 'totalTransactions']],
            })
                .then((data) => {
                res.status(200).json({
                    status: true,
                    data: data[0],
                    insurance: insurance.value,
                });
            })
                .catch((err) => {
                res.status(500).json(err);
            });
        });
    }
    changeProductOrderStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const orderId = req.params.orderId;
            const orderStatusId = req.body.orderStatusId;
            const customerId = req.body.customerId;
            const merchantId = req.body.merchantId;
            if (!orderId || !orderStatusId) {
                res.json({ status: false, message: 'Make sure OrderId and OrderStausId is passed' });
            }
            else {
                const orderIdExist = yield Order_1.Order.findOne({ where: { orderId: orderId } });
                const orderStatusIdExist = yield OrderStatus_1.OrderStatus.findOne({ where: { id: orderStatusId } });
                const customerIdExist = yield Customer_1.Customer.findOne({ where: { id: customerId } });
                const merchantIdExist = yield Merchant_1.Merchant.findOne({ where: { id: merchantId } });
                let notExist = '';
                if (orderIdExist === null) {
                    notExist += 'OrderId, ';
                }
                if (orderStatusIdExist === null) {
                    notExist += 'OrderStatusId, ';
                }
                if (customerIdExist === null || merchantIdExist === null) {
                    res.status(400).json({ status: false, message: `$customer or merchant does not exist` });
                }
                if (orderIdExist === null || orderStatusIdExist === null) {
                    res.status(400).json({ status: false, message: `${notExist}does not exist` });
                }
                else {
                    Order_1.Order.update({ orderStatusId }, {
                        where: {
                            orderId: orderId,
                        },
                    })
                        .then((order) => __awaiter(this, void 0, void 0, function* () {
                        let status;
                        switch (orderStatusId) {
                            case '1':
                                status = 'pending';
                                break;
                            case '4':
                                status = 'processing';
                                //only customer receives an mail indicating order is being shipped
                                const Maildata2 = {};
                                Maildata2['subject'] = `Bcd.ng: Update on your Order ${orderIdExist.orderId}`;
                                // Maildata1['merchantemail'] = merchantIdExist.email;
                                Maildata2['to'] = customerIdExist.email;
                                Maildata2['from'] = process.env.FROM_EMAIL;
                                Maildata2['CustomerfirstName'] = customerIdExist.firstName;
                                Maildata2['orderId'] = orderIdExist.orderId;
                                Maildata2['newOrderStatus'] = status;
                                Maildata2['templatehtml'] = 'CustomerChangeOrderProcess.html';
                                utils.sendEmail(Maildata2);
                                break;
                            case '3':
                                status = 'completed';
                                //merchant and customer receives mail when order is completed
                                const Maildata1 = {};
                                Maildata1['subject'] = `Bcd.ng: Update on your Order ${orderIdExist.orderId}`;
                                // Maildata1['merchantemail'] = merchantIdExist.email;
                                Maildata1['to'] = merchantIdExist.email;
                                Maildata1['from'] = process.env.FROM_EMAIL;
                                Maildata1['MerchantfirstName'] = merchantIdExist.firstName;
                                Maildata1['orderId'] = orderIdExist.orderId;
                                Maildata1['newOrderStatus'] = status;
                                Maildata1['templatehtml'] = 'ChangeOrderMerchantDeliver.html';
                                utils.sendEmail(Maildata1);
                                const Maildata3 = {};
                                Maildata3['subject'] = `Bcd.ng: Update on Order ${orderIdExist.orderId}`;
                                // Maildata1['merchantemail'] = merchantIdExist.email;
                                Maildata3['to'] = customerIdExist.email;
                                Maildata3['from'] = process.env.FROM_EMAIL;
                                Maildata3['CustomerfirstName'] = customerIdExist.firstName;
                                Maildata3['orderId'] = orderIdExist.orderId;
                                Maildata3['newOrderStatus'] = status;
                                Maildata3['templatehtml'] = 'ChangeOrderDeliver.html';
                                utils.sendEmail(Maildata3);
                                break;
                            case '2':
                                status = 'canceled';
                                break;
                            default:
                                status = 'Unknown';
                                break;
                        }
                        res.json({
                            status: true,
                            message: `Order status changed successfully to ${status}`,
                        });
                    }))
                        .catch((err) => {
                        console.log(err);
                        res.status(500).json({ status: false, error: err.toString() });
                    });
                }
            }
        });
    }
    createOrderStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = req.body;
            if (!req.body.status || !req.body.description) {
                res.status(400).json({ status: false, message: 'All fields are required' });
            }
            else {
                const statusExist = yield OrderStatus_1.OrderStatus.findOne({ where: { status: req.body.status } });
                if (statusExist === null) {
                    OrderStatus_1.OrderStatus.create(params)
                        .then((orderStatus) => {
                        res.status(201).json({ orderStatus });
                    })
                        .catch((err) => {
                        res.status(500).json({ err: err.toString() });
                    });
                }
            }
        });
    }
    allOrderStatus(req, res) {
        const offset = req.query.offset ? req.query.offset : 0;
        const limit = req.query.limit ? req.query.limit : 15;
        OrderStatus_1.OrderStatus.findAll({
            offset: Number(offset),
            limit: Number(limit),
            order: [['createdAt', 'DESC']],
        })
            .then((orderStatuses) => {
            res.status(200).json({ status: true, orderStatuses });
        })
            .catch((err) => {
            res.json({ err });
        });
    }
    allCompleted(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const offset = req.query.offset ? req.query.offset : 0;
            const limit = req.query.limit ? req.query.limit : 15;
            //
            try {
                yield Order_1.Order.findAndCountAll({
                    where: {
                        orderStatusId: 3,
                    },
                    offset: Number(offset),
                    limit: Number(limit),
                    include: [
                        {
                            model: Product_1.Product,
                            as: 'product',
                            include: [
                                { model: Category_1.Category, as: 'categories' },
                                { model: SubCategory_1.SubCategory, as: 'subCategories' },
                                { model: Merchant_1.Merchant, as: 'merchantInfo' },
                            ],
                        },
                        { model: Customer_1.Customer, as: 'customer' },
                        { model: OrderStatus_1.OrderStatus, as: 'orderStatus' },
                    ],
                })
                    .then((data) => {
                    res.json({ status: true, data: data });
                })
                    .catch((err) => {
                    res.json({ status: false, message: err });
                });
            }
            catch (err) {
                console.log(err);
                res.json({ status: false, message: err });
            }
        });
    }
    search(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const offset = req.query.offset ? req.query.offset : 0;
            const limit = req.query.limit ? req.query.limit : 15;
            const searchQuery = req.params.search;
            if (!searchQuery) {
                return res.json({ status: false, message: 'Invalid search parameters' });
            }
            yield Order_1.Order.findAll({
                where: {
                    [sequelize_1.Op.or]: [
                        {
                            '$customer.firstName$': {
                                [sequelize_1.Op.like]: `%${searchQuery}%`,
                            },
                        },
                        {
                            '$customer.lastName$': {
                                [sequelize_1.Op.like]: `%${searchQuery}%`,
                            },
                        },
                        {
                            orderId: {
                                [sequelize_1.Op.like]: `%${searchQuery}%`,
                            },
                        },
                    ],
                },
                group: ['Order.id'],
                include: [
                    { model: Customer_1.Customer, as: 'customer' },
                    { model: OrderStatus_1.OrderStatus, as: 'orderStatus' },
                    {
                        model: Product_1.Product,
                        as: 'product',
                        include: [
                            { model: Category_1.Category, as: 'categories' },
                            { model: SubCategory_1.SubCategory, as: 'subCategories' },
                            { model: Merchant_1.Merchant, as: 'merchantInfo' },
                            { model: ProductImage_1.ProductImage, as: 'productImage' },
                        ],
                    },
                ],
            })
                .then((results) => {
                res.json({ status: true, data: results, message: 'Successfull' });
            })
                .catch((err) => {
                console.log(err);
                res.json({ status: false, err });
            });
        });
    }
}
exports.OrderController = OrderController;
