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
exports.CartController = void 0;
const Cart_1 = require("../models/Cart");
const Merchant_1 = require("../models/Merchant");
const Product_1 = require("../models/Product");
const ProductImage_1 = require("../models/ProductImage");
class CartController {
    count(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const customerId = req.user.id;
            yield Cart_1.Cart.count({
                where: { customerId: customerId },
            })
                .then((count) => {
                res.status(200).json({ status: true, data: count });
            })
                .catch((err) => {
                res.status(500).json(err);
            });
        });
    }
    all(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const customerId = req.user.id;
            yield Cart_1.Cart.findAndCountAll({
                where: { customerId: customerId },
                include: [
                    { model: Product_1.Product, as: 'product', include: [{ model: Merchant_1.Merchant, as: 'merchantInfo' }, { model: ProductImage_1.ProductImage, as: 'productImage' }] },
                ]
            })
                .then((result) => {
                res.status(200).json({ status: true, data: result, message: 'successful' });
            })
                .catch((err) => {
                res.status(500).json(err);
            });
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = req.body;
            const customerId = req.user.id;
            const productId = req.body.productId;
            if (!req.body.productId || !req.body.quantity) {
                res.status(400).json({
                    status: false,
                    message: 'All Fields are required',
                });
            }
            else {
                const checkCart = yield Cart_1.Cart.findOne({
                    where: {
                        customerId: customerId,
                        productId: productId
                    },
                });
                if (checkCart !== null) {
                    res.status(200).json({
                        status: false,
                        message: 'Product already add to cart',
                    });
                }
                else {
                    params.customerId = customerId;
                    Cart_1.Cart.create(params)
                        .then((data) => res.status(201).json(data))
                        .catch((err) => res.status(500).json(err));
                }
            }
        });
    }
    merchantAddToCart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = req.body;
            const customerId = req.body.customerId;
            const productId = req.body.productId;
            if (!req.body.customerId || !req.body.productId || !req.body.quantity || !req.body.negotiatedPrice) {
                res.status(400).json({
                    status: false,
                    message: 'All Fields are required',
                });
            }
            else {
                const checkCart = yield Cart_1.Cart.findOne({
                    where: {
                        customerId: customerId,
                        productId: productId
                    },
                });
                if (checkCart !== null) {
                    Cart_1.Cart.update(req.body, {
                        where: {
                            customerId: customerId,
                            productId: productId
                        }
                    })
                        .then(((affectedRows) => res.status(201).json(affectedRows)))
                        .catch((err) => res.status(500).json(err));
                    res.status(200).json({
                        status: false,
                        message: 'Price Updated',
                    });
                }
                else {
                    params.customerId = customerId;
                    params.insure = true;
                    Cart_1.Cart.create(params)
                        .then((data) => res.status(201).json(data))
                        .catch((err) => res.status(500).json(err));
                }
            }
        });
    }
    update(req, res) {
        Cart_1.Cart.update(req.body, {
            fields: Object.keys(req.body),
            where: { id: req.params.id },
        })
            .then((affectedRows) => {
            if (Number(affectedRows) === 0) {
                res.json({
                    status: false,
                    message: 'Cart ID does not exist',
                });
            }
            else {
                res.json({
                    status: true,
                    message: 'Cart Updated Successfully',
                    affectedRows: Number(affectedRows),
                });
            }
        })
            .catch((err) => {
            res.json({
                err,
                status: false,
            });
        });
    }
    delete(req, res) {
        const cartId = req.body.id;
        Cart_1.Cart.destroy({
            where: { id: cartId },
        })
            .then(() => {
            res.status(200).json({
                status: true,
                message: 'Product Deleted Successfully',
            });
        })
            .catch((err) => {
            res.status(500).json({
                err,
                status: false,
            });
        });
    }
}
exports.CartController = CartController;
